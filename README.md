# Task Manager

## Live Demo

Frontend: https://task-manager-gamma-five-66.vercel.app/  
API: https://task-manager-api-1216.onrender.com

Full-stack project and task management application built with **React, Express, Prisma, and PostgreSQL**.

This project is designed as a portfolio application demonstrating practical backend and frontend engineering practices: API design, relational database modeling, integration testing, modular React architecture, and iterative refactoring from an MVP into a more production-like structure. 

---

## Quick Summary

Task Manager is a full-stack CRUD application for managing projects and tasks.

It demonstrates:

- REST API design with Express
- relational database modeling with PostgreSQL and Prisma
- integration testing with Jest and Supertest
- modular React frontend with custom hooks

---

## 📚 Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Architecture](#architecture)
- [API Overview](#api-overview)
- [Data Model](#data-model)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Engineering Decisions](#engineering-decisions)
- [Local Development](#local-development)
- [Future Improvements](#future-improvements)
- [Status](#status)

---

# Overview

Task Manager allows users to create projects and manage tasks within those projects through a clean REST API and a minimal UI. The application is fully deployed and accessible online, demonstrating a realistic cloud deployment setup.

The project focuses on engineering practices rather than UI complexity.

### Key ideas demonstrated

- Full-stack CRUD application
- Relational database design
- Modular backend architecture
- Integration testing with a real database
- React state management with custom hooks

---

# 🚀 Features

## Current

- Create, list, update and delete projects
- Create tasks inside a project
- List all tasks for a selected project
- Update and delete tasks
- Cascade delete (removing a project deletes its tasks)
- Inline editing for projects and tasks
- Keyboard shortcuts for editing
- PostgreSQL database with Prisma ORM
- Integration tests using Jest and Supertest

## Planned

- End-to-end (E2E) tests
- CI pipeline
- Optional authentication / user accounts
- Optional support for unassigned tasks (`projectId = null`)

---

# 🧰 Tech Stack

## Frontend

- React
- Vite
- Custom Hooks
- Fetch API
- CSS

## Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- REST API

## Testing

- Jest
- Supertest
- Database-backed integration tests

---

# ☁️ Deployment

The application is deployed using a cloud-based architecture:

Frontend: **Vercel**  
Backend API: **Render Web Service**  
Database: **Render PostgreSQL**

Environment variables are used to configure the frontend API endpoint:

VITE_API_URL

Backend services communicate with the database using Render's internal network.

Database schema is managed with **Prisma migrations** and automatically applied during deployment.

---

# 🌐 System Architecture

Vercel (React Frontend)
        │
        ▼
Render Web Service (Express API)
        │
        ▼
Render PostgreSQL

---

# 🏗 Architecture

## Frontend

The frontend is organized by responsibility:

components/   → UI components  
hooks/        → stateful logic  
api/          → HTTP communication layer  

### Principles

- Separation of concerns
- API logic isolated from UI
- Custom hooks for projects and tasks
- Simple but scalable structure

## Backend

The backend uses Express route modules and Prisma for persistence.

### Main ideas

- REST-style API
- Dependency injection through `createApp(prisma)`
- Relational data modeled in PostgreSQL
- Database-level cascade deletion
- Integration tests against a dedicated test database

---

# 🔗 API Overview

## Projects

GET    /projects  
POST   /projects  
PATCH  /projects/:id  
DELETE /projects/:id  

## Project Tasks

GET  /projects/:projectId/tasks  
POST /projects/:projectId/tasks  

## Tasks

PATCH  /tasks/:id  
DELETE /tasks/:id  

---

# 🗄 Data Model

## Project

id  
name  

## Task

id  
title  
projectId  

`projectId` is currently nullable to allow future support for unassigned tasks.

---

# 🧪 Testing

The backend uses integration tests to validate real application behavior.
Tests run against a dedicated PostgreSQL test database and reset tables between runs to keep results deterministic.
Tests are executed sequentially (`jest --runInBand`) to avoid database race conditions.

### Tests verify

- project CRUD operations
- task updates and deletion
- nested project-task routes
- cascade deletion behavior

Tests run against a dedicated test database and reset tables between runs to keep results deterministic.

---

# 📦 Project Structure

apps/  
&nbsp;&nbsp;api/  
&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;routes/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;prisma.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;app.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index.js  
&nbsp;&nbsp;&nbsp;&nbsp;prisma/  
&nbsp;&nbsp;&nbsp;&nbsp;test/  

&nbsp;&nbsp;web/  
&nbsp;&nbsp;&nbsp;&nbsp;src/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;components/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hooks/  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api/  

---

# 🧠 Development Notes

This project started as a small CRUD MVP and was gradually refactored to introduce a more modular architecture.

The backend originally used an in-memory store and was later migrated to PostgreSQL with Prisma to make the API closer to real production setups.

---

# ⚙️ Engineering Decisions

## Dependency Injection

The Express app is created with:

createApp(prisma)

This allows:

- easier testing
- separate test database
- clear separation between infrastructure and application logic

## Database-backed integration tests

Instead of mocking the database, tests run against a real PostgreSQL test database.

### Benefits

- Prisma queries are tested in real conditions
- cascade rules are validated
- API behavior matches production

## Nested project-task routes

Tasks are created through:

POST /projects/:projectId/tasks

This makes ownership explicit and simplifies validation logic.

## Cascade deletion

The Prisma schema uses:

onDelete: Cascade

When a project is deleted, its tasks are automatically removed by the database.

---

# 🔧 Local Development

## Backend

cd apps/api  
npm install  
npm run dev  

## Frontend

cd apps/web  
npm install  
npm run dev  

## Run tests

cd apps/api  
npm test  

---

# 📈 Future Improvements

Planned improvements:

- CI workflow
- E2E tests
- screenshots / demo GIF
- authentication
- task filtering and sorting

---

# Status

This project is actively being polished and improved.
