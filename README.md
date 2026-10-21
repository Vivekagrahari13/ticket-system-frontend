# Ticket System: Frontend

A helpdesk web app. Users register, log in and raise support tickets. Admins see every ticket, change its status and delete it. It talks to the Spring Boot API in the `ticket-system-backend` repo.

## Features

- Register and log in (JWT stored in an `HttpOnly` cookie, so JavaScript can't read it)
- Navbar that changes with login state and role
- My tickets: status filter, pagination, loading, empty and error states
- New ticket form with server-side validation messages and a pending state
- Admin page: every user's tickets, change status from a dropdown, delete with a confirm
- Route guards: logged-out visitors go to `/login`, non-admins can't open the admin page

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript
- Tailwind CSS 4
- Spring Boot API at `http://localhost:8080` (separate repo)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root (next to `package.json`):

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. Start the backend, then the frontend:

   ```bash
   npm run dev
   ```

The app runs at `http://localhost:3000`. The backend's `FRONTEND_ORIGIN` must be `http://localhost:3000`, or the browser blocks the requests and the login cookie.

`NEXT_PUBLIC_` variables are visible in the browser, so never put secrets in them. `.env.local` is ignored by git.

## Routes

| Route | Page | Who can open it |
| --- | --- | --- |
| `/` | Home | Everyone |
| `/register` | Register | Everyone |
| `/login` | Log in | Everyone |
| `/tickets` | My tickets | Logged-in users |
| `/tickets/new` | New ticket | Logged-in users |
| `/admin/tickets` | All tickets | Admins only |

The frontend redirects by role to keep the experience clean, but the backend is what enforces access. A user who calls an admin endpoint directly still gets a 403.

## Project structure

```
app/                      routes: a folder with a page.tsx is a URL
  layout.tsx              wraps every page: AuthProvider + Navbar + page metadata
  page.tsx                Home
  login/  register/       auth forms
  tickets/                list, and tickets/new for the form
  admin/tickets/          admin table
components/               Navbar, StatusBadge, Pagination
context/AuthContext.tsx   current user, loading flag, login and logout helpers
hooks/                    useRequireAuth (route guard), useTickets (fetch a page of tickets)
services/api.ts           the one place that calls the backend
types/ticket.ts           shared types and status/priority labels
```

## How it works

**Login state.** The cookie is `HttpOnly`, so the frontend can't read it. When the app loads, `AuthContext` calls `GET /auth/me`. A 200 gives the user, a 401 means logged out. Components read the result with `useAuth()`.

**Calling the API.** Everything goes through `services/api.ts`. It sends the cookie (`credentials: "include"`), and turns error responses into an `ApiError` with the backend's `message` and `fieldErrors`, which forms show under the fields.

**Server vs client components.** `layout.tsx` and the Home page are Server Components (the default). Anything that needs state, effects or events starts with `"use client"`: the auth context, Navbar, forms and ticket pages.

**Loading tickets.** `useTickets` fetches `/tickets?page=&size=&status=`. Its `loading` value is derived from the current result and key, not stored separately, so it can't get out of sync. A cancel flag stops a slow old request from overwriting a newer one.

## Flows

- **Page load:** AuthProvider calls `/auth/me`, then the Navbar shows the right links.
- **Login:** `POST /auth/login` sets the cookie, the context stores the user, and the app redirects by role.
- **Admin changes a status:** `PATCH /tickets/{id}/status`, then the list reloads.

## What this covers from the bootcamp

- App Router, layouts, nested routes, metadata
- Server vs Client Components and the `"use client"` boundary
- Components, props, composition, keys, conditional rendering
- `useState`, `useEffect`, `useContext`, `useRouter`, and custom hooks
- Controlled forms, validation messages, and double-submit prevention
- Cookie-based auth, authorization enforced on the server, no secrets in `NEXT_PUBLIC_`
- Loading, empty and error states

## Next steps

- `loading.tsx`, `error.tsx` and `not-found.tsx`
- Per-page metadata
- Status filter and page number in the URL (`/tickets?status=OPEN&page=2`)
- Middleware, security headers and a CSP
- Tests (React Testing Library, Playwright), Dockerfile and CI
