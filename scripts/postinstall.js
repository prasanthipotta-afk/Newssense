import { execSync } from 'child_process';

if (process.platform !== 'win32') {
  console.log('Non-Windows platform detected. Rebuilding sqlite3 from source...');
  try {
    execSync('npm rebuild sqlite3 --build-from-source', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to rebuild sqlite3 from source:', error);
    process.exit(1);
  }
} else {
  console.log('Windows platform detected. Skipping sqlite3 rebuild.');
}
