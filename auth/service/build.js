const { spawn } = require('child_process');
const esbuild = require('esbuild');

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

async function build() {
  try {
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
      external: ['express'],
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

build();
