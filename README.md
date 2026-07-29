# Simple Note Taking App

A modern full-stack note-taking application built with **React**, **Bun**, **Hono**, **PostgreSQL**, and **Drizzle ORM**. This project demonstrates a clean and maintainable architecture while implementing user authentication, note management, form validation, and modern frontend/backend development practices.

---

## ✨ Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected API endpoints

### Note Management

* Create notes
* View all notes
* View note details
* Update notes
* Delete notes

### Frontend

* Responsive user interface
* Client-side routing
* Server state management
* Form validation
* Type-safe API communication

### Backend

* RESTful API
* Layered architecture
* PostgreSQL integration
* Drizzle ORM
* Request validation using Zod
* Environment-based configuration

---

# Tech Stack

## Frontend

* React
* Vite
* TypeScript
* TanStack Router
* TanStack Query
* TanStack Form
* Tailwind CSS
* Base UI
* Zod
* Vitest

## Backend

* Bun
* Hono
* TypeScript
* PostgreSQL
* Drizzle ORM
* JWT (jose)
* bcrypt
* Zod
* Vitest

---

# Architecture

The application is separated into two independent applications:

```text
Frontend (React)
        │
        │ HTTP / REST API
        ▼
Backend (Hono)
        │
        ▼
PostgreSQL
```

The backend follows a layered architecture to improve maintainability and separation of concerns.

```text
Routes
   │
Controllers
   │
Services
   │
Repositories
   │
Database
```

---

# Project Structure

```text
simple-note-taking-app
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── repositories
│   │   ├── routes
│   │   ├── middlewares
│   │   ├── schemas
│   │   ├── db
│   │   └── utils
│   └── ...
│
└── README.md
```

---

# Highlights

This project focuses on applying modern software engineering practices instead of only implementing CRUD functionality.

Some engineering practices demonstrated include:

* Layered backend architecture
* Separation of business logic and database access
* Type-safe development using TypeScript
* Input validation using Zod
* JWT authentication
* PostgreSQL relational database design
* Reusable frontend architecture
* Modular code organization
* Automated testing with Vitest

---

# Getting Started

## Prerequisites

* Bun
* Node.js
* PostgreSQL

---

## Clone Repository

```bash
git clone <repository-url>

cd simple-note-taking-app
```

---

## Backend

```bash
cd backend

bun install

bun run dev
```

---

## Frontend

```bash
cd frontend

bun install

bun run dev
```

---

# Environment Variables

Backend requires a `.env` file.

Example:

```env
DATABASE_URL=postgres://...
JWT_SECRET=your-secret
PORT=3000
```

---

# Testing

Both frontend and backend include automated tests using **Vitest**.

Run tests:

Backend

```bash
bun test
```

Frontend

```bash
bun test
```

---

# Future Improvements

Some planned improvements include:

* Refresh Token Authentication
* Docker Compose
* API Documentation (OpenAPI / Swagger)
* Pagination & Search
* Note Categories & Tags
* File Attachments
* CI/CD Pipeline
* Role-Based Authorization
* Dark Mode
* Offline Support

---

# What I Learned

Building this project strengthened my understanding of:

* Designing RESTful APIs
* Structuring maintainable backend applications
* Full-stack application architecture
* Authentication and authorization
* State management using TanStack Query
* Form handling and validation
* PostgreSQL database design
* Type-safe application development
* Writing maintainable and modular code
