#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function hasChangesInCommon() {
  try {
    // In CI, check if there are changes in common/ since last tag
    const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    const changedFiles = execSync(`git diff --name-only ${lastTag} HEAD`, { encoding: 'utf8' }).split('\n');
    return changedFiles.some(file => file.startsWith('common/'));
  } catch (error) {
    // If no tags exist, assume first release
    console.log('No previous tags found, treating as first release');
    return true;
  }
}

function getChangedPackages() {
  try {
    const output = execSync('npx lerna changed --json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    return [];
  }
}

function runLernaVersionCI() {
  console.log('🚀 Running Lerna versioning for CI...\n');
  
  const commonHasChanges = hasChangesInCommon();
  const changedPackages = getChangedPackages();
  
  if (commonHasChanges) {
    console.log('📦 Changes detected in common packages!');
    console.log('🔄 Forcing update for ALL packages...\n');
    
    try {
      execSync('npx lerna version --conventional-commits --no-push --no-git-tag-version --force-publish --yes', {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Error during versioning:', error.message);
      process.exit(1);
    }
  } else if (changedPackages.length > 0) {
    console.log('📝 Changes detected in specific packages:');
    changedPackages.forEach(pkg => console.log(`  - ${pkg.name}`));
    console.log('');
    
    try {
      execSync('npx lerna version --conventional-commits --no-push --no-git-tag-version --yes', {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Error during versioning:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✨ No changes detected in any packages.');
    console.log('🎯 All packages are up to date!\n');
    return;
  }
  
  console.log('✅ Versioning complete!');
}

runLernaVersionCI();
