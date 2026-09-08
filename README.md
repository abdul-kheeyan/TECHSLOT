# techslot.dev — Full-Stack Freelance Agency Platform

A production-ready MERN stack freelancing website for **techslot.dev**, featuring a public portfolio site and a JWT-protected admin dashboard.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, Vite, React Router v7, Framer Motion, Axios, Lucide React |
| Styling | Custom CSS design system (no Tailwind) |
| Backend | Node.js, Express, Mongoose, JWT, bcryptjs |
| Database | MongoDB Atlas / local MongoDB / in-memory fallback |

## Quick Start

### 1. Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Environment Setup

```bash
# server/.env
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/techslot
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

> If MongoDB is not running, the server automatically falls back to an in-memory database in development mode.

### 3. Seed Database

```bash
cd server && npm run seed
```

Default admin credentials:
- **Email:** `admin@techslot.dev`
- **Password:** `Admin@TechSlot2025!`

### 4. Start Development Servers

```bash
# Terminal 1 — API (port 5000)
cd server && npm run dev

# Terminal 2 — Client (port 5173)
cd client && npm run dev
```

Visit **http://localhost:5173**

## Project Structure

```
techslot/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── sections/     # Homepage sections
│   │   ├── pages/        # Route pages
│   │   ├── layouts/      # Main & Admin layouts
│   │   ├── styles/       # CSS design system
│   │   └── services/     # Axios API client
│   └── public/
└── server/          # Express REST API
    ├── models/      # Mongoose schemas
    ├── controllers/ # Business logic
    ├── routes/      # API endpoints
    └── utils/       # Seeder, token helpers
```

## API Endpoints

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/projects` | Public |
| GET | `/api/services` | Public |
| GET | `/api/testimonials` | Public |
| POST | `/api/contact` | Public |
| POST/PUT/DELETE | `/api/projects` etc. | Admin (JWT) |

## Admin Dashboard

Navigate to `/login` and sign in with the seeded admin credentials. The dashboard at `/admin` provides:

- Overview metrics
- Project CRUD
- Service CRUD
- Testimonial CRUD
- Inquiry pipeline (New → Contacted → Completed)

## Build for Production

```bash
cd client && npm run build
cd ../server && npm start
```

## License

ISC — techslot.dev
