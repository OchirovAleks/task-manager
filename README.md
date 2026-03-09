Task Manager

A full-stack task and project management application built with React, Express, Prisma, and PostgreSQL.

Overview

Task Manager is a portfolio full-stack application that lets users create projects, manage tasks inside projects, and update data through a clean REST API. The project was built to demonstrate practical backend and frontend engineering fundamentals: API design, database relations, integration testing, modular React architecture, and a realistic development workflow.

Features

Current

Create, list, update, and delete projects

Create tasks inside a project

List all tasks for a selected project

Update and delete tasks

Cascade delete: deleting a project removes its related tasks

Inline editing for projects and tasks

Keyboard support for editing flows

Minimal, clean UI for managing projects and tasks

PostgreSQL database with Prisma ORM

Integration tests with Supertest, Jest, and a dedicated test database

Planned / polishing

Deployment

CI pipeline

End‑to‑end (E2E) tests for the full user flow

Optional authentication and user accounts

Expanded README with screenshots and architecture notes

Optional support for unassigned tasks (projectId = null)

Tech Stack

Frontend

React

Vite

Custom hooks

Fetch API

CSS

Backend

Node.js

Express

Prisma ORM

PostgreSQL

Testing

Jest

Supertest

Database-backed integration tests

Architecture

Frontend

The frontend is organized by responsibility:

components/ — UI components

hooks/ — stateful logic and handlers

api/ — network layer for HTTP requests

Main ideas:

separation of concerns

API layer isolated from UI

custom hooks for projects and tasks

optimistic UI updates where appropriate

Backend

The backend uses Express route modules and Prisma for persistence.

Main ideas:

REST-style API

dependency injection via createApp(prisma)

project-task relation modeled in PostgreSQL

cascade deletion at the database level

integration tests against a dedicated test database

API Overview

Projects

GET /projects

POST /projects

PATCH /projects/:id

DELETE /projects/:id

Project Tasks

GET /projects/:projectId/tasks

POST /projects/:projectId/tasks

Tasks

PATCH /tasks/:id

DELETE /tasks/:id

Data Model

Project

id

name

Task

id

title

projectId

Note: projectId is currently nullable in the schema to allow future support for unassigned tasks.

Why this project

This project was built as a practical portfolio application to demonstrate:

full-stack CRUD development

relational database design

testable backend architecture

React state management with custom hooks

iterative refactoring from MVP code into a more modular structure

Testing

The backend is tested with integration tests that exercise:

project CRUD

task update and deletion

nested project-task routes

cascade behavior when deleting a project

Tests use:

dedicated test database

database reset between tests

serial execution for stability

Local Development

Prerequisites

Node.js

npm

PostgreSQL database

Install dependencies

From the repository root, install dependencies for the frontend and backend as needed.

Backend environment

Create an .env file inside apps/api with your development database connection.

Test environment

Create an .env.test file inside apps/api with your test database connection.

Run backend

From apps/api:

npm run dev

Run frontend

From the web app directory:

npm run dev

Run tests

From apps/api:

npm test

Project Structure

apps/
  api/
    src/
      routes/
      prisma.js
      app.js
      index.js
    prisma/
    test/
  web/
    src/
      components/
      hooks/
      api/

Demo

Screenshot will be added during polishing phase.

Development Notes

This project started as a small CRUD MVP and was gradually refactored to introduce a more modular architecture.

The backend originally used an in-memory store, but was later migrated to PostgreSQL with Prisma to make the API closer to production setups.

Engineering Decisions

Several design choices in this project were made to keep the codebase simple but realistic for production-style development.

Dependency Injection

The Express application is created using createApp(prisma). This allows the database client to be injected instead of imported globally. The main benefits are:

easier testing

ability to use a separate test database

clearer separation between infrastructure and application logic

Database-backed integration tests

Instead of mocking the database, tests run against a dedicated PostgreSQL test database. This ensures that:

Prisma queries are tested in real conditions

database constraints and cascade rules are validated

API behaviour matches production behaviour

Tables are truncated between tests to keep test runs deterministic.

Nested project–task routes

Tasks are created through /projects/:projectId/tasks. This makes ownership explicit and simplifies validation logic because a task always belongs to a project at creation time.

Cascade deletion

The relation between Project and Task uses onDelete: Cascade in the Prisma schema. When a project is removed, its tasks are automatically removed by the database. This avoids manual cleanup logic in the API.

Future extensibility

The schema currently allows Task.projectId to be nullable. This is intentional so the project can later support features like:

unassigned tasks

task inbox

cross‑project task organization

Engineering Notes

Dependency injection

The Express app receives Prisma through createApp(prisma), which makes the app easier to test and keeps infrastructure concerns out of route definitions.

Database-backed tests

Tests run against a dedicated test database and reset tables between test cases. This keeps integration tests deterministic and close to real runtime behavior.

Future design decision

The schema currently allows Task.projectId = null as preparation for a future “unassigned tasks” feature. The current UI flow creates tasks inside projects only.

What I would improve next

Deploy frontend and backend

Add CI workflow

Add screenshots / demo GIF

Add stronger error handling and loading states

Add support for unassigned tasks

Expand filtering / sorting / task metadata

Status

This project is actively being polished and improved.