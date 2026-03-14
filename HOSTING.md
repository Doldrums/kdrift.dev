# kdrift.dev — Hosting & Infrastructure Spec

## Overview

Static marketing site (Vite build output). No SSR, no backend, no database.
All forms are client-side — wire to an external service (Formspree, Resend, or custom API).

---

## Option A: Cloudflare Pages (recommended)

**Why:** Free tier covers everything. Global CDN, automatic HTTPS, preview deploys on PRs, custom domain support. Zero config.

### Resources

| Resource | Spec | Cost |
|---|---|---|
| Hosting | Cloudflare Pages Free | $0/mo |
| CDN | Cloudflare global (300+ PoPs) | included |
| TLS/SSL | Automatic, Let's Encrypt | included |
| Custom domain | `kdrift.dev` via Cloudflare DNS | $0 (domain reg separate) |
| Bandwidth | Unlimited | included |
| Build minutes | 500/mo | included |
| Preview deploys | Unlimited | included |

### Setup

```bash
# build
cd web && pnpm build

# deploy (one-time setup)
npx wrangler pages project create kdrift-web
npx wrangler pages deploy dist

# or connect GitHub repo for auto-deploy on push
```

### DNS

```
kdrift.dev      CNAME   kdrift-web.pages.dev
www.kdrift.dev  CNAME   kdrift-web.pages.dev
```

### Headers (`public/_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## Option B: Vercel

**Why:** If you want edge functions later (waitlist API, form handling). Free tier is generous.

### Resources

| Resource | Spec | Cost |
|---|---|---|
| Hosting | Vercel Hobby | $0/mo |
| CDN | Vercel Edge Network | included |
| TLS/SSL | Automatic | included |
| Bandwidth | 100 GB/mo | included |
| Builds | 6000 min/mo | included |
| Serverless functions | 100 GB-hrs/mo | included (if needed later) |

### Setup

```bash
npx vercel --prod
```

---

## Option C: Netlify

**Why:** Similar to Cloudflare Pages. Good forms integration (Netlify Forms) — could handle the contact form without external service.

### Resources

| Resource | Spec | Cost |
|---|---|---|
| Hosting | Netlify Free | $0/mo |
| CDN | Netlify Edge | included |
| Bandwidth | 100 GB/mo | included |
| Build minutes | 300/mo | included |
| Form submissions | 100/mo | included |
| TLS/SSL | Automatic | included |

---

## Domain

| Item | Provider | Cost |
|---|---|---|
| `kdrift.dev` | Cloudflare Registrar / Namecheap / Google Domains | ~$12/yr |
| DNS | Cloudflare (free tier) | $0 |

---

## External Services (all pages)

### Contact Form

Pick one:

| Service | Free tier | Notes |
|---|---|---|
| Formspree | 50 submissions/mo | Drop-in, no backend |
| Resend | 3,000 emails/mo | API-based, needs a serverless function |
| Netlify Forms | 100/mo | Only on Netlify hosting |
| Custom API | — | Wire to `ra` API or a simple worker |

### Newsletter / Email Subscribe

| Service | Free tier | Notes |
|---|---|---|
| Buttondown | 100 subscribers | Minimal, developer-focused |
| Resend + Audience | 3,000 emails/mo | If already using Resend |
| Loops | 1,000 contacts | Startup-focused |

### Analytics

| Service | Free tier | Notes |
|---|---|---|
| Cloudflare Web Analytics | Unlimited | Privacy-first, no JS tag needed on CF Pages |
| Plausible | $9/mo (or self-host free) | Lightweight, GDPR-compliant |
| PostHog | 1M events/mo | If you want product analytics later |
| None | — | Fine for launch. Add later. |

---

## Build Output

```bash
pnpm build
```

Produces `dist/` directory:

| File type | Expected size |
|---|---|
| HTML pages (12) | ~15 KB each (uncompressed) |
| CSS (1 bundle) | ~12 KB (minified) |
| JS (1 bundle) | ~3 KB (minified) |
| Fonts | Loaded from Google Fonts CDN |
| **Total** | ~200 KB uncompressed, ~60 KB gzipped |

---

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | > 95 |
| First Contentful Paint | < 1.0s |
| Largest Contentful Paint | < 1.5s |
| CLS | 0 |
| Total page weight (gzipped) | < 80 KB |
| TTFB | < 100ms (CDN edge) |

---

## Recommended Stack for Launch

```
Hosting:        Cloudflare Pages (free)
Domain:         kdrift.dev on Cloudflare DNS (~$12/yr)
TLS:            Automatic (Cloudflare)
CDN:            Cloudflare (300+ PoPs, free)
Contact form:   Formspree free tier (50/mo)
Newsletter:     Buttondown free tier (100 subscribers)
Analytics:      Cloudflare Web Analytics (free, privacy-first)
CI/CD:          GitHub → Cloudflare Pages auto-deploy

Total cost:     ~$1/mo (domain amortized)
```

---

## Scaling Notes

This is a static site. It scales infinitely on any CDN. No servers to manage.

If you later need:
- **Waitlist API** → Cloudflare Worker (free tier: 100K req/day)
- **Blog CMS** → Keep as static HTML or add Markdown + build step
- **Auth / dashboard** → Separate app, separate subdomain (app.kdrift.dev)
- **Docs site** → `docs.kdrift.dev` with VitePress or Starlight
