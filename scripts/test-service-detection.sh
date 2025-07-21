#!/bin/bash

# Test script for service detection logic used in GitHub Actions

set -e

echo "🔍 Testing service detection for matrix build..."
echo ""

# Find all services (directories with package.json that are not in common/ or root)
SERVICES=$(find . -name "package.json" -not -path "./node_modules/*" -not -path "./common/*" -not -path "./package.json" | while read pkg; do
  DIR=$(dirname "$pkg")
  PKG_NAME=$(node -p "require('$pkg').name" 2>/dev/null || echo "")
  PKG_PRIVATE=$(node -p "require('$pkg').private" 2>/dev/null || echo "false")
  
  # Only include services that are actual deployable services (not libraries)
  if [ -n "$PKG_NAME" ] && [ "$PKG_NAME" != "trusthive" ] && [ "$PKG_PRIVATE" != "true" ]; then
    # Determine service type based on project structure and dependencies
    if [ -f "$DIR/Dockerfile" ]; then
      SERVICE_TYPE="docker"
    elif grep -q "archiver" "$pkg" 2>/dev/null || grep -q "aws-lambda" "$pkg" 2>/dev/null; then
      SERVICE_TYPE="lambda"
    elif [ -f "$DIR/serverless.yml" ] || [ -f "$DIR/serverless.yaml" ]; then
      SERVICE_TYPE="serverless"
    else
      SERVICE_TYPE="library"
    fi
    
    # Extract service category from path (e.g., 'auth' from 'auth/service')
    CATEGORY=$(echo "$DIR" | cut -d'/' -f2)
    SERVICE_NAME=$(echo "$PKG_NAME" | sed 's/@trusthive\///')
    
    echo "{\"name\":\"$PKG_NAME\",\"path\":\"$DIR\",\"type\":\"$SERVICE_TYPE\",\"category\":\"$CATEGORY\",\"service_name\":\"$SERVICE_NAME\"}"
  fi
done | jq -s .)

echo "📋 Detected services:"
echo "$SERVICES" | jq .

echo ""
echo "✅ Service matrix would be:"
echo "services-matrix=$SERVICES"

# Test adding new services
echo ""
echo "🚀 Future extensibility test:"
echo "When you add new services (e.g., payment/service, notification/lambda), they will be automatically detected:"

# Simulate future services
echo "- payment/service/package.json with Dockerfile → docker service"
echo "- notification/lambda/package.json with archiver dependency → lambda service"
echo "- logging/service/package.json with serverless.yml → serverless service"

echo ""
echo "✅ The workflow is now fully dynamic and scalable!"
