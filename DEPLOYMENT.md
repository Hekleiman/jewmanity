# Jewmanity — Deployment Guide

## Prerequisites
- GitHub repo: Hekleiman/jewmanity (main branch, up to date)
- Vercel account (free tier works)
- Domain access for jewmanity.com

## Environment Variables
Set these in Vercel dashboard under Settings → Environment Variables:

```
PUBLIC_SANITY_PROJECT_ID=9pc3wgri
PUBLIC_SANITY_DATASET=production
```

## Deploy to Vercel

1. Go to https://vercel.com → "Add New Project" → Import Git Repository
2. Select **Hekleiman/jewmanity**
3. Framework Preset: **Astro**
4. Add environment variables listed above
5. Click **Deploy**

## Custom Domain Setup

1. In Vercel: **Settings → Domains → Add** `jewmanity.com`
2. At your domain registrar, add one of:
   - **CNAME** record: `jewmanity.com` → `cname.vercel-dns.com`
   - **A** record: `jewmanity.com` → `76.76.21.21`
3. Vercel auto-provisions an SSL certificate once DNS propagates

## Sanity Webhook (Auto-Redeploy on CMS Publish)

1. In Vercel: **Settings → Git → Deploy Hooks** → Create a hook for `main` branch
2. Copy the hook URL
3. In Sanity: **Settings → API → Webhooks → Add**
   - URL: the deploy hook URL from step 2
   - Trigger on: Create, Update, Delete
   - Filter: leave blank (all content types)
4. When content is published in Sanity, the site auto-rebuilds (~30 seconds)

## Sanity Studio

### Local development:
```bash
cd sanity
npm install
npm run dev
# Opens at http://localhost:3333
```

### Deploy hosted Studio:
```bash
cd sanity
npx sanity deploy
# Choose a hostname like "jewmanity" → available at jewmanity.sanity.studio
```

## Post-Deploy Checklist

- [ ] Switch Snipcart from Test to Live mode (Dashboard → toggle)
- [ ] Verify Donorbox production campaign is active
- [ ] Test contact form submission (Formspree)
- [ ] Test newsletter signup (Mailchimp)
- [ ] Test Add to Cart + checkout flow (Snipcart)
- [ ] Test donation widget (Donorbox)
- [ ] Run Lighthouse audit — target 95+ across all categories
- [ ] Verify all pages render correctly on mobile (375px)
- [ ] Check robots.txt and sitemap.xml are accessible
- [ ] Client walkthrough + CMS editor training
