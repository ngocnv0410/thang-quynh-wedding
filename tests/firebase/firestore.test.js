import { before, after, beforeEach, test } from 'node:test'
import { readFileSync } from 'node:fs'
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { doc, setDoc, getDocs, collection, query, limit, serverTimestamp, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore'
import { WISHES_PATH } from '../../src/firebase-wishes.js'

const projectId = 'demo-thang-quynh'
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error('Run with the local Firebase emulators; never a real project.')
let env
before(async () => { env = await initializeTestEnvironment({ projectId, firestore: { rules: readFileSync('firestore.rules', 'utf8') } }) })
beforeEach(async () => { await env.clearFirestore() })
after(async () => { await env?.cleanup() })
const valid = () => ({ name: 'Bạn Lan', message: 'Chúc hai bạn hạnh phúc!', createdAt: serverTimestamp() })

test('guests can read the public feed only with a bounded query', async () => {
 const db = env.unauthenticatedContext().firestore(), wishes = collection(db, WISHES_PATH)
 await assertSucceeds(getDocs(query(wishes, limit(50))))
 await assertFails(getDocs(wishes))
 await assertFails(getDocs(query(wishes, limit(51))))
})
test('anonymous authentication and the matching guest ID are required to create', async () => {
 await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), WISHES_PATH, 'guest'), valid()))
 const db = env.authenticatedContext('guest').firestore()
 await assertFails(setDoc(doc(db, WISHES_PATH, 'another-guest'), valid()))
 await assertSucceeds(setDoc(doc(db, WISHES_PATH, 'guest'), valid()))
})
test('a published wish cannot be replaced, updated, or deleted by its guest', async () => {
 const ref = doc(env.authenticatedContext('guest').firestore(), WISHES_PATH, 'guest')
 await assertSucceeds(setDoc(ref, valid()))
 await assertFails(setDoc(ref, valid()))
 await assertFails(updateDoc(ref, { message: 'Changed' }))
 await assertFails(deleteDoc(ref))
})
test('rules reject invalid content, extra privileges, and forged timestamps', async () => {
 const invalid = [{ name: '' }, { name: 'x'.repeat(81) }, { message: 'x'.repeat(1001) }, { name: '\u200b ' }, { message: '  ' }, { message: 17 }, { role: 'admin' }, { createdAt: Timestamp.fromMillis(1) }]
 for (let i = 0; i < invalid.length; i++) {
  const uid = `guest-${i}`, ref = doc(env.authenticatedContext(uid).firestore(), WISHES_PATH, uid)
  await assertFails(setDoc(ref, { ...valid(), ...invalid[i] }))
 }
})
test('this invitation cannot access another invitation collection', async () => {
 const db = env.authenticatedContext('guest').firestore()
 await assertFails(setDoc(doc(db, 'weddings/another-couple/wishes/guest'), valid()))
 await assertFails(getDocs(query(collection(db, 'weddingWishes'), limit(50))))
})
