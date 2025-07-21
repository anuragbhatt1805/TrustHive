#!/bin/bash

# Test NPM authentication for GitHub Package Registry

echo "🔐 Testing NPM authentication for GitHub Package Registry..."

if [ -z "$NPM_TOKEN" ]; then
    echo "❌ NPM_TOKEN environment variable is not set"
    echo "Please set it with: export NPM_TOKEN=your_github_personal_access_token"
    echo "You can create a token at: https://github.com/settings/tokens"
    echo "Required scopes: read:packages, write:packages"
    exit 1
fi

echo "✅ NPM_TOKEN is set (length: ${#NPM_TOKEN} characters)"

# Create temporary .npmrc
echo "📝 Creating temporary .npmrc..."
cat > .npmrc.test << EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

echo "📋 NPM configuration:"
cat .npmrc.test

echo ""
echo "🧪 Testing authentication by checking if we can view existing packages..."

# Test authentication by trying to view a package
if npm view @anuragbhatt1805/trusthive-interface-types --registry=https://npm.pkg.github.com --userconfig=.npmrc.test > /dev/null 2>&1; then
    echo "✅ Authentication works! Can access GitHub Package Registry"
else
    echo "❌ Authentication failed or package doesn't exist"
    echo "Make sure your NPM_TOKEN has the correct scopes (read:packages, write:packages)"
fi

# Clean up
rm -f .npmrc.test

echo ""
echo "🎯 To test publishing manually:"
echo "1. cd common/interface"
echo "2. NPM_TOKEN=\$NPM_TOKEN ./publish.sh"
