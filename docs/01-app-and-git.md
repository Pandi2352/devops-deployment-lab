# Phase 1: App and Git (Free)

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

## Part B: Git and GitHub

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

**LICENSE:** create it on GitHub after step 8 in a pull request (Add file → name it `LICENSE` → Choose a license template → MIT).

### Step 7: First commit

```powershell
git init
git status
git add .
git commit -m "Create React app and docs"
```

### Step 8: Create the GitHub repo

```powershell
gh repo create devops-deployment-lab --public --source . --push
```

Use a lowercase name: container image names must be lowercase. If you prefer a private repo, use `--private`, but then read the GitHub rows in [COST-GUIDE.md](COST-GUIDE.md).

### Step 9: Branch and pull request

```powershell
git switch -c feat/change-title
```

Change the paragraph text in `App.tsx`, then:

```powershell
git add .
git commit -m "Change landing page text"
git push -u origin feat/change-title
gh pr create --fill
gh pr view --web
```

Read your own diff, merge it on GitHub, then:

```powershell
git switch main
git pull
git branch -d feat/change-title
```

### Step 10: Protect main

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

- [ ] Page shows with Tailwind styling
- [ ] lint, test and build all pass
- [ ] One pull request merged, and a direct push to `main` is blocked

Next: [Phase 2](02-linux.md)
