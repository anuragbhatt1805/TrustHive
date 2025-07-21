#!/bin/bash

# Setup NPM authentication for GitHub Package Registry
# This script helps configure NPM authentication properly

echo "🔐 Setting up NPM authentication for GitHub Package Registry..."

if [ -z "$NPM_TOKEN" ]; then
    echo "❌ NPM_TOKEN environment variable is not set"
    echo ""
    echo "📝 To get a GitHub Personal Access Token:"
    echo "1. Go to https://github.com/settings/tokens"
    echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
    echo "3. Give it a name like 'TrustHive NPM Publishing'"
    echo "4. Select these scopes:"
    echo "   ✅ read:packages"
    echo "   ✅ write:packages"
    echo "   ✅ repo (if private repository)"
    echo "5. Copy the token and export it:"
    echo "   export NPM_TOKEN='your_token_here'"
    echo ""
    exit 1
fi

echo "✅ NPM_TOKEN is set (${#NPM_TOKEN} characters)"

# Method 1: Use .npmrc file
echo ""
echo "🔧 Method 1: Creating .npmrc in home directory..."
cat > ~/.npmrc << EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

echo "✅ Created ~/.npmrc"

# Method 2: Test with explicit config
echo ""
echo "🧪 Testing authentication..."
if npm whoami --registry=https://npm.pkg.github.com 2>/dev/null; then
    echo "✅ Authentication successful!"
else
    echo "⚠️ Authentication test failed, but this is normal for GitHub Package Registry"
    echo "Let's test by trying to view a package..."

    if npm view @anuragbhatt1805/trusthive-interface-types --registry=https://npm.pkg.github.com >/dev/null 2>&1; then
        echo "✅ Can access GitHub Package Registry!"
    else
        echo "❌ Cannot access GitHub Package Registry"
        echo "Please check your token has the correct scopes"
    fi
fi

echo ""
echo "🎯 Now you can publish packages:"
echo "cd common/interface && ./publish.sh"
echo "cd common/prisma && ./publish.sh"
