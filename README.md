# LearnReach AI – Personalized Learning for Every Student

> **UN Sustainable Development Goal 4: Quality Education**  
> *"Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."*

---

## 1. Project Overview

Students in rural and remote regions often face systemic educational barriers:
- High student-to-teacher ratios in multi-grade classrooms.
- Language mismatch between regional mother tongues (Hindi, Odia, Bengali) and standardized English STEM textbooks.
- Lack of personalized feedback and targeted practice tailored to individual learning comprehension.

**LearnReach AI** is a full-stack educational technology platform engineered to bridge this divide. It provides:
1. **AI Personal Tutor:** An encouraging pedagogical agent that breaks complex science, math, and environmental topics into step-by-step logic with rural everyday analogies.
2. **Regional Language Learning:** Native translation tools for Hindi, Odia, Bengali, and English with academic glossaries and concept simplification.
3. **Smart Practice Quizzes:** Performance-driven assessment generation where tests target each student's historically missed concepts. Quiz scores are validated server-side, driving an adaptive learning progression.
4. **Educator Oversight:** A dedicated teacher dashboard enabling rural educators to monitor student rosters, identify class-wide learning gaps, and assign revision guidance.

---

## 2. Technology Architecture

### Frontend
- **Framework:** React 19 with Vite & TypeScript
- **Styling:** Tailwind CSS (warm off-white canvas, deep navy typography, emerald and teal accents)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Data Visualization:** Recharts for quiz trajectories and subject completion analytics
- **Asset Generation:** High-fidelity generated educational visual assets

### Backend
- **Runtime:** Node.js with Express & TypeScript (`tsx`)
- **API Architecture:** RESTful endpoints with consistent JSON envelopes
- **Authentication:** JWT tokens (`jsonwebtoken`) with `bcryptjs` password hashing
- **Security:** Request rate limiting, input sanitization with Zod, role-based authorization guards (Student, Teacher, Admin), and server-side score calculation

### Database
- **Prisma Schema:** `prisma/schema.prisma` with relational models (`User`, `StudentProfile`, `Subject`, `Topic`, `Lesson`, `Quiz`, `Question`, `QuizAttempt`, `QuizAnswer`, `LearningProgress`, `TeacherStudentAssignment`, `TranslationHistory`).
- **Persistence Engine:** JSON-backed disk database (`data/app_db.json`) initialized via realistic seed script (`prisma/seed.ts`), enabling instant persistence and seamless standalone execution.

### AI Integration
- **SDK:** Modern `@google/genai` TypeScript SDK
- **Model:** `gemini-3.8-flash`
- **Telemetry:** User-Agent header `'aistudio-build'`
- **Pedagogical Guardrails:** Prompt engineering instructing the tutor to guide students with step-by-step reasoning and everyday analogies rather than giving away direct answers.
- **Resilience:** Graceful sample fallbacks when offline or when API quota is exhausted.

---

## 3. Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Windows / macOS / Linux Step-by-Step

1. **Clone the repository:**
   ```bash
   git clone https://github.com/example/learnreach-ai.git
   cd learnreach-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```

   In `.env`:
   ```env
   # Google Gemini API key for AI tutoring and quiz generation
   GEMINI_API_KEY="your-gemini-api-key-here"

   # Secret key for signing JWT tokens
   JWT_SECRET="your-secure-random-secret"

   # Port configuration (default 3000)
   PORT=3000

   # Optional PostgreSQL connection string for Prisma
   DATABASE_URL="postgresql://postgres:password@localhost:5432/learnreach_db?schema=public"
   ```

4. **Run the Full-Stack Application:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 4. Default Seed & Demo Accounts

For zero-friction evaluation, pre-seeded accounts with realistic progress are available:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `priya@rurallearn.org` | `Password123!` | Class 8, Hindi/Odia medium, Sundargarh Cluster |
| **Student** | `rohit@rurallearn.org` | `Password123!` | Class 9, Bengali medium, Bankura Rural Hub |
| **Teacher** | `teacher@rurallearn.org` | `Password123!` | Head Teacher Anita Patra |
| **Admin** | `admin@rurallearn.org` | `Password123!` | System Administrator Vikram |

*You can also click the quick-login demo buttons on the Sign In page for instant testing.*

---

## 5. REST API Documentation

### Authentication
- `POST /api/auth/register` - Create student or teacher account
- `POST /api/auth/login` - Authenticate with email and password
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Fetch authenticated user profile

### Curriculum & Lessons
- `GET /api/subjects` - List curriculum subjects (Math, Science, EVS, English)
- `GET /api/subjects/:id/topics` - List topics under subject
- `GET /api/topics/:id/lesson` - Retrieve topic lesson with key points and rural analogies

### AI Tutor & Multilingual Tools
- `POST /api/ai/chat` - Interactive tutoring with step-by-step breakdown & rural metaphors
- `GET /api/ai/history` - Retrieve student chat sessions
- `POST /api/ai/translate` - Academic translation for Hindi, Odia, Bengali, English
- `POST /api/ai/simplify` - Simplify textbook passages into plain language

### Quizzes & Adaptive Assessment
- `POST /api/quizzes/generate` - Generate multiple-choice quiz targeting student weak topics
- `GET /api/quizzes` - List available quizzes
- `GET /api/quizzes/:id` - Fetch quiz questions (sanitized without answers)
- `POST /api/quizzes/:id/submit` - Server evaluates score and returns personalized feedback
- `GET /api/quizzes/attempts/my` - Student attempt history

### Teacher & Admin
- `GET /api/teacher/students` - Student roster with progress and weak topics
- `GET /api/teacher/class-summary` - Aggregated class metrics & common weak concepts
- `POST /api/teacher/recommend` - Assign study guidance note to student
- `GET /api/admin/overview` - Platform usage statistics
- `PATCH /api/admin/users/:id/role` - Toggle user role (Student, Teacher, Admin)

---

## 6. Adaptive Learning Rules

LearnReach AI uses a transparent, pedagogical rule-based adaptive feedback loop:
- **Score < 50%:** Foundational revision required. Recommends reviewing the introductory lesson and asking the AI Tutor for simpler analogies.
- **Score 50% – 79%:** Targeted practice. Pinpoints specific incorrect concepts to focus on.
- **Score ≥ 80%:** Module mastery. Recommends advancing to the next curriculum module or trying an advanced difficulty challenge.

---

## 7. Security and Integrity Standards

- **Server-Side AI SDK:** `@google/genai` is invoked exclusively on the Express backend. The `GEMINI_API_KEY` is never bundled into client scripts.
- **Server-Authoritative Evaluation:** Quiz answers and scores are evaluated strictly on the server; clients cannot submit arbitrary scores.
- **Rate Limiting:** Protects authentication and AI generation endpoints from abuse.
- **Input Validation:** Zod schemas validate registration and submission payloads.
- **Zero-Pill Typography:** Follows modern accessible web design principles without visual clutter or fake indicators.
