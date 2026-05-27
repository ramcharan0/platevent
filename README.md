# Event Management Ecosystem

A modern event management platform built with React, TypeScript, and Vite. It supports role-based access for organizers, participants, sponsors, and volunteers, with a polished event directory, QR-based ticketing, live communication, and India-focused formatting for dates and currency.

## Features

- Role-based authentication with login and signup flows
- Organizer dashboard for managing events, registrations, budgets, sponsorships, and check-ins
- Participant experience with event discovery, registration, ticket QR codes, and status tracking
- Sponsor workflow for package browsing and partnership management
- Volunteer workflow for applications, task tracking, and event support
- Live communication hub shared across roles
- QR ticket generation and QR-based check-in support
- Indian currency and date formatting
- Event cards, profiles, and dashboard views backed by local app state
- Local persistence using `localStorage` so data stays available between refreshes

## What You Can Do

- Log in as different roles and see role-specific dashboards
- Browse events, register, and generate a QR-backed ticket
- Check in attendees from the organizer view using the saved ticket data
- Browse sponsorship packages and volunteer opportunities
- Send and view messages in the shared communication hub
- Edit profile details and keep them saved in the browser

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion / Motion
- lucide-react icons
- qrcode.react for QR code rendering

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

If you are starting from a fresh clone, install first and then run the app in development mode.

## Run Locally

Start the development server:

```bash
npm run dev
```

The app runs on port `3000` by default.

Open http://localhost:3000 in your browser after the server starts.

## Build For Production

Create an optimized production build:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

This is useful for checking the production bundle before you deploy.

## Lint And Type Check

Run the TypeScript check used by this project:

```bash
npm run lint
```

## Configuration Notes

- No backend setup is required for local development.
- The app uses browser storage for demo data and user state.
- Seeded content is defined in `src/data.ts` and can be replaced with your own events and accounts.

## Deployment

You can deploy this app as a static Vite build.

Common options include:

- Vercel
- Netlify
- GitHub Pages

For most platforms, the build command is `npm run build` and the output directory is `dist`.

## Included Demo Accounts

The app ships with seeded demo accounts so you can explore each role quickly:

- Organizer: `ravi.kumar@eventco.in` / `admin123`
- Sponsor: `anjali.sharma@optimatech.in` / `sponsor123`
- Participant: `lalit.mehra@camp.edu.in` / `participant123`
- Volunteer: `asha.mehta@volunteer.in` / `volunteer123`

## Project Structure

- `src/App.tsx` - central app state and action handlers
- `src/data.ts` - seed data for events, accounts, and role flows
- `src/types.ts` - shared TypeScript types
- `src/components/` - feature modules and dashboards
- `src/index.css` - base styling and theme tokens

## Troubleshooting

- If the app does not start, check that Node.js is installed and up to date.
- If the browser shows stale data, clear the site data or localStorage for the app domain.
- If a QR code does not appear, confirm the ticket was generated from the participant flow.
- If TypeScript reports errors, run `npm run lint` and fix the reported file before building again.

## Suggested Next Improvements

- Add real backend authentication and storage
- Add exportable reports for organizers
- Add notifications for event updates and ticket changes
- Add image uploads for events and profile avatars

