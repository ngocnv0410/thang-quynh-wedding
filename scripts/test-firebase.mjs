import { spawnSync } from 'node:child_process'
for (const args of [['--test', 'tests/firebase/firestore.test.js'], ['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.firebase.config.js']]) {
 const result = spawnSync(process.execPath, args, { stdio: 'inherit', env: process.env })
 if (result.status !== 0) process.exit(result.status || 1)
}
