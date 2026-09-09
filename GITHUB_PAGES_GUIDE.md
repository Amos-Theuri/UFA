# GitHub Pages Deployment Guide - UFA Website

This guide is divided into two distinct parts:
1. **[Part 1: Publishing Current Front-End "As Is"](#part-1-publishing-current-front-end-as-is)** (Fast 2-minute deployment with static assets).
2. **[Part 2: Publishing When Website is Complete](#part-2-publishing-when-website-is-complete-with-supabase--custom-domain)** (Production setup with Supabase, GitHub Actions CI/CD, SPA 404 redirect handling, and Custom Domain).

---

## 🚀 Part 1: Publishing Current Front-End "As Is"

Your project is already pre-configured with `gh-pages`, `base: "/UFA/"`, and automated build scripts.

### Step 1: Commit and Push All Local Changes
Open your terminal in `c:\Users\User\webdev\ufa` and run:

```powershell
git add .
git commit -m "Optimize, modernize and style UFA website"
git push origin main
```

---

### Step 2: Deploy to GitHub Pages
Run the deploy script in your terminal:

```powershell
npm run deploy
```

> **What happens behind the scenes?**
> 1. It executes `predeploy` (`npm run build`), generating optimized production files in `dist/`.
> 2. The `gh-pages` package automatically pushes the contents of `dist/` to a dedicated `gh-pages` branch on your GitHub repository.

---

### Step 3: Configure GitHub Repository Settings
1. Open your repository on GitHub: `https://github.com/<your-username>/UFA`.
2. Click **Settings** (top navigation tab).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment > Source**:
   - Select **Deploy from a branch**.
   - Set **Branch** to `gh-pages` and folder to `/(root)`.
   - Click **Save**.
5. Wait 1–2 minutes. GitHub will provide your live URL:
   ```
   https://<your-username>.github.io/UFA/
   ```

---

## 🛡️ Part 2: Publishing When Website is Complete (With Supabase & Custom Domain)

When you connect Supabase backend, handle client-side form submissions, or attach a custom domain (e.g., `ufa.co.ke`), follow these steps for production stability.

---

### 1. Fix the GitHub Pages SPA 404 Refresh Issue
Because GitHub Pages is a static file host, directly refreshing sub-routes like `https://.../UFA/About` or `https://.../UFA/Contact` will trigger a GitHub 404 error unless configured with a redirect fallback.

#### Solution: Add `404.html` in `public/`
Create a file named `public/404.html` with this script:
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Unique Focus Association</title>
    <script>
      // Single Page Apps for GitHub Pages redirect script
      var pathSegmentsToKeep = 1; // 1 for repo sub-path (/UFA/)
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

---

### 2. Configure Supabase Environment Secrets in GitHub
Because `.env` files are not committed to Git, add your Supabase credentials into GitHub Repository Secrets:

1. Go to your GitHub repository > **Settings** > **Secrets and variables** > **Actions**.
2. Click **New repository secret** and add:
   - Name: `VITE_SUPABASE_URL` | Value: `https://your-project.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY` | Value: `your-anon-key-here`

---

### 3. Automated Continuous Deployment with GitHub Actions (Recommended)
Instead of running `npm run deploy` manually on your machine, automate builds on every push to `main`.

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy UFA Website to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Project with Secrets
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

---

### 4. Setting Up a Custom Domain (Optional)
If you purchase a custom domain (e.g. `uniquefocus.org` or `ufa.co.ke`):

1. **Update `vite.config.js`**:
   Change `base: "/UFA/"` to `base: "/"` (since the website will live at the root domain rather than a sub-folder).
2. **Add DNS Records in your Domain Registrar (e.g., GoDaddy, Namecheap, Safaricom Domains)**:
   - **Apex domain (`uniquefocus.org`)**: Add 4 `A` records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **Subdomain (`www.uniquefocus.org`)**: Add a `CNAME` record pointing to `<your-username>.github.io`.
3. **Save in GitHub**:
   - Go to GitHub Repo > **Settings** > **Pages** > **Custom domain**.
   - Enter your domain name and check **Enforce HTTPS**.
