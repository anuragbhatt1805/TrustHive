# Build Status

[![PR Validation](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/pr-validation.yml)
[![Release](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/release.yml/badge.svg)](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/release.yml)

## 📦 Latest Versions

Run `yarn lerna:list` to see current service versions.

## 🐳 Docker Images

- **Auth Service**: `ghcr.io/anuragbhatt1805/trusthive-auth-service:latest`

## 📁 Artifacts

Lambda deployment packages are available in GitHub Actions artifacts after each release.

## 🔧 Development

```bash
# Install dependencies
yarn install

# Run type checking and linting (PR requirements)
yarn check-types
yarn lint

# Build all packages
yarn build

# List service versions
yarn lerna:list
```

## 🚀 Deployment

Deployments are automated on push to `main` branch. Manual deployments can be triggered from the Actions tab.
