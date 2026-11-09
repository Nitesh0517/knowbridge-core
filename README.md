# KnowBridge AI
### Intelligent Knowledge Handover Platform
> **Tagline:** *"Never Lose Knowledge. Never Lose Momentum."*  
> **Problem Statement:** *"Prevent Critical Knowledge From Leaving With People."*

---

## 🚀 Overview

When employees, volunteers, or team members leave a project, critical institutional knowledge often vanishes with them. Even when documentation exists, key decisions, active blockers, unassigned responsibilities, and single-points-of-failure remain scattered across disparate PDFs, Word documents, commit logs, and meeting minutes.

**KnowBridge AI** is an intelligent knowledge reconstruction platform that synthesizes the ground-truth state of a project from authorized sources, eliminates hallucinations with a strict **"Insufficient Evidence"** policy, binds every claim to **verbatim source excerpts**, and produces role-tailored **30-60-90 day continuation plans** protected by human verification and tokenized sharing.

---

## 🏛️ The 5 Essential Stages

```
   [01. CONNECT]      ──>   [02. RECONSTRUCT]   ──>    [03. VERIFY]       ──>    [04. REVIEW]       ──>    [05. HANDOVER]
 Authorized Ingestion         Gemini 2.5 Flash        Traceable Quotes        Human 4-Eye Gate        30-60-90 Day Plan
 (PDF, DOCX, MD, GitHub)     State Synthesis          Offset Citing           Digital Sign-Off        Tokenized Sharing
```

1. **01. CONNECT**: Connect authorized project documents (PDF via PyMuPDF, DOCX via python-docx, Markdown, plain text), meeting notes, decision logs, and real GitHub repositories via the GitHub REST API.
2. **02. RECONSTRUCT**: The AI Knowledge Reconstruction Engine parses the raw sources and synthesizes:
   - **Architectural Decisions (ADRs)**: What was decided, why, who made it, and what alternatives were rejected.
   - **Unfinished Work**: Pending tasks, incomplete features, and ownership gaps.
   - **Ownership Matrix**: Domain mapping, key contacts, and departing maintainer dependencies.
   - **Dependencies & Blockers**: Technical and external task blockers.
   - **Transition Risks**: Single points of failure and operational bottlenecks.
   - **Next Actions**: Phased priorities for Days 1-30, Days 31-60, and Days 61-90.
   - **Unresolved Questions**: Strictly flagged with `"Insufficient Evidence"`.
3. **03. VERIFY**: The Evidence-Linked Knowledge System links every extracted statement to an auditable source quote with character offsets, page references, confidence ratings, and 1-click human verification flags.
4. **04. REVIEW**: A digital 4-eye approval gate empowering project managers and departing leads to review, edit, reject, and digitally sign off on handover packages.
5. **05. HANDOVER**: Generates a role-appropriate continuation plan (e.g. for Incoming Lead Architect, Frontend Dev, Backend Engineer, PM) shared securely through cryptographic, expiring access tokens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router DOM, Axios, Lucide React, Framer Motion, Recharts, Canvas-Confetti |
| **Backend REST API** | Node.js, Express.js, REST APIs, Mongoose, Multer, Firebase Admin SDK |
| **AI Processing** | Python 3.14, FastAPI, Uvicorn, Google Gemini API (`google-genai` SDK), PyMuPDF (fitz), python-docx |
| **Database** | MongoDB Atlas (with automatic local document store persistence fallback) |
| **Authentication** | Firebase Authentication with backend JWT token verification & instant demo lead architect login |
| **Integrations** | Authorized GitHub REST API (v3), PDF parser, DOCX parser, Markdown/TXT parsers |

---

## 📁 Repository Structure

