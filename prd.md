
# 📘 Product Requirements Document (PRD)

We’re building a **design-forward publishing experience with a strong editorial identity** — where AI is a tool, not the aesthetic.

## Product Name

**Midnight Typewriter**
(AI-Assisted Editorial Publishing Platform)

---

# 1. Product Vision

To create a modern blog platform that rejects generic SaaS aesthetics and instead delivers a distinctive, immersive, editorial publishing experience — enhanced by AI but grounded in typography, atmosphere, and intentional design.

The product must feel crafted, not generated.

---

# 2. Core Philosophy

1. Typography-first interface
2. Strong visual identity with cohesive themes
3. Cinematic motion over scattered micro-interactions
4. Atmosphere-driven backgrounds
5. AI as an enhancement, not the centerpiece
6. Zero “AI slop” design patterns

---

# 3. Objectives

### Primary Objectives

* Deliver a memorable visual identity
* Provide seamless AI-assisted content generation
* Enable powerful but simple blog management
* Create emotional engagement through design

### Success Metrics

* AI feature adoption rate
* Average time spent per session
* Draft-to-publish conversion rate
* Returning users
* User-reported design satisfaction

---

# 4. Target Audience

* Writers and essayists
* Students and thinkers
* Developers who care about aesthetics
* Creators who value editorial presence
* Design-conscious users

---

# 5. Product Scope

## 5.1 Core Features

### A. Authentication

* Email + password registration
* JWT-based login
* Secure token storage
* Profile management

---

### B. Editorial Blog Management

#### Create Post

* Title (large typography emphasis)
* Rich text editor
* Tags & category
* Draft / Publish toggle
* AI-assisted writing option

#### Edit Post

* Inline editing
* Version timestamp tracking
* Draft autosave (future phase)

#### Delete Post

* Soft delete

#### Public Feed

* Editorial-style layout
* No generic card grid
* Strong typographic hierarchy

---

### C. AI Post Generator

#### Functional Flow

1. User enters topic
2. Selects:

   * Tone
   * Word count
3. AI generates structured draft
4. User edits before publishing

#### Requirements

* Prompt-engineered backend
* Loading animation (cinematic, staged)
* Rate limiting
* Error handling
* Usage tracking

#### Future Enhancements

* Rewrite mode
* Expand paragraph
* SEO refinement
* Tone shifting
* Outline-first drafting

---

# 6. Design Requirements (Critical Section)

## 6.1 Typography Requirements

* Distinct serif headline font
* Complementary serif body font
* Monospaced font for AI interface
* Large heading scale (5xl–8xl)
* Strong contrast in font weights
* No default SaaS fonts

Typography must carry the brand identity.

---

## 6.2 Color System

Two primary themes:

### Theme 1: Obsidian Ink (Dark)

* Deep charcoal base
* Electric saffron accent
* Oxidized teal secondary
* Warm ivory text
* High contrast ratios

### Theme 2: Paper & Ink (Light)

* Warm paper background
* Ink-black typography
* Muted red accent
* Soft editorial feel

### Implementation Rules

* Use CSS variables for theme consistency
* 70/20/10 dominance ratio
* Accent used intentionally, not everywhere

---

## 6.3 Motion Design

### Philosophy

One orchestrated moment > 50 small animations

### Requirements

* Page load staggered reveal
* Smooth hover transitions
* Accent glow for AI activation
* CSS-first animation approach
* React Motion library for advanced sequences

No excessive bouncing or flashy UI noise.

---

## 6.4 Background System

* Layered radial gradients
* Subtle texture overlays
* No flat gray backgrounds
* Background must reinforce theme identity

---

## 6.5 Layout Principles

Avoid:

* 3-column SaaS grids
* Symmetrical dashboard layouts
* Over-rounded cards
* Shadow-heavy components

Use:

* Asymmetry
* Strong vertical rhythm
* Generous whitespace
* Border-based emphasis instead of shadows

---

# 7. Technical Architecture

## 7.1 Frontend

* React (SPA)
* Tailwind CSS
* Motion library
* Context API / Redux
* Theme system via CSS variables

## 7.2 Backend

* Node.js
* Express.js
* REST API
* JWT authentication
* Rate limiting middleware

## 7.3 Database

* MongoDB
* Mongoose schemas
* Indexed post queries

## 7.4 AI Integration

* External AI API
* Structured prompt system
* AI service abstraction layer

---

# 8. Database Schema (High-Level)

### User

```
{
  _id,
  name,
  email,
  password,
  avatar,
  role,
  aiUsageCount,
  createdAt
}
```

---

### Post

```
{
  _id,
  title,
  content,
  author,
  tags,
  category,
  status,
  views,
  createdAt,
  updatedAt
}
```

---

# 9. API Endpoints

## Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/me

## Posts

* GET /api/posts
* GET /api/posts/:id
* POST /api/posts
* PUT /api/posts/:id
* DELETE /api/posts/:id

## AI

* POST /api/ai/generate

---

# 10. Non-Functional Requirements

### Performance

* First paint < 2 seconds
* Optimized font loading
* Lazy loading for posts

### Security

* Bcrypt password hashing
* JWT validation middleware
* Input sanitization
* Rate limiting AI endpoint

### Accessibility

* Minimum WCAG AA contrast
* Keyboard navigation
* Focus-visible states

---

# 11. Risks & Mitigation

| Risk                                 | Mitigation                         |
| ------------------------------------ | ---------------------------------- |
| Design becomes inconsistent          | Strict design system documentation |
| AI misuse                            | Rate limiting + moderation         |
| Performance issues due to animations | GPU-accelerated transforms only    |
| Theme complexity                     | Centralized CSS variable system    |

---
# 12. Roadmap

### Phase 1

* Auth
* CRUD blog system
* AI integration
* Dark theme

### Phase 2

* Light theme
* Comment system
* Like/bookmark
* Post analytics

### Phase 3

* AI rewrite tools
* Scheduled publishing
* Subscription model
* Editorial curation system

---

# 13. Product Differentiator

Unlike generic blog platforms, Midnight Typewriter:

* Feels like a literary publication, not a startup tool
* Uses bold typography as its primary identity
* Employs cinematic motion intentionally
* Integrates AI without visually centering it
* Rejects cookie-cutter UI patterns

