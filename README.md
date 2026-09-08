# 🚀 PlaceMentor AI — AI-Powered Placement Preparation Operating System

<div align="center">

![PlaceMentor AI Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Motor%20Async-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**An intelligent, all-in-one placement readiness platform empowering students to transition from campus to Tier-1 job offers through AI-powered speech analysis, gamified learning, live coding, ATS resume building, and placement simulations.**

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [API Reference](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🌟 Key Features

### 🎙️ 1. Communication & Speaking Practice (AI-Powered)
* **Real-time Voice Analysis**: Records microphone audio directly in browser (WebM/Opus) and streams to Google Gemini multimodal models for instantaneous speech analysis.
* **Deep Speech Metrics**: Generates actionable metrics across Fluency, Clarity, Vocabulary, Pacing (WPM), Filler Word Detection, and Sentiment Analysis.
* **Transcription & Key Insights**: Provides automated verbatim transcription with highlighted key takeaways, strengths, and areas for improvement.
* **Multiplayer Group Discussion (GD) Rooms**: Real-time multi-user placement GD simulation powered by WebSockets with turn-taking and automated AI moderation/scoring.
* **Recruiter Outreach Generator**: Generates customized cold emails, LinkedIn connection notes, and follow-ups tailored to target companies and job roles.

### 📄 2. Smart ATS Resume Studio
* **Multi-Format ATS Templates**: Choose from curated ATS-optimized designs (Classic, Modern, Minimal, Tech).
* **Automated Resume Parsing**: Upload existing PDF or DOCX resumes; auto-extracts skills, work experience, projects, education, and links.
* **Live Score & Keyword Analyzer**: Real-time ATS compatibility scoring, missing keyword recommendations, and formatting audit.
* **One-Click Export**: Export pixel-perfect PDF and DOCX formats ready for recruiters and job portals.

### 🧠 3. BrainZone & Gamified Skill Trees
* **Interactive Skill Worlds**: RPG-style learning path across Foundations, Core CS, Advanced Systems, and System Design.
* **Progression Engine**: Earn XP, level up, unlock badges, collect coins, and maintain daily learning streaks.
* **Dynamic Content Unlocks**: Progressive milestone unlocks ensuring foundational concepts are mastered before advanced levels.

### 💻 4. Coding Practice & Multi-Language Editor
* **Rich Code Editor**: In-browser CodeMirror editor supporting Python, Java, C++, JavaScript, and SQL.
* **Curated Problem Bank**: Company-tagged algorithmic challenges ranging from Easy to Hard with detailed problem statements and edge cases.
* **Test Case Execution**: Instant feedback with automated test cases, execution runtime, memory benchmarks, and submission history.

### 🎯 5. Aptitude & Company Assessments (Quizee)
* **Comprehensive Aptitude Tracks**: Quantitative Ability, Logical Reasoning, Verbal Ability, and Data Interpretation modules.
* **Company-Specific Mock Tests**: Timed assessments mirroring real recruitment test patterns (TCS, Infosys, Amazon, Google, Microsoft).
* **Detailed Analytics**: Breakdown by topic accuracy, speed, percentile ranking, and in-depth step-by-step solutions.

### 📈 6. Placement Readiness Index & Roadmap
* **Unified Readiness Score**: Composite score computed from resume score, coding problem velocity, mock assessments, and speech fluency.
* **Personalized AI Roadmap**: Dynamic day-by-day action plan highlighting weak areas and guiding next steps to interview readiness.

### 🤖 7. 24/7 AI Placement Mentor
* **Conversational AI Coaching**: Context-aware placement tutor powered by Gemini for instant doubt clarification, mock interview drills, and strategic career advice.

### 🔐 8. Modern Authentication & Security
* **Google One-Click Sign-In / Sign-Up**: Google Identity Services (GIS) with secure backend OAuth2 token verification.
* **JWT & Bcrypt Security**: Fast, stateless JWT bearer token authentication with salted Bcrypt password hashing.

---

## 🛠️ Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 5](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + CSS Variables (Dark/Light Modes) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Code Editor** | [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/) |
| **Charts & Data** | [Recharts](https://recharts.org/), [Zustand](https://github.com/pmndrs/zustand) |

### Backend
| Layer | Technology |
|---|---|
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+) |
| **Server** | [Uvicorn](https://www.uvicorn.org/) (ASGI) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Motor](https://motor.readthedocs.io/) (Async I/O) |
| **Validation** | [Pydantic v2](https://docs.pydantic.dev/) |
| **Auth & Security** | [Google Auth](https://google-auth.readthedocs.io/), [Python-JOSE](https://github.com/mpdavis/python-jose), [Passlib/Bcrypt](https://passlib.readthedocs.io/) |
| **Document Processing** | [PyPDF](https://pypdf.readthedocs.io/), [python-docx](https://python-docx.readthedocs.io/) |
| **AI Integration** | [Google Gemini Multimodal API](https://ai.google.dev/) |

---

## 📂 Project Structure

```plaintext
PlaceMentor-AI/
├── backend/
│   ├── app/
│   │   ├── api/                    # REST API & WebSocket route handlers
│   │   │   ├── assessments.py      # Mock tests and quiz endpoints
│   │   │   ├── auth.py             # Login, Register, Google OAuth, Profile
│   │   │   ├── brainzone.py        # Gamified learning & XP tracking
│   │   │   ├── communication.py    # Speech analysis & GD WebSockets
│   │   │   ├── mentors.py          # AI Mentor conversations
│   │   │   ├── onboarding.py       # User onboarding flow
│   │   │   ├── problems.py         # Coding challenges & test runners
│   │   │   ├── readiness.py        # Placement readiness index & roadmap
│   │   │   ├── recommendations.py  # Personalized study recommendations
│   │   │   ├── resumes.py          # Resume builder, parser & ATS scorer
│   │   │   └── users.py            # User management & settings
│   │   ├── core/                   # Security, JWT, configuration
│   │   ├── database/               # MongoDB async client connection
│   │   ├── models/                 # MongoDB database schemas
│   │   ├── schemas/                # Pydantic request/response schemas
│   │   ├── services/               # Business logic & external AI services
│   │   └── main.py                 # FastAPI application entry point
│   ├── requirements.txt            # Python dependencies
│   └── .env.example                # Backend environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components & modals
│   │   │   ├── auth/               # Google Sign-In button & auth widgets
│   │   │   ├── doodles/            # Creative vector illustrations
│   │   │   ├── layout/             # Sidebar, Navbar, Page wrappers
│   │   │   └── ui/                 # Buttons, inputs, dialogs, cards
│   │   ├── context/                # AuthContext, ThemeContext providers
│   │   ├── pages/                  # Application views (Resume, Practice, GD, etc.)
│   │   ├── config.ts               # Frontend API and token storage config
│   │   ├── main.tsx                # React root mount
│   │   └── index.css               # Global styles & design system tokens
│   ├── index.html                  # HTML template with Google GIS script
│   ├── package.json                # Frontend dependencies & scripts
│   └── vite.config.ts              # Vite configuration & proxy settings
│
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
* **Python**: v3.10 or higher ([Download Python](https://www.python.org/))
* **MongoDB**: Local instance running on port 27017 or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URL.
* **Google Gemini API Key**: Free tier available from [Google AI Studio](https://aistudio.google.com/).
* **Google OAuth Client ID**: (Optional for Google Sign-In) from [Google Cloud Console](https://console.cloud.google.com/).

---

### 1. Clone the Repository
```bash
git clone https://github.com/Harini-13-04/PlaceMentor-AI.git
cd PlaceMentor-AI
```

---

### 2. Backend Setup

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file inside the `backend/` folder:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration:
   ```env
   MONGO_URL="mongodb://localhost:27017"
   DB_NAME="placementor"
   CORS_ORIGINS="*"
   SECRET_KEY="your_jwt_secret_key_here"
   ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=1440

   # Google Gemini API Key
   GEMINI_API_KEY="your_gemini_api_key_here"

   # Google OAuth Client ID for Google Sign-In
   GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
   ```

5. **Start the FastAPI Backend Server**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```
   The backend API will be available at: `http://127.0.0.1:8000`
   Interactive Swagger docs at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Node.js packages**:
   ```bash
   npm install
   ```

3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The web application will launch at: `http://localhost:5173` (or `http://localhost:5174`)

---

## 🔑 Environment Variables Reference

| Variable | Description | Default / Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` or Atlas URL |
| `DB_NAME` | Database name | `placementor` |
| `SECRET_KEY` | Secret key for signing JWT tokens | `generate_with_openssl_rand_hex_32` |
| `ALGORITHM` | JWT signing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Expiry time for access tokens | `1440` (24 hours) |
| `GEMINI_API_KEY` | API Key for Google Gemini Models | `AQ.Ab8RN6...` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Web Client ID for Google Sign-In | `xxxx.apps.googleusercontent.com` |

---

## 📡 Key API Endpoints

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new student with email/password.
* `POST /api/auth/login` — Login with credentials and receive JWT bearer token.
* `POST /api/auth/google` — Authenticate or sign up instantly using Google ID token.
* `GET /api/auth/me` — Retrieve currently logged-in user profile.
* `POST /api/auth/change-password` — Update user password.

### 🎙️ Communication & Speaking (`/api/communication`)
* `POST /api/communication/analyze-speech` — Analyze recorded audio with Gemini AI for fluency, clarity, WPM, and feedback.
* `POST /api/communication/recruiter-outreach` — Generate tailored recruiter messages and cold outreach.
* `GET /api/communication/history` — Fetch past speech practice recordings and ratings.
* `POST /api/communication/gd/rooms` — Create or join a Group Discussion room.
* `WS /api/communication/gd/ws/{room_code}` — Real-time WebSocket connection for GD participants.

### 📄 Resume Studio (`/api/resumes`)
* `POST /api/resumes/parse` — Parse uploaded PDF / DOCX resumes and extract structured fields.
* `POST /api/resumes/score` — Compute ATS compatibility score, strengths, and missing keywords.
* `GET /api/resumes/my-resumes` — List saved resumes for current user.
* `POST /api/resumes/save` — Save or update resume draft.

### 💻 Practice & Coding (`/api/problems`)
* `GET /api/problems` — List all coding challenges filtered by difficulty and tags.
* `GET /api/problems/{slug}` — Retrieve problem description, constraints, and boilerplates.
* `POST /api/problems/{slug}/submit` — Execute code against test cases and store submission.

### 📊 Readiness & Roadmap (`/api/readiness`)
* `GET /api/readiness` — Calculate overall placement readiness index and metric breakdown.
* `GET /api/readiness/roadmap` — Fetch personalized step-by-step career milestone roadmap.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Made with ❤️ for students aspiring for Tier-1 placements.
</div>
