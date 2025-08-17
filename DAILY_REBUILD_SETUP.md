# Daily Rebuild Setup Guide

Your site needs daily rebuilds to fetch fresh data from APIs (Strava, GitHub, Bluesky, etc.). Here are three ways to set this up:

## Option 1: Fix GitHub Actions Permissions (Current Setup)

The `daily-rebuild.yml` workflow is already set up but needs permissions. I've added the fix, which adds:

```yaml
permissions:
  contents: write  # This gives the workflow permission to push
```

This should now work after you push the changes.

## Option 2: Use Cloudflare Deploy Hooks (Recommended)

This is cleaner and doesn't require pushing commits to your repo.

### Setup Steps:

1. **Go to Cloudflare Pages Dashboard**
   - Navigate to your project (abdla.box)
   - Go to Settings → Builds & deployments

2. **Create a Deploy Hook**
   - Scroll to "Deploy hooks" section
   - Click "Add deploy hook"
   - Name it "Daily Rebuild"
   - Copy the webhook URL

3. **Add to GitHub Secrets**
   - Go to your GitHub repo settings
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `CLOUDFLARE_DEPLOY_HOOK_URL`
   - Value: [paste the webhook URL from Cloudflare]

4. **Enable the Workflow**
   - Use the `daily-rebuild-cloudflare.yml` workflow instead
   - Delete or disable the original `daily-rebuild.yml`

## Option 3: Use Cloudflare Workers Cron Triggers (Advanced)

Create a Cloudflare Worker with a cron trigger:

```javascript
// worker.js
export default {
  async scheduled(controller, env, ctx) {
    // Trigger rebuild
    await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  },
};
```

With cron trigger in `wrangler.toml`:
```toml
[triggers]
crons = ["0 6 * * *"]  # Daily at 6 AM UTC
```

## Option 4: Use External Services

### GitHub Actions (via repository_dispatch)
Instead of pushing commits, trigger a workflow using GitHub API:

```yaml
name: Daily Rebuild via Dispatch

on:
  repository_dispatch:
    types: [daily-rebuild]
  schedule:
    - cron: '0 6 * * *'

jobs:
  call-deploy-hook:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cloudflare
        run: curl -X POST ${{ secrets.CLOUDFLARE_DEPLOY_HOOK_URL }}
```

### Using IFTTT or Zapier
Set up a daily schedule that calls your Cloudflare deploy hook.

## Verification

After setting up, you can verify it's working by:

1. **Manual Test**: 
   - Go to GitHub Actions tab
   - Select your workflow
   - Click "Run workflow"

2. **Check Cloudflare Dashboard**:
   - Go to your Cloudflare Pages project
   - Check the Deployments tab
   - You should see deployments triggered by "Deploy Hook"

3. **Monitor API Data**:
   - Check if your Strava activities update
   - Verify GitHub activity feeds are current
   - Ensure all dynamic content is fresh

## Recommended Approach

Use **Option 2 (Cloudflare Deploy Hooks)** because:
- No unnecessary commits to your repo
- Direct integration with Cloudflare
- Cleaner git history
- More reliable
- Easier to debug

## Current Status

✅ Fixed `daily-rebuild.yml` with proper permissions
✅ Created alternative `daily-rebuild-cloudflare.yml` using deploy hooks
⏳ You need to:
1. Push these changes
2. Set up Cloudflare deploy hook
3. Add the webhook URL as GitHub secret