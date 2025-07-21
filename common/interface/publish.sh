#!/bin/bash

# Publishing script for @trusthive/interface-types

echo "Building interface package..."
yarn build

echo "Setting up GitHub Package Registry configuration..."
# Create .npmrc temporarily for publishing
cat > .npmrc << NPMRC_EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=\${NPM_TOKEN}
NPMRC_EOF

echo "Publishing to GitHub Package Registry..."
# Make sure you have NPM_TOKEN set in your environment
# You can set it with: export NPM_TOKEN=your_github_token

if [ -z "$NPM_TOKEN" ]; then
    echo "Error: NPM_TOKEN environment variable is not set"
    echo "Please set it with: export NPM_TOKEN=your_github_personal_access_token"
    rm .npmrc
    exit 1
fi

npm publish --registry=https://npm.pkg.github.com

# Clean up
rm .npmrc

echo "Published successfully!"
