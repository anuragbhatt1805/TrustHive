#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasChangesInCommon() {
  try {
    // Get changed files since last tag
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD', { encoding: 'utf8' }).split('\n').filter(Boolean);
    
    // Check if any changes are in common/ directory
    return changedFiles.some(file => file.startsWith('common/'));
  } catch (error) {
    console.log('No previous commit found, treating as first version');
    return true;
  }
}

function getAllServicePackages() {
  const packages = [];
  
  // Scan auth directory
  const authDir = path.join(process.cwd(), 'auth');
  if (fs.existsSync(authDir)) {
    const authServices = fs.readdirSync(authDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        name: dirent.name,
        path: path.join(authDir, dirent.name),
        packageJsonPath: path.join(authDir, dirent.name, 'package.json')
      }))
      .filter(service => fs.existsSync(service.packageJsonPath));
    
    packages.push(...authServices);
  }
  
  return packages;
}

function bumpVersion(currentVersion, bumpType = 'patch') {
  const parts = currentVersion.split('.');
  let [major, minor, patch] = parts.map(Number);
  
  switch (bumpType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
    default:
      patch += 1;
      break;
  }
  
  return `${major}.${minor}.${patch}`;
}

function updateServiceVersions() {
  console.log('🔍 Checking for version updates...\n');
  
  const commonChanged = hasChangesInCommon();
  const services = getAllServicePackages();
  const updatedServices = [];
  
  if (commonChanged) {
    console.log('📦 Changes detected in common packages, updating all services...\n');
  }
  
  services.forEach(service => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(service.packageJsonPath, 'utf8'));
      const currentVersion = packageJson.version;
      
      // Check if service has changes or if common has changes
      let shouldUpdate = commonChanged;
      
      if (!commonChanged) {
        // Check if this specific service has changes
        try {
          const serviceChanges = execSync(`git diff --name-only HEAD~1 HEAD -- ${service.path}`, { encoding: 'utf8' });
          shouldUpdate = serviceChanges.trim().length > 0;
        } catch (error) {
          shouldUpdate = true; // If we can't determine, update it
        }
      }
      
      if (shouldUpdate) {
        const newVersion = bumpVersion(currentVersion);
        packageJson.version = newVersion;
        
        fs.writeFileSync(service.packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        
        console.log(`✅ ${packageJson.name}: ${currentVersion} → ${newVersion}`);
        updatedServices.push({
          name: packageJson.name,
          oldVersion: currentVersion,
          newVersion: newVersion
        });
      } else {
        console.log(`⏭️  ${packageJson.name}: ${currentVersion} (no changes)`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${service.name}:`, error.message);
    }
  });
  
  if (updatedServices.length > 0) {
    console.log(`\n🎉 Updated ${updatedServices.length} service(s)!`);
    
    // Commit the changes
    try {
      execSync('git add .');
      execSync(`git commit -m "chore: bump service versions

${updatedServices.map(s => `- ${s.name}: ${s.oldVersion} → ${s.newVersion}`).join('\n')}"`);
      console.log('\n✅ Changes committed to git');
    } catch (error) {
      console.log('\n⚠️  Failed to commit changes:', error.message);
    }
  } else {
    console.log('\n📝 No services needed version updates.');
  }
}

updateServiceVersions();