```
knowbridge/
├── ai-service/                   # Python FastAPI AI Reconstruction Engine
│   ├── engine/
│   │   ├── gemini_extractor.py   # Google Gemini 2.5 Flash structured prompting & JSON schema
│   │   └── fallback_extractor.py # Deterministic pattern & NLP extraction engine
│   ├── parsers/
│   │   └── document_parser.py    # PyMuPDF (PDF) & python-docx parsers with page tracking
│   ├── main.py                   # FastAPI application & REST endpoints
│   ├── models.py                 # Pydantic schemas
│   ├── requirements.txt
│   └── .env
├── backend/                      # Node.js + Express REST API Server
│   ├── config/
│   │   └── db.js                 # Dual-mode Mongoose & persistent local document store
│   ├── controllers/              # Projects, Sources, Reconstruction, Evidence, Handovers, Analytics
│   ├── middleware/
│   │   └── auth.js               # Firebase token verification & local dev authentication
│   ├── services/
│   │   ├── aiBridge.js           # Bridge connecting Node to FastAPI AI service
│   │   └── githubService.js      # Authorized GitHub REST API (commits, issues, PRs, README)
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env
├── frontend/                     # React 19 + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/           # Logo, Sidebar, Header, HealthScoreBadge, StageIndicator, EvidenceModal
│   │   ├── context/              # AuthContext, ProjectContext
│   │   ├── pages/                # Landing, Login, Register, Dashboard, Projects, Sources,
│   │   │                         # Reconstruction, Evidence, Timeline, Tasks, Risks,
│   │   │                         # HandoverGenerate, Handovers, HandoverDetail, Approvals, Analytics
│   │   ├── services/             # api.js, firebase.js
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
├── sample-data/                  # Realistic multi-format sample documents for instant demo testing
│   ├── ADR-007-Database-Cutover-Strategy.pdf
│   ├── Falcon-Sprint26-Handoff-Notes.docx
│   ├── Architecture-Spec-V2.md
│   └── generate_samples.py
├── test_e2e.py                   # Automated end-to-end test suite validating all 5 stages
└── README.md
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **Python** 3.10+ (tested on Python 3.14)
- **Git**

### 2. Environment Configuration
Create or review the `.env` files in each service directory:

#### `ai-service/.env`
```env
PORT=8000
GEMINI_API_KEY=your_google_gemini_api_key_here  # Optional: can also be configured in UI Settings
DEFAULT_MODEL=gemini-2.5-flash
LOG_LEVEL=INFO
```

#### `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri_here  # Optional: falls back seamlessly to atomic local file store
AI_SERVICE_URL=http://localhost:8000
GEMINI_API_KEY=
GITHUB_TOKEN=your_github_pat_here        # Optional: for private repos & higher rate limits
FIREBASE_PROJECT_ID=knowbridge-ai
```

#### `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=knowbridge-ai
```

---

### 3. Running All Services

#### Terminal 1: Python AI Service
```bash
cd ai-service
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Health Check:* `http://localhost:8000/health`

#### Terminal 2: Node.js Backend API
```bash
cd backend
npm run dev
```
*Health Check:* `http://localhost:5000/health`

#### Terminal 3: React Frontend Application
```bash
cd frontend
npm run dev
```
*Frontend URL:* `http://localhost:5173`

---

## 🧪 Automated End-to-End Test Suite

Run the full automated test suite verifying all 5 product stages:
```bash
python test_e2e.py
```

**Test Verification Output:**
```
--- 1. Testing Python FastAPI AI Service ---
[OK] AI Service online: KnowBridge AI Reconstruction Engine (version 1.0.0)
     Parsers active: PyMuPDF, python-docx, txt, markdown
[OK] PDF Parser verified: ADR-007-Database-Cutover-Strategy.pdf (2 pages, 1783 chars)
[OK] DOCX Parser verified: Falcon-Sprint26-Handoff-Notes.docx (1214 chars)

--- 2. Testing Node.js Express REST Backend ---
[OK] Backend API online: KnowBridge AI Backend API
[OK] Projects listed: 2 existing project workspaces
[OK] Project created: 'E2E Test Transition Engine'
[OK] Meeting note source connected: ID kb_tced7tcxs

--- 3. Testing Stage 02: Knowledge Reconstruction ---
[OK] Reconstruction completed successfully! Health Score: 74%
     Decisions: 1 | Tasks: 1 | Risks: 1 | Evidence Claims: 2

--- 4. Testing Stage 03: Evidence Verification ---
[OK] Verified Claim [CLM-TSK-001]: Status is now 'verified'

--- 5. Testing Stage 05: Handover Generation & Sharing ---
[OK] Handover package generated: 30-Day, 60-Day, 90-Day roadmaps synthesized
     Share Token: 375bade0-44d9-4fe1-9b5b-2c6c50ca161e

--- 6. Testing Stage 04: Human Review & Approval ---
[OK] Handover status updated to: 'approved'

--- 7. Testing Public Controlled Sharing Portal ---
[OK] Public unauthenticated access verified via token link!

==================================================
ALL 5 STAGES & INTEGRATION TESTS PASSED 100%!
==================================================
```

---

## 🎯 Hackathon Problem Statement Compliance

- **No generic chatbots or basic summarizers**: KnowBridge reconstructs project reality into structured architectural decisions, task matrices, risk matrices, and 30-60-90 day continuation plans.
- **Traceability**: Every claim cites its origin document, line/section, and exact verbatim text excerpt.
- **Insufficient Evidence Enforcement**: The AI never hallucinates missing information; incomplete records are explicitly tagged as `"Insufficient Evidence"`.
- **4-Eye Human Gate**: Departing leads and project managers must inspect and sign off on handovers before finalization.
- **Real GitHub API Integration**: Audits commits, pull requests, open issues, and READMEs directly via the official GitHub REST API (v3).
- **Controlled Sharing**: Incoming members can access clean onboarding packages through cryptographic, expiring access tokens without requiring administrative dashboard credentials.

---

## 📄 License
MIT License. Built for the Individual Hackathon Submission.
