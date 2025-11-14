#!/usr/bin/env node

// Run database migrations on first install

import { execSync } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function isDotnetInstalled() {
  try {
    execSync('dotnet --version', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

function runMigration() {
  const myAppPath = join(__dirname, '..', 'MyApp')

  try {
    console.log('Running database migration...')
    execSync('dotnet run --AppTasks=migrate', {
      cwd: myAppPath,
      stdio: 'inherit'
    })
    console.log('Migration completed successfully.')
  } catch (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }
}

if (isDotnetInstalled()) {
  runMigration()
}
