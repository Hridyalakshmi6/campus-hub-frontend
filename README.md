<div align="center">

# 🎓 CampusFlow

### AI-Powered Academic Management Platform for Engineering Students

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

*Manage attendance, deadlines, placements, study groups, and campus notices — all powered by Google Gemini AI.*

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | Unified overview of tasks, deadlines, attendance risk, and placement activity |
| ✅ **Task Manager** | Create, prioritize, and track assignments with WhatsApp & Calendar reminders |
| ⏰ **Deadline Manager** | Track submission deadlines with AI-generated phased study plans |
| 📅 **Attendance Tracker** | Per-subject attendance monitoring with 75% threshold risk alerts (SAFE / WARNING / CRITICAL) |
| 📢 **Notice Center** | Paste raw college bulletin text → AI summarizes, extracts events, and generates WhatsApp broadcast |
| 💼 **Placement Tracker** | Track job applications by stage; generate AI DSA prep kits and mock interview questions |
| 👥 **Study Groups** | Create and join slot-limited peer study sessions |
| 🤖 **AI Study Buddy** | Generate flashcards and MCQ quizzes from your study notes using Gemini |
| 📆 **Calendar View** | Unified agenda calendar for tasks, deadlines, and study sessions |
| ⚡ **Automations** | Monitor n8n webhook integrations for WhatsApp and Google Calendar automation |

---

## 🛠 Tech Stack

**Frontend**
- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 6](https://vitejs.dev) (dev server + build)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [Recharts](https://recharts.org) (data visualization)
- [Lucide React](https://lucide.dev) (icons)
- [Motion](https://motion.dev) (animations)

**Backend (same repo)**
- [Express.js](https://expressjs.com) + [TypeScript](https://www.typescriptlang.org)
- [Google Gemini 2.5 Flash](https://ai.google.dev) (AI features)
- In-memory data store (mock backend — replace with PostgreSQL + Prisma for production)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Hridyalakshmi6/campus-hub-frontend.git
cd campus-hub-frontend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_api_key_here

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Required — get your key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Optional — URL where the app is hosted (used for OAuth callbacks)
APP_URL=http://localhost:3000
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build the production frontend + server bundle |
| `npm start` | Run the production build |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove the dist/ build directory |

---

## 🤖 AI Features (Powered by Gemini 2.5 Flash)

All AI features gracefully fall back to structured mock data if the API key is unavailable:

- **Flashcard Generator** — Extracts key concepts from your notes into Q&A cards
- **Quiz Generator** — Generates multiple-choice questions for self-evaluation
- **Notice Summarizer** — Parses raw bulletin text into bullet summaries + calendar events + WhatsApp message
- **Study Plan Generator** — Creates a phased day-by-day study timeline for a deadline
- **Placement Prep Kit** — Returns recommended DSA topics + mock interview questions tailored to a company and role

---

## 📁 Project Structure

```
campus-hub-frontend/
├── src/
│   ├── components/
│   │   ├── layout/         # Navbar, Sidebar, Topbar, Footer, MobileNav
│   │   └── pages/          # One component per route (18 pages)
│   ├── store.ts            # Zustand stores for all modules
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Hash-based router
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── server.ts               # Express backend with all API endpoints + Gemini integration
├── vite.config.ts          # Vite configuration
├── .env.example            # Environment variable template
└── package.json
```

---

## 🌐 Deploy

This app is designed to run as a **single Node.js process** that serves both the API and the built React SPA.

```bash
# Build for production
npm run build

# Start the production server
npm start
```

For cloud deployment (Cloud Run, Railway, Render):
1. Set the `GEMINI_API_KEY` environment variable in your deployment dashboard
2. The app binds to `0.0.0.0:3000` and is ready to serve

---

## 📄 License

This project was built for the **Google AI Studio Hackathon**. Feel free to fork and adapt.
