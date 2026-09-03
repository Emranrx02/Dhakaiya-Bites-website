# Dhakaiya Bites Website

Official website for **Dhakaiya Bites**, a real fast-food restaurant in Mirpur 10, Dhaka. The project presents the brand, full digital menu, staff verification flow, and contact details in a clean, mobile-friendly experience.

## Overview

Dhakaiya Bites is built as a restaurant-first marketing site with a dedicated menu gallery, public staff lookup, and privacy-conscious verification pages. The goal is to make the restaurant easy to explore, easy to contact, and safe to verify.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Custom CSS

## Features

- Full digital menu with 11 menu pages
- Category cards for featured items and pricing
- Dedicated full menu page at `/menu`
- Staff ID verification page
- Public staff profiles with QR-based lookup support
- Privacy protections for sensitive staff details
- Direct call-to-order and map links
- Responsive layout for mobile and desktop
- Digital rewards card with 7-stamp / 15-day logic
- Cashier approval and free-dish redemption portal
- Printable in-store rewards QR

## Project Structure

- `app/page.tsx` - homepage and menu entry point
- `app/menu/page.tsx` - full menu gallery page
- `app/verify/[code]/page.tsx` - staff verification profile page
- `app/admin/page.tsx` - admin-facing view
- `app/rewards/page.tsx` - customer stamp card
- `app/cashier/page.tsx` - protected cashier portal
- `supabase/rewards.sql` - rewards database schema and transaction functions
- `components/StaffQr.tsx` - QR/profile helper component
- `data/staff.ts` - staff data source
- `public/brand/` - brand images and logo assets
- `public/menu/` - menu page images

## Local Setup

Install dependencies.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Open the app in your browser.

```text
http://localhost:3000
```

## Deployment

This project is ready for Vercel deployment.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Set environment variables if needed.
4. Deploy the main branch.

### Rewards database

1. Create a Supabase project and run `supabase/rewards.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local` for local development.
3. Add the same variables to the Vercel project settings before deploying.

`SUPABASE_SERVICE_ROLE_KEY`, `CASHIER_PIN`, and `CASHIER_SESSION_SECRET` are server-only secrets. Never expose them with a `NEXT_PUBLIC_` prefix.

## Future Roadmap

- Admin dashboard for menu and staff management
- Better analytics and customer engagement tooling
- Expanded QR-based staff profile workflow

## Portfolio

Created by **Emran Haque**

- Portfolio: [emranhaque.com](https://emranhaque.com)
- GitHub: [Emranrx02](https://github.com/Emranrx02)

## License

This repository is for the Dhakaiya Bites restaurant project and related portfolio use.
