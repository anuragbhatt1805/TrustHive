#!/bin/bash

# Debug NPM authentication issues
echo "🔍 Debugging NPM authentication issues..."
echo ""

# Check if NPM_TOKEN is set
if [ -z "$NPM_TOKEN" ]; then
    echo "❌ NPM_TOKEN is not set"
    echo "Run: export NPM_TOKEN='your_github_token'"
else
    echo "✅ NPM_TOKEN is set (${#NPM_TOKEN} chars)"
    # Show first and last 4 characters for verification
    echo "   Token: ${NPM_TOKEN:0:4}...${NPM_TOKEN: -4}"
fi

echo ""

# Check current npm configuration
echo "🔧 Current npm configuration:"
npm config list

echo ""

# Check .npmrc files
echo "📁 Checking .npmrc files:"
echo "Global .npmrc (~/.npmrc):"
if [ -f ~/.npmrc ]; then
    cat ~/.npmrc
else
    echo "   (not found)"
fi

echo ""
echo "Local .npmrc (./.npmrc):"
if [ -f .npmrc ]; then
    cat .npmrc
else
    echo "   (not found)"
fi

echo ""

# Test authentication methods
echo "🧪 Testing different authentication methods:"

echo ""
echo "Method 1: Using global .npmrc"
if [ ! -z "$NPM_TOKEN" ]; then
    # Create global .npmrc
    cat > ~/.npmrc << EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

    echo "Created global .npmrc"
    if npm view express --registry=https://registry.npmjs.org >/dev/null 2>&1; then
        echo "✅ Can access public registry"
    else
        echo "❌ Cannot access public registry"
    fi

    # Test with a command that doesn't require authentication first
    echo "Testing GitHub registry access..."
    if timeout 10 npm ping --registry=https://npm.pkg.github.com >/dev/null 2>&1; then
        echo "✅ GitHub registry is reachable"
    else
        echo "⚠️ GitHub registry ping failed (this is normal)"
    fi
fi

echo ""
echo "Method 2: Using local .npmrc with explicit userconfig"
if [ ! -z "$NPM_TOKEN" ]; then
    cat > .npmrc.test << EOF
@trusthive:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
EOF

    echo "Created local test .npmrc"

    # Try to create a minimal package.json for testing
    cat > test-package.json << EOF
{
  "name": "@anuragbhatt1805/trusthive-test-auth",
  "version": "1.0.0",
  "description": "Test authentication",
  "main": "index.js"
}
EOF

    echo "Testing with explicit userconfig..."
    if npm pack --userconfig=.npmrc.test --dry-run >/dev/null 2>&1; then
        echo "✅ npm with userconfig works"
    else
        echo "❌ npm with userconfig failed"
    fi

    # Clean up
    rm -f .npmrc.test test-package.json
fi

echo ""
echo "🎯 Recommendations:"
echo "1. Make sure your GitHub token has 'read:packages' and 'write:packages' scopes"
echo "2. Try running: ./scripts/npm-auth-setup.sh"
echo "3. For GitHub Actions, ensure NPM_TOKEN secret is set correctly"
echo "4. Test publishing with: cd common/interface && NPM_TOKEN=\$NPM_TOKEN ./publish.sh"
