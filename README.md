# E-Library Management System

Production-ready full-stack E-Library Management System built with Node.js, Express, MongoDB, Mongoose, JWT authentication, Swagger, React, and Axios.

## Features

### Backend

- JWT-based authentication with `register` and `login`
- Password hashing with `bcryptjs`
- Role-based access control for `admin` and `user`
- Versioned APIs under `/api/v1`
- Book issue and return business rules
- Centralized error handling
- Input validation with `express-validator`
- Basic security hardening with `helmet`, rate limiting, and Mongo sanitization
- Swagger API documentation at `/api/docs`

### Frontend

- Register page
- Login page
- Dashboard page
- Book listing
- Issue and return actions
- Admin-only add book, delete book, and user list
- JWT stored in `localStorage`
- Axios interceptor to attach token in request headers

## Project Structure

```text
Assigment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── .env.example
└── README.md
```

## Backend Setup

1. Open a terminal in [`backend`](C:/Users/91965/Desktop/Assigment/backend).
2. Copy `.env.example` to `.env`.
3. Update the environment variables.
4. Start MongoDB locally.
5. Run:

```bash
npm install
npm run dev
```

The backend runs on `http://localhost:5000`.

### Backend Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/elibrary
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

## Frontend Setup

1. Open a terminal in [`frontend`](C:/Users/91965/Desktop/Assigment/frontend).
2. Copy `.env.example` to `.env`.
3. Run:

```bash
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Frontend Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Books

- `GET /api/v1/books`
- `POST /api/v1/books`
- `DELETE /api/v1/books/:id`
- `POST /api/v1/books/:id/issue`
- `POST /api/v1/books/:id/return`

### Users

- `GET /api/v1/users`
- `GET /api/v1/users/summary`
- `POST /api/v1/users/admins`
- `DELETE /api/v1/users/:id`

## Business Rules

- Only authenticated users can access book routes.
- Only admins can add books, delete books, and view all users.
- A book cannot be issued if it is already issued.
- A book can only be returned by the user who issued it.
- Returning a book makes it available again and clears `issuedTo`.

## Swagger Docs

Swagger UI is available at:

```text
http://localhost:5000/api/docs
```

## Deployment

### Recommended Setup

- Deploy `backend` as a Node web service on Render.
- Deploy `frontend` as a static Vite app on Vercel.

### Backend on Render

Use the [`backend`](C:/Users/91965/Desktop/Assigment/backend) folder with:

- Build command: `npm install`
- Start command: `npm start`

Set these environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=1d
CLIENT_URL=https://your-frontend-domain.vercel.app,http://localhost:5173
```

After deployment, your API base URL will look like:

```text
https://your-backend-service.onrender.com/api/v1
```

### Frontend on Vercel

Use the [`frontend`](C:/Users/91965/Desktop/Assigment/frontend) folder with:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable:

```env
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api/v1
```

### Integration Checklist

1. Deploy the backend first and copy its live URL.
2. Set `VITE_API_BASE_URL` in the frontend deployment to that backend URL plus `/api/v1`.
3. Set `CLIENT_URL` in the backend deployment to the frontend domain.
4. Redeploy both services after updating env vars.
5. Verify `https://your-backend-service.onrender.com/health` and then test login from the live frontend.

## Postman Collection

Import the collection from [`postman/E-Library.postman_collection.json`](C:/Users/91965/Desktop/Assigment/postman/E-Library.postman_collection.json).

Recommended environment variables in Postman:

- `baseUrl` = `http://localhost:5000/api/v1`
- `token` = JWT from login/register response
- `bookId` = any created book id

## Step-by-Step Usage

1. Register a normal user or admin.
2. Login to receive a JWT token.
3. Use the token for authenticated routes.
4. As admin, create books and view users.
5. As user, issue an available book.
6. Return the book using the same user account.

## Scaling Notes

### Microservices

Split the monolith into focused services:

- Auth service for login, registration, token lifecycle, and user roles
- Catalog service for books, search, and metadata
- Circulation service for issue and return workflows
- Notification service for reminders, due dates, and alerts

These services can communicate through synchronous APIs for reads and asynchronous events for issue or return updates.

### Load Balancing

- Run multiple stateless API instances behind Nginx, HAProxy, or a cloud load balancer.
- Store JWT secrets and environment config in centralized secret management.
- Keep sessions stateless so any instance can serve any request.
- Use health checks against `/health` for instance rotation.

### Redis Caching

- Cache frequently requested book listings
- Cache user profile lookups and role metadata
- Use Redis for rate limiting or token deny lists if logout invalidation is needed
- Invalidate cache keys on book creation, issue, return, or delete

## Deliverables Included

- Full backend code
- Full frontend code
- Swagger docs
- README
- Postman collection
