#!/bin/bash

# Publishing script for @trusthive/prisma-config

echo "Building prisma package..."
yarn build

echo "Setting up GitHub Package Registry configuration..."
# Create .npmrc temporarily for publishing
cat > .npmrc << NPMRC_EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
NPMRC_EOF

echo "Publishing to GitHub Package Registry..."
# Make sure you have NPM_TOKEN set in your environment

if [ -z "$NPM_TOKEN" ]; then
    echo "Error: NPM_TOKEN environment variable is not set"
    echo "Please set it with: export NPM_TOKEN=your_github_personal_access_token"
    rm .npmrc
    exit 1
fi

if npm publish --registry=https://npm.pkg.github.com --userconfig=.npmrc; then
    echo "✅ Published successfully!"
    EXIT_CODE=0
else
    echo "❌ Publishing failed!"
    EXIT_CODE=1
fi

# Clean up
rm .npmrc

exit $EXIT_CODE
