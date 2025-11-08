# Setup Guide - MyRPG Combat Prototype

**Platform:** Windows (your system)
**Time:** 30-45 minutes for first-time setup
**Difficulty:** Beginner-friendly with copy-paste commands

---

## Prerequisites Check

Before starting, check if you have these installed:

### 1. Node.js (JavaScript Runtime)

**Check if installed:**

```cmd
node --version
```

**Expected output:** `v20.x.x` or `v18.x.x` (any version 18 or higher)
**Actual output:** `v22.18.0`

**If not installed:**

1. Go to https://nodejs.org/
2. Download "LTS" version (Long Term Support)
3. Run installer, accept defaults
4. Restart terminal
5. Verify: `node --version`

### 2. npm (Package Manager)

**Check if installed:**

```cmd
npm --version
```

**Expected output:** `10.x.x` or `9.x.x`
**Actual output:** `11.5.2`

**Note:** npm comes with Node.js automatically

### 3. Git (Version Control)

**Check if installed:**

```cmd
git --version
```

**Actual output:** `git version 2.49.0.windows.1`

**If not installed:**

1. Go to https://git-scm.com/download/win
2. Download and run installer
3. Accept defaults
4. Restart terminal

### 4. Code Editor (Recommended: VS Code)

**If not installed:**

1. Go to https://code.visualstudio.com/
2. Download and install
3. Install extensions (recommended):
   - **ESLint** - TypeScript error highlighting
   - **TypeScript Hero** - Auto-import suggestions
   - **Tailwind CSS IntelliSense** - CSS class autocomplete
   - **PostCSS Language Support** (by csstools) - Removes `@tailwind` warnings in CSS files
   - Optional: Install Prettier for code formatting
     - `npm install -D prettier prettier-plugin-tailwindcss` (complementary to Tailwind extension)

---

## Project Setup

### Step 1: Open Terminal in Project Directory

```cmd
cd C:\Projects\MyRPG
```

Verify you're in the right place:

```cmd
dir
```

You should see:

- `CombatSkills/` folder
- `PRD.md` file
- `Claude_Summary.md` file

### Step 2: Create Vite + React + TypeScript Project

**Command:**

```cmd
npm create vite@latest combat-prototype -- --template react-ts
```

**What this does:**

- Creates a new folder called `combat-prototype`
- Sets up React + TypeScript + Vite
- Installs basic configuration

**You'll see:**

```
Scaffolding project in C:\Projects\MyRPG\combat-prototype...

Done. Now run:

  cd combat-prototype
  npm install
  npm run dev
```

### Step 3: Move into Project Folder

```cmd
cd combat-prototype
```

### Step 4: Install Dependencies

```cmd
npm install
```

**What this does:**

- Downloads React, TypeScript, Vite, and all dependencies
- Takes 1-2 minutes depending on internet speed

**You'll see:**

```
added 212 packages in 45s
```

### Step 5: Install TailwindCSS

```cmd
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss@3 init -p
```

**What this does:**

- Installs Tailwind CSS for styling
- Creates `tailwind.config.js` and `postcss.config.js`

### Step 6: Configure Tailwind

**Edit `tailwind.config.js`:**

Open the file and replace contents with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Edit `src/index.css`:**

Replace all contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  background-color: #1a1a1a;
  color: #ffffff;
  font-family: "Inter", sans-serif;
}
```

**Note:** VS Code may show "unknown at rule @tailwind" warnings. This is just a linter warning - the code works perfectly fine. To remove these warnings, install the **PostCSS Language Support** extension (see Prerequisites section above).

### Step 7: Test the Setup

**Start development server:**

```cmd
npm run dev
```

**Expected output:**

```
  VITE v5.x.x  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open browser:**

1. Go to `http://localhost:5173/`
2. You should see the default Vite + React page

**Success!** If you see the page, your setup is working.

**Stop the server:**

- Press `Ctrl+C` in terminal

---

## Project Structure Setup

### Step 8: Create Folder Structure

From `C:\Projects\MyRPG\combat-prototype\`, run:

```cmd
mkdir src\engine
mkdir src\types
mkdir src\components
mkdir src\components\Timeline
mkdir src\components\Actions
mkdir src\components\Telegraph
mkdir src\utils
```

Verify structure:

```cmd
tree /F src
```

Should show:

```
src
├── engine/
├── types/
├── components/
│   ├── Timeline/
│   ├── Actions/
│   └── Telegraph/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

### Step 9: Copy Combat Skills JSON

From project root, copy CombatSkills folder:

```cmd
cd ..
xcopy CombatSkills combat-prototype\public\CombatSkills\ /E /I
cd combat-prototype
```

Verify:

```cmd
dir public\CombatSkills
```

Should show:

```
attacks
defense
special
combos
```

---

## Verification

### Final Checks

1. **Node and npm installed:**

   ```cmd
   node --version
   npm --version
   ```

