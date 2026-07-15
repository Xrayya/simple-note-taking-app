# Minimalist Note-Taking Application

A modern, full-stack, type-safe note-taking application engineered for speed, clean architecture, and seamless user experience. This project serves as a production-grade portfolio piece demonstrating modern TypeScript practices, automated input validation, strict structural encapsulation, and a decoupled client-server architecture.

> **Status:** 🚀 In Active Development

## Technical Architecture & Stack

### Backend

* **Runtime:** Bun (Native performance, built-in bundling & test runner)
* **Database Layer:** Drizzle ORM (Type-safe SQL queries)
* **Architecture:** Layered architectural pattern (Routes $\rightarrow$ Middlewares $\rightarrow$ Services $\rightarrow$ Database)
* **Validation:** Robust runtime schemas ensuring absolute type safety from incoming JSON down to the database layer
* **Testing:** Comprehensive suite featuring isolated business logic units (`notes.service.test.ts`) and API layer validation (`notes.integration.test.ts`)

### Frontend

* **Framework & Build:** React + Vite + TypeScript
* **Routing:** TanStack Router (Fully type-safe structural routing, route guards, and automatic code generation)
* **UI Architecture:** Atomic Design leveraging shadcn/ui components (`avatar`, `sheet`, `sidebar`, `drawer`) styled via Tailwind CSS
* **State & Optimization:** Custom React hooks (`use-notes`, `use-debounce`) managing decoupled UI state and minimizing unnecessary re-renders

## Directory Structure

```text
├── backend/
│   ├── src/
│   │   ├── db/                 # Schema definitions and database clients (Drizzle)
│   │   ├── exceptions/         # Encapsulated custom domain error classes
│   │   ├── middlewares/        # Express-style validation and security layers
│   │   ├── routes/             # Clean REST API endpoints mapping to services
│   │   ├── services/           # Decoupled core business and data logic
│   │   └── validation-schemas/ # Runtime data validation objects
│   └── test/                   # Integration and service layer test suites
└── frontend/
    ├── src/
    │   ├── components/         # Atomic UI units and global layouts (shadcn/ui)
    │   ├── contexts/           # Global application states (Theme, Auth states)
    │   ├── hooks/              # Isolated state abstractions (Debouncing, APIs)
    │   ├── routes/             # File-based structural layout (TanStack Router)
    │   └── schema-validation/  # Frontend form and input confirmation

```

## Key Portfolio Highlights

### 1. Unified Domain Architecture

The backend completely avoids monolithic handler files. Business logic resides strictly in `services/`, input formats are intercepted early by dynamic `middlewares/`, and edge cases trigger structured errors inside `exceptions/`.

### 2. Scalable Directory Design

The separation of concerns between `backend/` and `frontend/` simplifies independent deployment pipelines (e.g., Vercel edge deployment ready via `vercel.json`).

### 3. Modern Type-Safe Tooling

Leverages cutting-edge tools including TanStack Router on the frontend to eliminate invalid navigation states, and Drizzle ORM to maintain true single-source-of-truth TypeScript definitions straight to the database records.

## Local Installation & Setup

### Prerequisites

This project is developed using [Bun](https://bun.sh/) as runtime and dependency manager.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install dependencies:
```bash
bun install

```


3. Initialize your environment file using the provided boilerplate:
```bash
cp env-example .env

```


4. Run database migrations and start the development server:
```bash
bun run dev

```



### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend

```


2. Install dependencies:
```bash
bun install

```


3. Run the client dev server:
```bash
bun run dev

```



---

## ## Current Roadmap

* [ ] Complete user authentication flow and multi-tenant route guards (`_notes-guard.tsx`).
* [ ] Add categorization tags and folder grouping architectures to `app-sidebar.tsx`.
