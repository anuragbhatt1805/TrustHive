const { spawn } = require('child_process');
const esbuild = require('esbuild');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

async function runCommand(command, args, description) {
  console.log(`${description}...`);
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', shell: true });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${description} failed with exit code ${code}`));
      }
    });
  });
}

async function createZipFile() {
  console.log('Creating deployment ZIP file...');
  
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(__dirname, 'build', 'auth-lambda.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`ZIP file created: ${archive.pointer()} total bytes`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    
    // Add the bundled index.js file
    archive.file(path.join(__dirname, 'build', 'index.js'), { name: 'index.js' });
    
    // Add any other files you might need (package.json, etc.)
    // archive.file('package.json', { name: 'package.json' });
    
    archive.finalize();
  });
}

async function build() {
  try {
    // Ensure build directory exists
    if (!fs.existsSync('build')) {
      fs.mkdirSync('build');
    }

    // Run ESLint
    await runCommand('yarn', ['lint'], 'Running ESLint');
    
    // Run TypeScript type checking
    await runCommand('yarn', ['check-types'], 'Running TypeScript type checking');
    
    // Build with esbuild
    console.log('Building with esbuild...');
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      outfile: 'build/index.js',
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      sourcemap: true,
      external: [], // Bundle everything for Lambda
      minify: true, // Minify for smaller package size
    });
    
    // Create deployment ZIP file
    await createZipFile();
    
    console.log('Build completed successfully!');
    console.log('Deployment file: build/auth-lambda.zip');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

build();
