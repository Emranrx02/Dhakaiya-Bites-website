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

## Project Structure

- `app/page.tsx` - homepage and menu entry point
- `app/menu/page.tsx` - full menu gallery page
- `app/verify/[code]/page.tsx` - staff verification profile page
- `app/admin/page.tsx` - admin-facing view
- `components/StaffQr.tsx` - QR/profile helper component
- `data/staff.ts` - staff data source
- `public/brand/` - brand images and logo assets
- `public/menu/` - menu page images

## Local Setup

1. Install dependencies.
	```bash
	npm install
	```
2. Start the development server.
	```bash
	npm run dev
	```
3. Open the app in your browser.
	```
	http://localhost:3000
	```

## Deployment

This project is ready for Vercel deployment.

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Set environment variables if needed.
4. Deploy the main branch.

## Future Roadmap

- Supabase backend for structured staff/admin data
- Admin dashboard for menu and staff management
- Better analytics and customer engagement tooling
- Expanded QR-based staff profile workflow

## Portfolio

Created by **Emran Haque**

- Portfolio: https://emranhaque.com
- GitHub: https://github.com/Emranrx02

## License

This repository is for the Dhakaiya Bites restaurant project and related portfolio use.
