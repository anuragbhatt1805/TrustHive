#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getPackageInfo() {
  try {
    // Get all packages from Lerna
    const lernaListOutput = execSync('npx lerna list --json --all', { encoding: 'utf8' });
    const allPackages = JSON.parse(lernaListOutput);
    
    // Filter out common packages and only show services
    const servicePackages = allPackages.filter(pkg => {
      return !pkg.location.includes('/common/');
    });
    
    if (servicePackages.length === 0) {
      console.log('No service packages found.');
      return;
    }
    
    console.log('\n🚀 TrustHive Microservices:\n');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│                       Service Versions                     │');
    console.log('├─────────────────────────────────────────────────────────────┤');
    
    servicePackages.forEach(pkg => {
      const serviceName = pkg.name.replace('@trusthive/', '');
      const version = pkg.version;
      const location = path.relative(process.cwd(), pkg.location);
      
      console.log(`│ ${serviceName.padEnd(20)} │ v${version.padEnd(10)} │ ${location.padEnd(20)} │`);
    });
    
    console.log('└─────────────────────────────────────────────────────────────┘');
    console.log(`\nTotal Services: ${servicePackages.length}`);
    
  } catch (error) {
    console.error('Error listing services:', error.message);
    process.exit(1);
  }
}

getPackageInfo();
