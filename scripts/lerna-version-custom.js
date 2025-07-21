#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasChangesInCommon() {
  try {
    // Check if there are any uncommitted changes in common/
    const status = execSync('git status --porcelain common/', { encoding: 'utf8' });
    return status.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function getChangedPackages() {
  try {
    // Get packages that have changes
    const output = execSync('npx lerna changed --json', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    // If no packages have changed, return empty array
    return [];
  }
}

function getAllServicePackages() {
  try {
    const output = execSync('npx lerna list --json --all', { encoding: 'utf8' });
    const allPackages = JSON.parse(output);
    
    // Filter to only service packages (not common packages)
    return allPackages.filter(pkg => !pkg.location.includes('/common/'));
  } catch (error) {
    console.error('Error getting packages:', error.message);
    return [];
  }
}

function runLernaVersion() {
  console.log('🚀 Running custom Lerna versioning...\n');
  
  const commonHasChanges = hasChangesInCommon();
  const changedPackages = getChangedPackages();
  const servicePackages = getAllServicePackages();
  
  if (commonHasChanges) {
    console.log('📦 Changes detected in common packages!');
    console.log('🔄 This will update ALL service packages...\n');
    
    // Force update all service packages
    const serviceNames = servicePackages.map(pkg => pkg.name).join(',');
    
    try {
      execSync(`npx lerna version --force-publish=${serviceNames} --no-git-tag-version --yes`, {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Error during versioning:', error.message);
      process.exit(1);
    }
  } else if (changedPackages.length > 0) {
    console.log('📝 Changes detected in specific packages:');
    changedPackages.forEach(pkg => {
      if (!pkg.location.includes('/common/')) {
        console.log(`  - ${pkg.name}`);
      }
    });
    console.log('');
    
    try {
      execSync('npx lerna version --no-git-tag-version --yes', {
        stdio: 'inherit'
      });
    } catch (error) {
      console.error('❌ Error during versioning:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✨ No changes detected in any packages.');
    console.log('🎯 All packages are up to date!\n');
  }
  
  console.log('✅ Versioning complete!');
}

runLernaVersion();
