# TrustHive CI/CD Documentation

This document describes the automated CI/CD pipeline for the TrustHive monorepo.

## 🔄 Workflows Overview

### 1. Pull Request Validation (`pr-validation.yml`)

**Trigger**: Pull requests to `main` or `develop` branches

**Purpose**: Ensure code quality before merge

**Steps**:
- ✅ Type checking with TypeScript
- ✅ Linting with ESLint  
- ✅ Build all packages
- ✅ Validate Lambda ZIP size (<10MB)
- ✅ Test database connection

**Requirements**: All checks must pass before PR can be merged

### 2. Release and Version (`release.yml`)

**Trigger**: Push to `main` branch (excludes chore(release) commits)

**Purpose**: Automated versioning and deployment

**Steps**:
1. **Version Check**: Detect if any packages have changes
2. **Smart Versioning**: Bump versions using Lerna with conventional commits
3. **Build**: Compile all packages and services
4. **Release Commit**: Create chore(release) commit with version updates
5. **Tagging**: Create Git tags for each service version
6. **Package Publishing**: Publish common packages to GitHub Package Registry
7. **Docker Build**: Build and push service Docker images to GitHub Container Registry
8. **Lambda Artifacts**: Upload Lambda ZIP files as GitHub Actions artifacts

### 3. Manual Deployment (`manual-deploy.yml`)

**Trigger**: Manual workflow dispatch

**Purpose**: On-demand deployments to specific environments

**Features**:
- Environment selection (staging/production)
- Service selection (choose which services to deploy)
- Manual approval workflows

## 📦 Build Outputs

### Docker Images
- **Repository**: `ghcr.io/<owner>/trusthive-auth-service`
- **Tags**: 
  - `latest` (always latest version)
  - `v<version>` (specific version)

### Lambda Artifacts
- **Name**: `auth-lambda-v<version>`
- **Content**: `auth-lambda.zip` (deployment-ready)
- **Retention**: 7 days

### NPM Packages
- `@trusthive/interface-types` (GitHub Package Registry)
- `@trusthive/prisma-config` (GitHub Package Registry)

## 🏷️ Versioning Strategy

### Automatic Version Bumps

1. **Service-Only Changes**: Only modified services get version bumps
2. **Common Package Changes**: ALL services get version bumped
3. **Conventional Commits**: Version bump type determined by commit message:
   - `feat:` → Minor version bump (1.0.0 → 1.1.0)
   - `fix:` → Patch version bump (1.0.0 → 1.0.1)
   - `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)

### Git Tags

Each service version creates a corresponding Git tag:
- `auth-service@1.2.0`
- `auth-lambda@1.2.0`

## 🔐 Required Secrets

### Repository Secrets

| Secret | Description | Usage |
|--------|-------------|-------|
| `NPM_TOKEN` | Fine-grained GitHub Personal Access Token | Package publishing, Git operations (push/tags), and GitHub Package Registry |

### Permissions Required

- **Contents**: Write (for creating releases and tags)
- **Packages**: Write (for publishing to GitHub Package Registry)
- **Actions**: Write (for workflow management)

## 🚀 Deployment Process

### Automatic (on main branch push)

1. Code is pushed/merged to `main`
2. `release.yml` workflow triggers
3. Lerna detects changes and versions packages
4. Packages are built and tested
5. Docker images are built and pushed
6. Lambda artifacts are created
7. Git tags and release commit are created

### Manual

1. Go to Actions tab in GitHub
2. Select "Manual Deployment" workflow
3. Click "Run workflow"
4. Select environment and services
5. Workflow executes deployment

## 📊 Monitoring and Debugging

### GitHub Actions Logs

Each workflow provides detailed logs and summaries:
- Build status and timing
- Package versions
- Docker image tags
- Artifact locations

### Workflow Status Badges

Add these to your README.md:

```markdown
![PR Validation](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/pr-validation.yml/badge.svg)
![Release](https://github.com/anuragbhatt1805/TrustHive/actions/workflows/release.yml/badge.svg)
```

### Troubleshooting

#### Common Issues

1. **NPM_TOKEN expired**
   - Generate new GitHub Personal Access Token
   - Update repository secret

2. **Docker build fails**
   - Check Dockerfile syntax
   - Verify build artifacts exist

3. **Lerna version fails**
   - Ensure conventional commit format
   - Check for uncommitted changes

4. **Lambda artifact too large**
   - Review bundled dependencies
   - Check for unnecessary files in build

## 🔧 Local Development Commands

```bash
# Test what would be versioned
yarn lerna:changed

# List current service versions
yarn lerna:list

# Manual version bump (local development)
yarn lerna:version

# Build all packages
yarn build

# Run quality checks (same as CI)
yarn check-types && yarn lint
```

## 📝 Workflow Files

- `.github/workflows/pr-validation.yml` - Pull request validation
- `.github/workflows/release.yml` - Release and deployment
- `.github/workflows/manual-deploy.yml` - Manual deployment
- `scripts/lerna-version-ci.js` - CI-specific versioning logic

## 🎯 Best Practices

1. **Use Conventional Commits**: Enables automatic version bumping
2. **Small, Focused PRs**: Easier to review and faster CI runs
3. **Test Locally First**: Run `yarn build` before pushing
4. **Monitor Workflows**: Check GitHub Actions for any failures
5. **Keep Secrets Updated**: Rotate tokens regularly
6. **Review Deploy Summaries**: Check what was deployed after each release

## 🔮 Future Enhancements

- [ ] Add automated testing suite
- [ ] Implement blue-green deployments
- [ ] Add performance monitoring
- [ ] Set up staging environment
- [ ] Add security scanning
- [ ] Implement rollback functionality
