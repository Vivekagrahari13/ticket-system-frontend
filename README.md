# Ticket System: Frontend

A helpdesk web app. Users register, log in, raise support tickets, edit them, and withdraw them. Admins see every ticket, start work, and close tickets with a resolution note. Tickets are never deleted. It talks to the Spring Boot API in the `ticket-system-backend` repo.

## Features

- Register and log in, with a show or hide password button (JWT stored in an `HttpOnly` cookie, so JavaScript can't read it)
- Navbar that changes with login state and role
- My tickets: only the tickets you raised, for admins too, with a status filter, pagination, loading, empty and error states
- New ticket form with server-side validation messages and a pending state
- Edit a ticket while it is open or in progress
- Withdraw your own ticket while it is still open
- Admin page (All tickets): every user's tickets from `GET /admin/tickets`, a status dropdown that offers only valid next statuses, and a dialog that asks for a resolution note when closing
- Final tickets (closed or withdrawn) are read-only, and a closed ticket shows its resolution note
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
| `/tickets` | My tickets, with Edit and Withdraw | Logged-in users |
| `/tickets/new` | New ticket | Logged-in users |
| `/tickets/[id]/edit` | Edit ticket | Owner or admin, while the ticket is not final |
| `/admin/tickets` | All tickets | Admins only |

The frontend redirects by role and hides invalid options to keep the experience clean, but the backend is what enforces access and the status rules. A direct API call that breaks a rule still gets a 403 or 409.

## Ticket lifecycle in the UI

A ticket only moves forward: `OPEN` to `IN_PROGRESS` to `CLOSED`, or `OPEN` to `CLOSED`, or the owner's `OPEN` to `WITHDRAWN`.

| Action | Who | Where | Shown when |
| --- | --- | --- | --- |
| Edit | Owner or admin | My tickets, admin table | Status is `OPEN` or `IN_PROGRESS` |
| Withdraw | Owner | My tickets | Status is `OPEN` |
| Start work or close | Admin | Admin table dropdown | Only the valid next statuses are listed |
| Close with a note | Admin | Dialog | A resolution note is required |

The helper `nextStatuses()` and `isFinalStatus()` in `types/ticket.ts` mirror the backend table.

## Project structure

```
app/                      routes: a folder with a page.tsx is a URL
  layout.tsx              wraps every page: AuthProvider + Navbar + page metadata
  page.tsx                Home
  login/  register/       auth forms
  tickets/                list, tickets/new (form), tickets/[id]/edit
  admin/tickets/          admin table
components/               Navbar, StatusBadge, Pagination, AuthCard, EmailInput, PasswordInput,
                          LoginForm, RegisterForm, NewTicketForm, HomeActions,
                          MyTickets, AdminTickets, EditTicket
context/AuthContext.tsx   current user, loading flag, login and logout helpers
hooks/                    useRequireAuth (route guard), useTickets, useTicket
services/api.ts           the one place that calls the backend
types/ticket.ts           shared types, labels, and the status helpers
```

## How it works

**Login state.** The cookie is `HttpOnly`, so the frontend can't read it. When the app loads, `AuthContext` calls `GET /auth/me`. A 200 gives the user, a 401 means logged out. Components read the result with `useAuth()`.

**Calling the API.** Everything goes through `services/api.ts`. It sends the cookie (`credentials: "include"`), and turns error responses into an `ApiError` with the backend's `message` and `fieldErrors`, which forms show under the fields.

**Server vs client components.** `layout.tsx` and every route entry (`page.tsx`) are Server Components. The interactive parts live in client components under `components/` (`LoginForm`, `RegisterForm`, `NewTicketForm`, `MyTickets`, `AdminTickets`, `EditTicket`, `HomeActions`). Everything that needs state, effects or events starts with `"use client"`.

**Auth screens.** `AuthCard` is the shared frame (logo, heading, footer link). `EmailInput` and `PasswordInput` share their look from `inputStyles.ts`. The show or hide password button appears only once something is typed, and has a hover state and a tooltip. The home page shows Create account and Log in to visitors, and Raise a ticket and My tickets to logged-in users.

**Loading tickets.** `useTickets` fetches `/tickets` for "My tickets" and `/admin/tickets` for the admin page (the `scope` option), and `useTicket` fetches one ticket. Server errors show a `reference` id that matches the backend logs. Their `loading` value is derived from the current result and key, not stored separately, so it can't get out of sync. A cancel flag stops a slow old request from overwriting a newer one.

## Flows

- **Page load:** AuthProvider calls `/auth/me`, then the Navbar shows the right links.
- **Login:** `POST /auth/login` sets the cookie, the context stores the user, and the app redirects by role.
- **Edit:** the edit page loads the ticket, shows a pre-filled form, sends `PUT /tickets/{id}`, and returns to the list. A final ticket shows a read-only message instead of the form.
- **Withdraw:** a confirm, then `POST /tickets/{id}/withdraw`, then the list reloads even on an error so it shows the real status.
- **Admin changes a status:** choosing `In progress` sends `PATCH /tickets/{id}/status`. Choosing `Closed` opens a dialog for the resolution note first.

## What this covers from the bootcamp

- App Router, layouts, nested and dynamic routes, metadata
- Server vs Client Components and the `"use client"` boundary
- Components, props, composition, keys, conditional rendering
- `useState`, `useEffect`, `useContext`, `useRouter`, `useParams`, and custom hooks
- Controlled forms, validation messages, and double-submit prevention
- Cookie-based auth, authorization enforced on the server, no secrets in `NEXT_PUBLIC_`
- Loading, empty and error states

## Next steps

- A ticket detail page with a status history timeline
- `loading.tsx`, `error.tsx` and `not-found.tsx`
- Status filter and page number in the URL (`/tickets?status=OPEN&page=2`)
- Send `If-Match` on edits once the backend supports optimistic locking
- Middleware, security headers and a CSP
- Tests (React Testing Library, Playwright), Dockerfile and CI
