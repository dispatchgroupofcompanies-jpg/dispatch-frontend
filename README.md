This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Backend and authentication

Browser API requests use `/backend/api/*`. Next.js rewrites that path to the Express backend, keeping the login cookie on the frontend origin. Set `BACKEND_API_URL` to the backend **origin** (without `/api`) in the frontend deployment. For this deployment it is `https://dispatch-backend-1-ukyv.onrender.com`. During local development it defaults to `http://localhost:5000`. The existing `NEXT_PUBLIC_API_URL` is accepted as a fallback by the rewrite, but browser code no longer calls it directly.

Set `FRONTEND_URL=https://www.xcdgocpvtltd.org` on the backend. The value may contain comma-separated origins; omit trailing paths. Keep the auth cookie at its default `SameSite=Lax` because browser requests now go through the same-origin rewrite. Do not set `AUTH_COOKIE_SAME_SITE=none` for this setup.

Deploy the backend and frontend auth changes together. Login returns a `HttpOnly` cookie, `/api/auth/me` validates the session, and logout clears the cookie. The frontend stores only optional remembered email and device ID in `localStorage`; it does not store the auth token there.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Frontend organization

- `app/`: Next.js routes/layouts and existing route-specific components.
- `src/components/layout/`: shared admin/user navigation, headers and workspace styles.
- `src/hooks/useMediaQuery.ts`: SSR-safe breakpoint subscription shared by layouts and responsive tables.
- `modules/invoice/pages/`: invoice screen implementation; existing entry points remain compatibility wrappers.
- `modules/`: existing feature components, auth and company modules.
- `src/services`, `src/types`, `src/config`, `src/templates`: API calls, shared types, API configuration and PDF/email HTML.

No files were deleted. Existing `app/components/*` and `src/app/admin/invoices/page.tsx` remain compatible exports. URLs, invoice templates, API behavior and stored data are unchanged by the layout organization. Mobile tables retain horizontal scrolling to keep all columns accessible. Validate navigation/drawers, invoice filters/downloads, forms, modals and login at phone/tablet/desktop widths before deployment.
