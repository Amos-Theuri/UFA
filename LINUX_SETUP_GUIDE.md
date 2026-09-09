# Linux Lite Setup & Local Development Guide - UFA Website

This guide walks you through setting up and running the **Unique Focus Association (UFA)** website on a **Linux Lite** (Ubuntu/Debian-based) PC without errors.

---

## 🛠️ Step 1: Ensure Modern Node.js & NPM Are Installed

Vite 8 and React 19 require **Node.js v18+ or v20+ (LTS)**. Default Linux Lite repositories may carry outdated Node.js versions (v12/v14).

### 1. Check current versions:
Open your terminal in Linux Lite (`Ctrl + Alt + T`):
```bash
node -v
npm -v
```

### 2. If Node.js is missing or below v18, install Node.js 20 LTS:
```bash
# Update package list and install curl
sudo apt update && sudo apt install -y curl

# Add NodeSource Node.js 20.x repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js & npm
sudo apt install -y nodejs

# Verify installation
node -v   # Should output v20.x.x
npm -v    # Should output 10.x.x
```

---

## 🧹 Step 2: Clean Windows Artifacts (Crucial Step)

If you copied the folder directly from Windows via flash drive or zip, the `node_modules` folder contains Windows binary links (`.cmd`, `.exe`, `.ps1`) which will **not** work on Linux.

In your terminal, navigate to the project directory:

```bash
cd /path/to/ufa

# Remove the Windows node_modules folder
rm -rf node_modules package-lock.json
```

---

## 📦 Step 3: Install Dependencies for Linux

Rebuild the package tree with native Linux binaries and symlinks:

```bash
npm install
```

> **Note**: This will automatically install `react`, `react-router-dom`, `lucide-react`, `vite`, and all development tools configured for your Linux environment.

---

## 🚀 Step 4: Run the Local Development Server

Start the Vite development server:

```bash
npm run dev
```

Your terminal will display:
```
  VITE v8.2.2  ready in 250 ms

  ➜  Local:   http://localhost:5173/UFA/
  ➜  Network: http://192.168.x.x:5173/UFA/
```

Open your browser in Linux Lite (Chrome, Firefox, or Lite Browser) and visit:
👉 **`http://localhost:5173/UFA/`**

---

## ⚠️ Common Linux Lite Gotchas & Quick Fixes

### 1. File Watcher Limit Error (`ENOSPC: System limit for number of file watchers reached`)
If Vite throws an `ENOSPC` error when editing files, your Linux kernel has a low file-watch limit.

**Fix:**
```bash
# Increase inotify watcher limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

### 2. Case-Sensitive File Names
Windows ignores file casing (`about.png` vs `About.png`), but **Linux is strictly case-sensitive**.
- All component and image references in this codebase have already been audited and aligned (`official_7.jpg`, `Merchendise.jsx`, `hero.png`, etc.).
- When adding new images or files on Linux, always match the exact casing in your code imports.

---

### 3. Git Line Endings (CRLF vs LF)
To prevent Git from marking every line as modified due to Windows `CRLF` line endings:

```bash
git config --global core.autocrlf input
```

---

## 📋 Quick Command Cheat Sheet (Linux Terminal)

```bash
# 1. Clean old binaries
rm -rf node_modules package-lock.json

# 2. Install dependencies
npm install

# 3. Test build
npm run build

# 4. Check for code issues
npm run lint

# 5. Start dev server
npm run dev
```
