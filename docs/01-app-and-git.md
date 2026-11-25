# Phase 1: App and Git (Free) ✅

**Goal:** a working React + TypeScript + Tailwind app in a public GitHub repo, changed through pull requests.

Use **PowerShell** in `D:\devops\react-devops`.

## Part A: Create the app ✅

### Step 1: Create the project ✅

```powershell
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm install -D vitest
```

### Step 2: Configure Tailwind ✅

**File:** `frontend/vite.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**File:** `frontend/src/index.css` (replace everything)

```css
@import "tailwindcss";
```

### Step 3: Landing page ✅

**File:** `frontend/src/App.tsx` (replace everything)

```tsx
const version = import.meta.env.VITE_APP_VERSION ?? 'dev'

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 p-6 text-white">
      <h1 className="text-4xl font-bold">DevOps Lab</h1>
      <p className="text-slate-300">React + TypeScript + Tailwind</p>
      <p className="rounded border border-slate-600 px-3 py-1 font-mono text-sm">
        Version: {version}
      </p>
    </main>
  )
}

export default App
```

Delete `src/App.css`. The version text is important: later it shows you **which deployment is live**.

### Step 4: Add one test ✅

**File:** `frontend/src/App.test.tsx`

```tsx
import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import App from './App'

test('shows the page title', () => {
  expect(renderToString(<App />)).toContain('DevOps Lab')
})
```

In `frontend/package.json` add to `scripts`:

```json
"test": "vitest run"
```

### Step 5: Run everything ✅

```powershell
npm run dev
npm run lint
npm test
npm run build
npm run preview
```

`dev` and `preview` keep running; stop them with Ctrl+C. After `build`, look inside `dist`: **this folder is what we deploy**.

## Part B: Git and GitHub ✅

### Step 6: Root files ✅

Go back to `D:\devops\react-devops`.

**File:** `.gitignore`

```gitignore
node_modules/
dist/
.env
.env.*
!.env.example
*.pem
*.key
.terraform/
*.tfstate
*.tfstate.*
*.tfvars
kubeconfig
```

**File:** `.gitattributes` (stops Windows line endings from breaking Linux scripts)

```text
* text=auto eol=lf
*.png binary
*.ico binary
```

**File:** `.editorconfig`

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
```

**File:** `README.md`

```markdown
# DevOps Deployment Lab

A small React app deployed with Docker, Kubernetes, AWS and GitOps.

Plan: [docs/README.md](docs/README.md)
```

**LICENSE:** create it on GitHub after step 8 in a pull request (Add file → name it `LICENSE` → Choose a license template → MIT). ✅

### Step 7: First commit ✅

```powershell
git init
git status
git add .
git commit -m "Create React app and docs"
```

### Step 8: Create the GitHub repo (on the website) ✅

**Create it:**

1. Log in to [github.com](https://github.com) and open https://github.com/new
2. Repository name: `devops-deployment-lab` (lowercase, because container image names must be lowercase)
3. Visibility: **Public**. For a private repo, first read the GitHub rows in [COST-GUIDE.md](COST-GUIDE.md).
4. Leave **README, .gitignore and license off**. The repo must be empty, or your first push is rejected.
5. Click **Create repository**.

**Push your code (PowerShell, in `D:\devops\react-devops`):**

```powershell
git remote add origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git
git branch -M main
git remote -v
git push -u origin main
```

Replace `<GITHUB_USER>` with your GitHub username. On the first push, a browser window may ask you to log in to GitHub.

| Error | Fix |
|---|---|
| `remote origin already exists` | `git remote set-url origin https://github.com/<GITHUB_USER>/devops-deployment-lab.git` |
| `src refspec main does not match any` | You have no commit yet. Do step 7 |
| `Repository not found` | Check the username, repo name, and which GitHub account you logged in with |
| `rejected ... fetch first` | The repo was not empty. If it has only the files GitHub created, delete it on GitHub and create it again empty |

Refresh the GitHub page. You should see your files.

### Step 9: Branch and pull request ✅

```powershell
git switch -c feat/change-title
```

Change the paragraph text in `App.tsx`, then:

```powershell
git add .
git commit -m "Change landing page text"
git push -u origin feat/change-title
```

Then on the GitHub website:

1. Open your repo and click **Compare & pull request** (or Pull requests → New).
2. Base: `main`, compare: `feat/change-title`.
3. Click **Create pull request**.
4. Read your own diff in **Files changed**.
5. Click **Merge pull request**, then **Delete branch**.

Back in PowerShell:

```powershell
git switch main
git pull
git branch -d feat/change-title
```

### Step 10: Protect main ✅

GitHub → Settings → Rules → Rulesets → New branch ruleset:

- Target: default branch
- Require a pull request before merging, 0 approvals (you work alone)
- Block force pushes

After phase 4 also add: require status checks.

## Commands to remember

| Command | Use |
|---|---|
| `git status` | What changed |
| `git diff` | Exact changes |
| `git log --oneline --graph` | History |
| `git switch -c name` | New branch |
| `git pull` | Get remote changes |
| `git revert <commit>` | Safely undo a commit |
| `git stash` / `git stash pop` | Put work aside |

## Break it

1. Make two branches that edit the same line. Merge both and fix the **merge conflict**.
2. Commit a mistake, merge it, then undo it with `git revert`.

## Done when

- [x] Page shows with Tailwind styling
- [x] lint, test and build all pass
- [x] One pull request merged, and a direct push to `main` is blocked

Next: [Phase 2](02-linux.md)
