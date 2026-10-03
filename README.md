# Techslot Dev

A full-stack portfolio and freelance agency platform with a React website, an Express REST API, and a protected administration dashboard. The site presents projects and services, collects client inquiries, and lets administrators manage portfolio content.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Environment configuration](#environment-configuration)
- [Available scripts](#available-scripts)
- [Application routes](#application-routes)
- [API reference](#api-reference)
- [Administration and content seeding](#administration-and-content-seeding)
- [Production notes](#production-notes)
- [License](#license)

## Features

- Responsive portfolio website with home, about, services, projects, project details, and contact pages.
- Animated hero with a canvas-based orbital background and built-in pointer interaction.
- Project, service, and testimonial content loaded through the REST API.
- Contact inquiry submission with optional SMTP email delivery.
- JWT-authenticated admin area for managing projects, services, testimonials, and inquiries.
- MongoDB persistence through Mongoose, with an in-memory database fallback for local development.
- SEO metadata, canonical URLs, and Open Graph tags.

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7 |
| UI and animation | Custom CSS, Framer Motion, Lucide React |
| HTTP client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Authentication | JSON Web Tokens, bcryptjs |
| Security and middleware | Helmet, CORS, express-rate-limit |
| Email | Nodemailer |

## Project structure

```text
techslot/
├── client/
│   ├── public/                 # Static assets and site metadata
│   └── src/
│       ├── components/         # Shared UI, SEO, and orbital canvas
│       ├── context/            # Authentication state
│       ├── hooks/              # Reusable React hooks
│       ├── layouts/            # Public and admin layouts
│       ├── pages/              # Route-level pages
│       ├── sections/           # Homepage sections
│       ├── services/           # API client
│       ├── styles/             # Global and component styles
│       └── utils/              # Client utilities
└── server/
    ├── config/                 # Database and authentication configuration
    ├── controllers/            # API request handlers
    ├── middleware/             # Authentication, rate limiting, and errors
    ├── models/                 # Mongoose models
    ├── routes/                 # Express route definitions
    └── utils/                  # Seeder, mailer, and token utilities
```

## Requirements

- Node.js compatible with Vite 8 (Node.js 20.19+ or 22.12+ recommended).
- npm.
- MongoDB for persistent local or production data. In development, the server can use an in-memory MongoDB fallback if a MongoDB connection is unavailable.

## Getting started

### 1. Install dependencies

Open a terminal at the repository root and install the frontend and backend dependencies:

```powershell
cd server
npm install
cd ..\client
npm install
```

### 2. Configure the server

Create a local server environment file from the example:

```powershell
cd ..\server
Copy-Item .env.example .env
```

Open `server/.env` and set appropriate local values. See [Environment configuration](#environment-configuration).

### 3. Start the API

In the server terminal:

```powershell
npm run dev
```

The API listens on `http://localhost:5000` by default. Check that it is responding at `http://localhost:5000/api/health`.

### 4. Start the website

Open a second terminal:

```powershell
cd C:\path\to\techslot\client
npm run dev
```

Vite prints the local development URL in the terminal; the default is `http://localhost:5173`. By default, the frontend sends API requests directly to `http://localhost:5000/api`.

Keep both development servers running while using the site. The frontend can render without the API, but data-driven features such as projects, services, testimonials, contact submissions, and admin sign-in require it.

## Environment configuration

The server reads its configuration from `server/.env`. Use the committed `server/.env.example` as a template; do not commit `.env` files or real credentials.

| Variable | Purpose |
| --- | --- |
| `PORT` | API port. Defaults to `5000`. |
| `MONGO_URI` | MongoDB connection string. Defaults to local MongoDB at `mongodb://127.0.0.1:27017/techslot`. |
| `JWT_SECRET` | Secret used to sign authentication tokens. Replace the example with a unique, high-entropy secret before running outside local development. |
| `NODE_ENV` | Runtime environment. Use `development` locally and `production` in production. |
| `CLIENT_URL` | Frontend origin allowed by the API's CORS policy. Local default: `http://localhost:5173`. |
| `SMTP_USER` | Optional SMTP sender account used for inquiry email. |
| `SMTP_PASS` | Optional SMTP password or provider-specific app password. |
| `MAIL_TO` | Optional destination address for contact inquiry notifications. |

The frontend optionally accepts `VITE_API_URL` in `client/.env`. It can be set to the API base URL, with or without the `/api` suffix. When unset, the client uses `http://localhost:5000/api`.

For production, configure the frontend origin in `CLIENT_URL`, set `VITE_API_URL` to the deployed API, and provide secure database and JWT credentials. Never expose server secrets through `VITE_*` variables; Vite embeds those values in the client bundle.

## Available scripts

### Client (`client/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `client/dist`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run Oxlint on the client source. |

### Server (`server/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Node.js watch mode. |
| `npm start` | Start the API without watch mode. |
| `npm run seed` | Clear and seed the supported content collections and recreate the admin account. **This is destructive; see below.** |
| `npm run sync:portfolio` | Run the portfolio project synchronization utility. |

## Application routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Portfolio homepage |
| `/about` | Public | Developer profile |
| `/services` | Public | Services |
| `/projects` | Public | Project listing |
| `/projects/:id` | Public | Project details |
| `/contact` | Public | Contact form |
| `/login` | Public | Admin sign-in |
| `/admin` | Authenticated admin | Dashboard and content management |

## API reference

All API routes are prefixed with `/api`. Protected endpoints require a valid JWT bearer token; content-management operations are restricted to administrators.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API health check |
| `POST` | `/api/auth/login` | Public, rate limited | Sign in |
| `GET` | `/api/auth/me` | Authenticated | Get the current user |
| `GET` | `/api/projects` | Public | List projects; supports query filters |
| `GET` | `/api/projects/:id` | Public | Get a project by ID or slug |
| `POST` | `/api/projects` | Admin | Create a project |
| `PUT` | `/api/projects/:id` | Admin | Update a project |
| `DELETE` | `/api/projects/:id` | Admin | Delete a project |
| `GET` | `/api/services` | Public | List services |
| `GET` | `/api/services/:id` | Public | Get a service |
| `POST` | `/api/services` | Admin | Create a service |
| `PUT` | `/api/services/:id` | Admin | Update a service |
| `DELETE` | `/api/services/:id` | Admin | Delete a service |
| `GET` | `/api/testimonials` | Public | List testimonials |
| `POST` | `/api/testimonials` | Admin | Create a testimonial |
| `PUT` | `/api/testimonials/:id` | Admin | Update a testimonial |
| `DELETE` | `/api/testimonials/:id` | Admin | Delete a testimonial |
| `POST` | `/api/contact` | Public, rate limited | Submit an inquiry |
| `GET` | `/api/contact` | Admin | List inquiries |
| `PUT` | `/api/contact/:id` | Admin | Update an inquiry status |
| `DELETE` | `/api/contact/:id` | Admin | Delete an inquiry |

## Administration and content seeding

Sign in at `/login`; after authentication, the protected dashboard is available at `/admin`. Admin users manage projects, services, testimonials, and contact inquiries.

To seed sample portfolio content and create the admin account, run this from `server/`:

```powershell
npm run seed
```

> **Warning:** The seeder deletes all existing users, projects, services, and testimonials before inserting sample records and recreating the admin user. Back up any data you need before running it. Do not run the seeder against a production database.

The seed utility currently contains a built-in development admin credential and prints it in the server terminal. Change or replace this credential before exposing the application to other users; never rely on sample credentials in production.

## Production notes

- Build the frontend with `cd client; npm run build` and serve the generated `client/dist` directory using a static host or web server.
- Start the API with `cd server; npm start`.
- Use a persistent MongoDB deployment. The in-memory fallback is intended only for development; its data is temporary and disappears when the process stops.
- Set `NODE_ENV=production`, a strong unique `JWT_SECRET`, the production `MONGO_URI`, and the correct `CLIENT_URL`.
- Configure `VITE_API_URL` at frontend build time when the API is not served from the same origin.
- Configure SMTP variables only when contact inquiry emails are required.
- Deploy the SPA with history fallback enabled so direct visits to routes such as `/projects` and `/login` return the frontend entry point.

## License

This project is licensed under the ISC License. See the `license` field in `server/package.json`.
