# InternAI — Personalized Startup Outreach

**Source:** Miro board https://miro.com/app/board/uXjVHEjL1q0=/

InternAI turns generic cold emails into targeted, founder-relevant outreach. Upload your documents once; the AI researches each startup and crafts messages that sound like you and reflect what the founder actually cares about.

## Problem

Students blast ~100 cold emails and get ~2 replies. Founders ignore 98% because messages are generic, show no research, and don't signal genuine interest.

## Solution

AI-powered outreach that analyzes your resume for relevant experience and matches your writing style. Each message is tailored to the founder's priorities.

## How It Works (5-Step Workflow)

1. **Upload Once** — Two documents:
   - **Resume or Cover Letter** (for content analysis): AI scans for relevant experience matching target startups. Example: targeting fintech → AI extracts fintech projects to lead with.
   - **Writing Sample** (for style analysis): AI ONLY studies writing style, habits, structure. Content is ignored — purely for voice matching.

2. **Target** — Enter company website URL; AI web scraper automatically extracts:
   - Industry, product/purpose, funding stage
   - Tech stack and company details
   - No manual entry needed

3. **Research** — AI scans your documents for experience matching each startup's domain (industry, tech stack, stage)

4. **Generate** — Crafts outreach in your voice, leading with matched experience and credible hooks

5. **Learn** — Tracks replies; updates tone and targeting automatically

## Key Features

- **Adaptive learning**: Improves message quality from reply data and user feedback
- **RAG-based experience matching**: Scans resume/cover letter for relevant projects matching each startup
- **Voice matching**: Analyzes writing sample to preserve your authentic style
- **Founder preference detection**: Surfaces what matters to each recipient
- **AI-powered web scraping**: Auto-extracts company info from website URLs (industry, stage, tech stack)
- **Lead generation**: AI discovers 10 relevant startups at a time based on your profile (rate-limited to 3 generations per few hours)
- **Adaptive feedback system**: Mark outreach as success/failed with optional notes — AI learns and adapts future messages

## Impact

- **10× reply rates** vs. traditional cold outreach
- Turn cold emails into warm introductions at scale
- Students land internships that truly fit their skills and interests

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Documents**: AI analyzes uploaded docs (PDF, DOCX, TXT) for:
  - Content extraction (RAG-style matching)
  - Writing style patterns (sentence length, formality, structure)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Document Upload Requirements

### Content Document (Resume or Cover Letter)
- **Purpose**: AI scans for relevant experience matching target startups
- **Formats**: PDF, DOC, DOCX, TXT
- **Usage**: Targeting fintech startup → AI finds fintech projects/experience to lead with

### Writing Sample
- **Purpose**: AI studies writing style ONLY (habits, structure, sentence patterns)
- **Formats**: PDF, DOC, DOCX, TXT
- **Usage**: Content is ignored — purely for voice matching
- **Examples**: Past email, essay, blog post, cover letter

## Project Structure

```
src/
├── types/index.ts              — Interfaces for UserProfile, Startup, OutreachMessage, StartupLead
├── services/
│   ├── engine.ts               — 5-step workflow engine with RAG analysis & adaptive learning
│   ├── webscraper.ts           — AI web scraper for extracting company data from URLs
│   └── leadGenerator.ts        — AI-powered startup lead generation with rate limiting
├── screens/
│   ├── LandingScreen.tsx       — Problem/Solution/Impact + How It Works
│   ├── ProfileSetupScreen.tsx  — Document uploads (content + style)
│   ├── DashboardScreen.tsx     — Stats: reply rate, sent, positive replies
│   ├── TargetsScreen.tsx       — URL-based startup addition with web scraping & feedback system
│   ├── GenerateScreen.tsx      — Before vs After comparison + rationale
│   └── LeadsScreen.tsx         — AI-powered startup discovery (10 leads at a time)
└── App.tsx                     — Navigation flow
```

## Demo Flow

1. **Before vs After**: Side-by-side of generic cold email vs InternAI-generated message
2. **Dashboard**: Reply rate lift, response time, positive-reply count, match scores
3. **Generate Leads**: Discover 10 AI-matched startups at a time (rate-limited to 3 per few hours)
4. **Adaptive Feedback**: Mark outreach as success/failed — AI learns and improves future messages
5. **Generate**: Select startup → click Generate → see crafted outreach with rationale

## License

MIT
