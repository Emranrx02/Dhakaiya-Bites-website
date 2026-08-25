Dhakaiya Bites — Restaurant Website

A modern, responsive restaurant website developed for Dhakaiya Bites, a fast-food restaurant based in Mirpur 10, Dhaka. The project presents the restaurant's brand, complete menu, contact information, and a staff verification workflow in a clean customer-facing experience.

Fast Bites. Big Flavour. Every craving, one place.

Project Overview

This project was created as a real-world business website for Dhakaiya Bites. It focuses on mobile responsiveness, clear menu discovery, direct ordering, brand consistency, and customer trust.

The website includes the restaurant's official branding and menu assets. Its staff verification structure allows visitors to check a team member using a unique staff ID and view approved public employment information.

Key Features

Responsive restaurant landing page

Official Dhakaiya Bites branding

Full multi-page digital food menu

Menu categories with pricing previews

Direct call-to-order functionality

Restaurant address and map direction links

Staff verification using unique staff IDs

Active and inactive staff status

Individual staff verification pages

QR code generation for staff profiles

Privacy-focused public staff information

SEO and social-sharing metadata

Vercel-ready production configuration

Staff Verification

Each staff member can have a unique verification URL:

/verify/1024

The public verification page can display:

Staff name and photograph

Designation

Staff ID

Joining date

Active or inactive status

Verification QR code

Sensitive information such as NID numbers, home addresses, salaries, and private phone numbers is intentionally excluded.

The current version uses a simple file-based staff data structure for easy development. A database-backed admin system using Supabase is planned for a future release.

Technology Stack

Framework: Next.js 16

Language: TypeScript

UI: React 19

Styling: Tailwind CSS and custom responsive CSS

Routing: Next.js App Router

QR Codes: qrcode.react

Deployment: Vercel

Version Control: Git and GitHub

Project Structure

dhakaiya-bites-nextjs/
├── app/
│   ├── menu/                 # Full digital menu page
│   ├── verify/[code]/        # Dynamic staff verification profile
│   ├── admin/                # Admin-ready staff overview
│   ├── globals.css           # Main website styles
│   ├── layout.tsx            # Metadata and root layout
│   └── page.tsx              # Homepage
├── components/
│   └── StaffQr.tsx           # Staff QR code component
├── data/
│   └── staff.ts              # Staff records for the starter version
├── public/
│   ├── brand/                # Logo and brand assets
│   ├── menu/                 # Full menu images
│   └── food/                 # Food and category images
├── .env.example
├── package.json
└── README.md

Run Locally

Clone the repository:

git clone https://github.com/Emranrx02/Dhakaiya-Bites-website.git
cd Dhakaiya-Bites-website

Install dependencies:

npm install

Create the local environment file:

cp .env.example .env.local

Start the development server:

npm run dev

Open http://localhost:3000 in your browser.

Environment Variables

NEXT_PUBLIC_SITE_URL=http://localhost:3000

After deployment, replace the local URL with the production domain.

Production Build

npm run build
npm start

Deployment

The project is configured for deployment on Vercel:

Push the project to GitHub.

Import the repository into Vercel.

Add NEXT_PUBLIC_SITE_URL in the Vercel environment variables.

Deploy the project.

Update the environment variable after connecting a custom domain.

Planned Improvements

Supabase database integration

Secure administrator authentication

Staff management dashboard

Database-driven menu management

Online ordering and cart system

Customer reviews and testimonials

Food availability controls

Improved analytics and SEO

Developer

Emran Haque
Web3 Growth Strategist & Blockchain Product Coordinator
Portfolio: emranhaque.com
GitHub: @Emranrx02

Repository

github.com/Emranrx02/Dhakaiya-Bites-website

This project was designed and developed for the official Dhakaiya Bites restaurant website.