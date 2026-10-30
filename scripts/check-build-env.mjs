const required = [
 'VITE_FIREBASE_API_KEY',
 'VITE_FIREBASE_AUTH_DOMAIN',
 'VITE_FIREBASE_PROJECT_ID',
 'VITE_FIREBASE_STORAGE_BUCKET',
 'VITE_FIREBASE_MESSAGING_SENDER_ID',
 'VITE_FIREBASE_APP_ID',
]
const missing = required.filter(name => !process.env[name]?.trim())
if (missing.length) {
 console.error(`Missing Firebase Repository Secrets: ${missing.join(', ')}`)
 process.exit(1)
}
console.log('Firebase build configuration is present (6/6).')
