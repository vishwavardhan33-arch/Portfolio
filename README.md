# Vishwa Portfolio: The Neural Landscape
Next.js 14 (App Router) + TypeScript + Tailwind + React Three Fiber.

## Local
```bash
npm install
cp .env.example .env.local
npm run dev   # http://localhost:3000
```
Edit all copy in `data/content.ts`. Add `public/resume.pdf`, `public/images/vishwa.jpg`, `public/images/og.png`.

## Deploy on Render
Use the included `render.yaml` (New > Blueprint), or create a Web Service manually:
- Runtime: **Node**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Env vars: `NODE_VERSION=20`, `NEXT_PUBLIC_FORMSPREE_ID` (from formspree.io), `NEXT_PUBLIC_SITE_URL` (your Render URL)
- Health check path: `/`

`NEXT_PUBLIC_*` vars are inlined at build time, so redeploy after changing them.
# Portfolio
