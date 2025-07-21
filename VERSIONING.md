# TrustHive Versioning Guide

This monorepo uses Lerna for sophisticated version management of microservices.

## 📋 Available Commands

### Service Version Management

```bash
# List all service versions (excludes common packages)
yarn lerna:list

# Version all changed packages (smart versioning)
yarn lerna:version

# Check which packages have changes
yarn lerna:changed

# Publish packages to GitHub Package Registry
yarn lerna:publish
```

## 🎯 Versioning Logic

### Smart Versioning Strategy

1. **Service-Only Changes**: Only the modified services get version bumps
2. **Common Package Changes**: ALL services get version bumps (regardless of direct changes)
3. **Independent Versioning**: Each service maintains its own version number

### Common Package Triggers

Changes in any of these directories will bump ALL service versions:
- `common/interface/` (shared TypeScript interfaces)
- `common/prisma/` (database models and services)

### Service Packages

These packages are considered services and will be versioned:
- `auth/service` → `@anuragbhatt1805/trusthive-auth-service`
- `auth/lambda` → `@anuragbhatt1805/trusthive-auth-lambda`

## 🚀 Usage Examples

### Scenario 1: Service-Specific Update
```bash
# Make changes to auth-service only
echo "console.log('updated');" >> auth/service/src/index.ts
git add . && git commit -m "feat(auth-service): add logging"

# Version only the changed service
yarn lerna:version
# Result: Only auth-service gets bumped (e.g., 1.0.0 → 1.1.0)
```

### Scenario 2: Interface Update
```bash
# Make changes to shared interfaces
echo "export interface NewType {}" >> common/interface/src/common.interface.ts
git add . && git commit -m "feat(interface): add new shared interface"

# Version all services (since interfaces changed)
yarn lerna:version
# Result: ALL services get bumped (e.g., 1.0.0 → 1.1.0)
```

### Scenario 3: Database Schema Update
```bash
# Update Prisma schema
echo "// New model" >> common/prisma/schema.prisma
git add . && git commit -m "feat(prisma): add new database model"

# Version all services (since database schema changed)
yarn lerna:version
# Result: ALL services get bumped (e.g., 1.1.0 → 1.2.0)
```

## 🎨 Service Listing Output

```
🚀 TrustHive Microservices:

┌─────────────────────────────────────────────────────────────┐
│                       Service Versions                     │
├─────────────────────────────────────────────────────────────┤
│ auth-lambda          │ v1.2.0      │ auth/lambda          │
│ auth-service         │ v1.2.0      │ auth/service         │
└─────────────────────────────────────────────────────────────┘

Total Services: 2
```

## 📦 Publishing

```bash
# Set GitHub token (required for publishing)
export NPM_TOKEN=your_github_personal_access_token

# Publish all changed packages
yarn lerna:publish
```

## 🔧 Configuration Files

- `lerna.json` - Main Lerna configuration
- `scripts/lerna-list-services.js` - Custom service listing
- `scripts/lerna-version-custom.js` - Smart versioning logic
- `scripts/version-services.js` - Alternative versioning script

## 🎯 Best Practices

1. **Commit First**: Always commit changes before running versioning
2. **Meaningful Commits**: Use conventional commit messages for better changelog generation
3. **Test Before Version**: Run `yarn build` to ensure all packages compile
4. **Review Changes**: Check `yarn lerna:changed` before versioning
5. **Batch Related Changes**: Group related interface/schema changes in single commits

## 🐛 Troubleshooting

### No packages to version?
- Ensure you have committed your changes
- Check if changes are in tracked files: `git status`

### All packages being versioned?
- This is expected when common packages change
- Use `yarn lerna:changed` to see what triggered the version bump

### Version conflicts?
- Each service maintains independent versions
- No conflicts should occur with the current setup