2. **Project created:**

   ```cmd
   dir
   ```

   Should see `package.json`, `tsconfig.json`, `vite.config.ts`

3. **Dependencies installed:**

   ```cmd
   dir node_modules
   ```

   Should see many folders

4. **Folders created:**

   ```cmd
   tree /F src
   ```

   Should see `engine/`, `types/`, `components/`

5. **Combat skills copied:**

   ```cmd
   dir public\CombatSkills\attacks
   ```

   Should see `slash.json`, `thrust.json`, etc.

6. **Dev server works:**
   ```cmd
   npm run dev
   ```
   Open http://localhost:5173/ - should see React page

---

## Common Issues & Solutions

### Issue 1: "node is not recognized"

**Problem:** Node.js not in PATH

**Solution:**

1. Reinstall Node.js from https://nodejs.org/
2. Check "Add to PATH" during installation
3. Restart terminal AND VS Code

### Issue 2: "npm install" fails

**Problem:** Network issues or permissions

**Solution:**

```cmd
npm cache clean --force
npm install
```

Or try:

```cmd
npm install --legacy-peer-deps
```

### Issue 3: Port 5173 already in use

**Problem:** Another app using the port

**Solution:**

```cmd
npm run dev -- --port 3000
```

Or close other Vite servers

### Issue 4: "Cannot find module"

**Problem:** Dependencies not installed

**Solution:**

```cmd
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: Hot reload not working

**Problem:** File watcher issues

**Solution:**

1. Save files with Ctrl+S
2. Refresh browser manually
3. Restart dev server

---

## VS Code Setup (Optional but Recommended)

### Open Project in VS Code

```cmd
code .
```

### Install Recommended Extensions

1. **ESLint** - TypeScript error highlighting
2. **TypeScript Hero** - Auto-import suggestions
3. **Tailwind CSS IntelliSense** - CSS class autocomplete
4. **PostCSS Language Support** (by csstools) - Removes `@tailwind` warnings
5. **Error Lens** - Inline error display (optional)

### Enable TypeScript Checking

Create `.vscode/settings.json`:

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

---

## Understanding the Setup

### What Each Tool Does:

| Tool            | Purpose                                    | You Interact With It?              |
| --------------- | ------------------------------------------ | ---------------------------------- |
| **Node.js**     | Runs JavaScript/TypeScript outside browser | No - runs in background            |
| **npm**         | Downloads and manages packages             | Yes - when installing new packages |
| **Vite**        | Bundles code, runs dev server, hot reload  | No - automatic                     |
| **TypeScript**  | Adds types to JavaScript                   | Yes - writing `.ts` files          |
| **React**       | UI framework (components)                  | Minimal - pre-built components     |
| **TailwindCSS** | Styling utility classes                    | No - styles already applied        |

### What Happens When You Run `npm run dev`:

1. **Vite starts:**
   - Reads `vite.config.ts`
   - Starts dev server on port 5173
   - Watches for file changes

2. **TypeScript compiles:**
   - Reads `tsconfig.json`
   - Compiles `.ts` files to JavaScript
   - Shows type errors in terminal

3. **Browser opens:**
   - Loads `index.html`
   - Executes your compiled TypeScript
   - Runs React components

4. **Hot reload active:**
   - You edit `src/engine/GameEngine.ts`
   - Vite detects change
   - Recompiles TypeScript
   - Updates browser without full page reload
   - You see changes instantly

### File Flow:

```
You edit:   src/engine/GameEngine.ts
            ↓
TypeScript: Compiles to JavaScript
            ↓
Vite:       Bundles with other files
            ↓
Browser:    Loads and runs compiled code
            ↓
React:      Displays UI based on engine state
            ↓
You see:    5 timebars updating in real-time
```

---

## Next Steps

✅ **Setup Complete!**

Now you're ready for:

1. **I'll create starter code** - GameEngine.ts skeleton + React components
2. **You'll read the code** - Understand how atomic ticks work
3. **You'll run first test** - See combat skills load from JSON
4. **You'll observe behavior** - Watch timebars and console logs

---

## Terminal Commands Reference

### Daily Workflow:

```cmd
# Start development (do this every time you work)
cd C:\Projects\MyRPG\combat-prototype
npm run dev

# Stop server
# Press Ctrl+C

# Install new package (if needed later)
npm install <package-name>

# Build for production (later)
npm run build
```

### Troubleshooting:

```cmd
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npx tsc --noEmit

# Run on different port
npm run dev -- --port 3000
```

---

## Resources

### Official Documentation:

- **Vite:** https://vitejs.dev/guide/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **React (optional):** https://react.dev/learn

### Useful for Debugging:

- **Browser DevTools:** Press F12 in browser
- **Console:** See engine logs
- **Sources:** Set breakpoints in TypeScript

---

**Questions?** Ask before we proceed to creating the starter code!
