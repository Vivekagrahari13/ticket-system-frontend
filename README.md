# Ticket System: Frontend

The web app for a helpdesk where users raise support tickets and admins track them until they are closed. It talks to the Spring Boot backend in the `ticket-system-backend` repo.

## Tech stack

- [Next.js](https://nextjs.org) 16 with the App Router
- TypeScript
- Tailwind CSS 4
- Spring Boot API (separate repo) at `http://localhost:8080`

## Progress

| Screen | Route | Status |
| --- | --- | --- |
| Home | `/` | Done |
| Navbar (all pages) | n/a | Done |
| Register | `/register` | Layout done, API not connected |
| Login | `/login` | Not started |
| My tickets | `/tickets` | Not started |
| New ticket | `/tickets/new` | Not started |
| All tickets (admin) | `/admin/tickets` | Not started |

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (next to `package.json`):

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000`. The backend must be running on port 8080, and its `frontend-origin` setting must be `http://localhost:3000` so the browser can call it.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API. It is visible in the browser, so never put secrets in a `NEXT_PUBLIC_` variable. |

`.env.local` is ignored by git.

## Project structure

```
app/
  layout.tsx          # root layout: Navbar + page metadata
  page.tsx            # Home
  register/page.tsx   # Register form
  components/
    Navbar.tsx        # shared navigation
  globals.css         # Tailwind import
```

A file named `page.tsx` inside a folder becomes a route, so `app/register/page.tsx` is served at `/register`.

## Planned routes and access

| Route | Logged out | User | Admin |
| --- | --- | --- | --- |
| `/` | Allowed | Allowed | Allowed |
| `/login`, `/register` | Allowed | Redirect | Redirect |
| `/tickets`, `/tickets/new` | Redirect to `/login` | Allowed | Allowed |
| `/admin/tickets` | Redirect to `/login` | Redirect | Allowed |

The frontend redirects by role for a better experience, but the backend enforces access, so a direct API call from a user is still refused.

## Next steps

- Connect the Register form to `POST /auth/register`, with validation and error messages
- Login page and an auth context that holds the current user
- Protected pages for tickets and admin
- Loading, empty and error states for the ticket lists

## Learnings

- In the App Router a folder with a `page.tsx` is a route, and `layout.tsx` wraps every page
- Server Components by default, and `"use client"` only where state or events are needed
- Page metadata is exported from `layout.tsx` or from any `page.tsx`
- `Link` from `next/link` for navigation, and it requires an `href`
- Accessible forms: `label` connected to `input` with `htmlFor` and `id`
