const REPO_URL = 'https://github.com/Pandi2352/devops-deployment-lab'

export const SITE = {
  name: 'DevOps Lab',
  version: import.meta.env.VITE_APP_VERSION ?? 'dev',
  costGuideUrl: `${REPO_URL}/blob/main/docs/COST-GUIDE.md`,
  phase2Url: `${REPO_URL}/blob/main/docs/02-linux.md`,
}
