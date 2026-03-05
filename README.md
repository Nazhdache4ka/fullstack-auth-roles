# Backend + Frontend

Monorepo: Express API (Node.js) + React SPA. A blog with posts, comments, auth, and admin panel.

---

## Stack

### Backend
Node.js · Express 5 · MariaDB (no ORM) · JWT · bcrypt · express-validator · cookie-parser · cors

### Frontend
React 19 · TypeScript · Vite 7 · React Router 7 · TanStack Query · MUI 7 · Axios · Zustand

---

## Features

- **Auth:** register, login, logout, refresh via cookie, role check on app load.
- **Posts:** paginated list, single post view, create / edit / delete (authenticated users).
- **Comments:** list under each post, add, edit your own, delete (author or admin).
- **Users:** user list page; admin panel — users with extra info (IP, user-agent, last login), change role (user/admin).

Roles: `user`, `admin`. Access to `/admin` and role-management endpoints is admin-only.

---

## API (Backend)

Base path: `/api` (posts, users), `/api/auth` (auth).

### Auth

| Method | Path                 | Description                                                           |
| ------ | -------------------- | --------------------------------------------------------------------- |
| POST   | `/api/auth/register` | Register (body: `username`, `password`), validation 3–32 / 8–32 chars |
| POST   | `/api/auth/login`    | Login                                                                 |
| POST   | `/api/auth/logout`   | Logout (clear cookie)                                                 |
| POST   | `/api/auth/refresh`  | Refresh access token using refresh cookie                             |

### Posts

| Method | Path                        | Description        |
| ------ | --------------------------- | ------------------ |
| GET    | `/api/posts?limit=&offset=` | List posts (auth)  |
| GET    | `/api/posts/:id`            | Single post (auth) |
| POST   | `/api/posts`                | Create (auth)      |
| PUT    | `/api/posts`                | Update (auth)      |
| DELETE | `/api/posts/:id`            | Delete (auth)      |

### Comments

| Method | Path                                     | Description                                |
| ------ | ---------------------------------------- | ------------------------------------------ |
| GET    | `/api/posts/:postId/comments`            | Post comments (auth)                       |
| POST   | `/api/posts/:postId/comment`             | Create comment (auth)                      |
| PUT    | `/api/posts/:postId/comments`            | Edit (body: `content`, `commentId`) (auth) |
| DELETE | `/api/posts/:postId/comments/:commentId` | Delete (auth)                              |

### Users

| Method | Path                        | Description                                         |
| ------ | --------------------------- | --------------------------------------------------- |
| GET    | `/api/users?limit=&offset=` | List users (auth)                                   |
| GET    | `/api/users/info`           | Extended info for admin (admin only)                |
| PATCH  | `/api/users/role`           | Change role (body: `userId`, `roleId`) (admin only) |

Protected routes use JWT in `Authorization: Bearer <token>`. Refresh token is sent via httpOnly cookie.

---

## Frontend structure

```
src/front/fronttest/src/
├── api/                 # Services (auth, post, comment, user), axios interceptors, useInvalidators
├── store/               # Zustand (use-auth-store)
├── hooks/               # useIsAuth (auth check on app load)
├── interface.ts         # IPost, IUser, IComment, IAuthResponse, UserRole
├── App.tsx              # Routes, QueryClient, auth check
├── pages/               # Home, Posts, Post, Login, Register, Users, Admin
└── components/
    ├── auth/            # LoginForm, RegisterForm + useAuth (login/register, errors, snackbar)
    ├── comment/         # Comments, InputComment + useComment, useInputComment
    ├── layout/          # Layout, Navbar, ErrorAlert + useNavbar
    ├── modal/           # ModalCreatePost, ModalUpdatePost, ModalCommentUpdate + useCommentModal
    ├── post-compound/   # Post (context + components)
    └── user-compound/   # User card (context + components)
```

Queries and mutations live in custom hooks (useAuth, useComment, useInputComment, useCommentModal, useNavbar); components mostly render UI and call these hooks.

---

## Running the project

### Environment

- **Backend:** in project root, `.env` with `PORT`, `FRONT_URL`, DB vars (MariaDB), and JWT secrets (access/refresh).
- **Frontend:** in `src/front/fronttest/`, `.env` with `VITE_BACKEND_URL` (backend URL).

### Commands

**Backend (repo root):**

```bash
npm install
npm run dev    # nodemon
# or
npm start      # node
```

**Frontend:**

```bash
cd src/front/fronttest
npm install
npm run dev
```

Frontend build: `npm run build` (from fronttest folder).

---
