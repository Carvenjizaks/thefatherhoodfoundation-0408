import { execSync } from 'child_process'

try {
  console.log('Removing node_modules/.cache...')
  execSync('rm -rf node_modules/.cache', { stdio: 'inherit' })
  console.log('Cache cleared successfully')
} catch (e) {
  console.log('No cache to clear')
}

try {
  console.log('Checking next version...')
  execSync('npx next --version', { stdio: 'inherit' })
} catch (e) {
  console.log('Next.js check failed:', e.message)
}
