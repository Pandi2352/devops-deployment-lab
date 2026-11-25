const DOCS_URL = 'https://github.com/Pandi2352/devops-deployment-lab/blob/main/docs'

export const SITE = {
  name: 'DevOps Lab',
  version: import.meta.env.VITE_APP_VERSION ?? 'dev',
  costGuideUrl: `${DOCS_URL}/COST-GUIDE.md`,
  phase5Url: `${DOCS_URL}/05-aws-fundamentals.md`,
}
