export const WISHES_PATH = 'weddings/thang-quynh-20261129/wishes'

export function readFirebaseConfig(env = {}) {
 const value = key => typeof env[key] === 'string' ? env[key].trim() : ''
 const config = {
  apiKey: value('VITE_FIREBASE_API_KEY'),
  projectId: value('VITE_FIREBASE_PROJECT_ID'),
  appId: value('VITE_FIREBASE_APP_ID'),
  authDomain: value('VITE_FIREBASE_AUTH_DOMAIN'),
 }
 if (!config.apiKey || !config.projectId || !config.appId) return null
 if (env.PROD && config.projectId.startsWith('demo-')) return null
 config.authDomain ||= `${config.projectId}.firebaseapp.com`
 return config
}

export function validateWish(input) {
 const clean = value => typeof value === 'string' ? value.replace(/[\p{Cf}]/gu, '').trim() : ''
 const wish = { name: clean(input.name), message: clean(input.message) }
 if (!wish.name || wish.name.length > 80 || !wish.message || wish.message.length > 1000) {
  throw Object.assign(new Error('Bạn điền tên và lời chúc trước khi gửi nhé.'), { code: 'guestbook/invalid' })
 }
 return wish
}

export async function connectFirebaseWishes(env) {
 const config = readFirebaseConfig(env)
 if (!config) throw Object.assign(new Error('Firebase is not configured'), { code: 'guestbook/unconfigured' })
 const [appSDK, authSDK, dbSDK] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')])
 const app = appSDK.getApps().find(app => app.name === 'thang-quynh-guestbook') || appSDK.initializeApp(config, 'thang-quynh-guestbook')
 const db = dbSDK.getFirestore(app), auth = authSDK.getAuth(app)
 if (env.DEV && env.VITE_FIREBASE_EMULATORS === 'true') {
  if (!config.projectId.startsWith('demo-')) throw new Error('Emulators require a demo project')
  dbSDK.connectFirestoreEmulator(db, '127.0.0.1', 8080)
  authSDK.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
 }
 let signingIn
 return {
  subscribe(onWishes, onError) {
   const query = dbSDK.query(dbSDK.collection(db, WISHES_PATH), dbSDK.orderBy('createdAt', 'desc'), dbSDK.limit(50))
   return dbSDK.onSnapshot(query, { includeMetadataChanges: true }, snapshot => {
    // A local pending write is never presented as a saved public wish.
    const wishes = snapshot.docs.filter(doc => !doc.metadata.hasPendingWrites).map(doc => ({ id: doc.id, ...doc.data() }))
    onWishes(wishes, { fromCache: snapshot.metadata.fromCache })
   }, onError)
  },
  async send(input) {
   const wish = validateWish(input)
   if (!auth.currentUser) {
    signingIn ||= authSDK.signInAnonymously(auth).finally(() => { signingIn = null })
    await signingIn
   }
   const ref = dbSDK.doc(db, WISHES_PATH, auth.currentUser.uid)
   // The transaction requires a server acknowledgement and handles duplicate tabs.
   await dbSDK.runTransaction(db, async transaction => {
    if ((await transaction.get(ref)).exists()) {
     throw Object.assign(new Error('Wish already sent'), { code: 'guestbook/already-sent' })
    }
    transaction.set(ref, { ...wish, createdAt: dbSDK.serverTimestamp() })
   })
  },
 }
}
