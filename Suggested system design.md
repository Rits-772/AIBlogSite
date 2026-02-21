
# 🏗 SYSTEM DESIGN DOCUMENT

## Product: Midnight Typewriter

AI-Assisted Editorial Publishing Platform

---

# 1. System Overview

Midnight Typewriter is a full-stack web application enabling users to:

* Register & authenticate
* Create, edit, publish blog posts
* Generate AI-assisted content
* View editorial-style public feeds
* Switch between cohesive design themes

The system follows a modular, scalable REST architecture with clear separation between:

* Presentation Layer (React)
* Application Layer (Node/Express)
* Data Layer (MongoDB)
* AI Service Layer (External API abstraction)

---

# 2. High-Level Architecture

```
Client (React + Tailwind)
        ↓
API Gateway (Express.js)
        ↓
Business Logic Layer
        ↓
MongoDB Database
        ↓
External AI Provider
```

---

# 3. Frontend Architecture

## 3.1 Tech Stack

* React (SPA)
* Tailwind CSS
* Context API (or Redux if scaling)
* Axios (API calls)
* Motion library (page-level animations)

---

## 3.2 Folder Structure

```
src/
 ├── components/
 │    ├── layout/
 │    ├── typography/
 │    ├── ai/
 │    ├── post/
 │
 ├── pages/
 │    ├── Home.jsx
 │    ├── Login.jsx
 │    ├── Dashboard.jsx
 │    ├── PostEditor.jsx
 │    ├── PostDetail.jsx
 │
 ├── context/
 │    ├── AuthContext.jsx
 │    ├── ThemeContext.jsx
 │
 ├── services/
 │    ├── api.js
 │    ├── authService.js
 │    ├── postService.js
 │    ├── aiService.js
 │
 ├── hooks/
 ├── utils/
 ├── App.jsx
 └── main.jsx
```

---

## 3.3 State Management Strategy

* Auth state → Context API
* Theme state → Context API
* Editor draft state → local component state
* Global notifications → centralized state

If complexity increases → migrate to Redux Toolkit.

---

## 3.4 Theme System Architecture

* CSS variables defined in root
* Theme toggle updates document root class
* No hardcoded colors in components
* All colors reference variables

This ensures visual consistency and prevents drift.

---

# 4. Backend Architecture

## 4.1 Tech Stack

* Node.js
* Express.js
* Mongoose
* JWT
* Bcrypt
* Rate limiter middleware

---

## 4.2 Backend Folder Structure

```
server/
 ├── config/
 │    ├── db.js
 │    ├── env.js
 │
 ├── controllers/
 │    ├── authController.js
 │    ├── postController.js
 │    ├── aiController.js
 │
 ├── services/
 │    ├── aiService.js
 │
 ├── models/
 │    ├── User.js
 │    ├── Post.js
 │
 ├── middleware/
 │    ├── authMiddleware.js
 │    ├── errorHandler.js
 │    ├── rateLimiter.js
 │
 ├── routes/
 │    ├── authRoutes.js
 │    ├── postRoutes.js
 │    ├── aiRoutes.js
 │
 └── server.js
```

Separation of concerns is mandatory:
Controllers = HTTP logic
Services = Business logic
Models = Schema definitions

---

# 5. Database Design

## 5.1 User Schema

```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  aiUsageCount: Number,
  createdAt: Date
}
```

Indexes:

* email (unique)
* createdAt

---

## 5.2 Post Schema

```js
{
  _id: ObjectId,
  title: String,
  content: String,
  author: { type: ObjectId, ref: "User" },
  tags: [String],
  category: String,
  status: { type: String, enum: ["draft", "published"] },
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

Indexes:

* author
* status
* createdAt
* tags

---

# 6. API Design

## 6.1 Authentication

POST `/api/auth/register`
POST `/api/auth/login`
GET `/api/auth/me`

JWT in HTTP-only cookie preferred.

---

## 6.2 Posts

GET `/api/posts`
GET `/api/posts/:id`
POST `/api/posts`
PUT `/api/posts/:id`
DELETE `/api/posts/:id`

Pagination:
`/api/posts?page=1&limit=10`

---

## 6.3 AI Endpoint

POST `/api/ai/generate`

Body:

```
{
  topic,
  tone,
  wordCount
}
```

Backend:

* Validates input
* Checks user usage quota
* Calls AI provider
* Returns structured draft

Rate limit: e.g., 5 requests/minute per user.

---

# 7. AI Service Layer

The AI service must be abstracted.

Do NOT call AI directly in controller.

```
Controller → aiService → External API
```

Benefits:

* Swap AI providers easily
* Add logging
* Add moderation
* Add caching
* Add prompt tuning

---

# 8. Security Architecture

## 8.1 Authentication

* JWT
* Token expiration
* Refresh token strategy (optional Phase 2)

## 8.2 Input Validation

* Express-validator
* Sanitize content
* Prevent XSS

## 8.3 Rate Limiting

* AI endpoint strict limits
* Auth endpoint limits

## 8.4 Database Security

* No raw Mongo queries exposed
* Mongoose validation

---

# 9. Performance Strategy

* MongoDB indexing
* Pagination
* Lazy load posts
* Minimize re-renders in React
* Memoization where necessary
* Code splitting (React.lazy)

---

# 10. Scalability Strategy

Phase 1: Monolithic backend
Phase 2:

* Separate AI service into microservice
* Introduce caching (Redis)
* CDN for static assets
* Horizontal scaling via load balancer

---

# 11. Deployment Architecture

Frontend:

* Vercel / Netlify

Backend:

* Render / Railway / AWS EC2

Database:

* MongoDB Atlas

Environment variables:

* AI API key
* JWT secret
* DB connection string

---

# 12. Logging & Monitoring

* Request logging (Morgan)
* Error logging middleware
* AI usage logs
* Basic analytics tracking

Future:

* Centralized logging (Winston)
* Monitoring (Datadog / Sentry)

---

# 13. Failure Handling

If AI fails:

* Graceful error message
* Retry option
* No crash

If DB fails:

* Centralized error handler
* Fail-safe responses

If token expires:

* Redirect to login

---

# 14. Design System Enforcement Layer

Critical:

* Components must only consume theme variables
* No hardcoded colors
* No inline style overrides
* Typography classes centralized

This prevents aesthetic drift over time.

---

# 15. Future Enhancements

* Comment system
* Like/bookmark
* AI rewrite tools
* Post version history
* Scheduled publishing
* Admin moderation dashboard
* Full-text search indexing

---

# 16. System Principles

1. Separation of concerns
2. Modular services
3. Centralized theming
4. Abstracted AI integration
5. Performance-aware rendering
6. Editorial-first UI architecture

---

# Final Outcome

This system:

* Scales cleanly
* Keeps design consistent
* Prevents AI architectural drift
* Allows AI provider flexibility
* Supports future microservices evolution
