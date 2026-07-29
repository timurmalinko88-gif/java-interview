# 🤖 AI Agent Guide — Java Interview Prep Hub

Welcome, AI Agent! This document is the single source of truth for the **Java Interview Prep Hub & Mock Simulator** codebase (`java-interview`). Refer to this guide whenever analyzing, modifying, debugging, or adding features to this repository.

---

## 📌 Project Overview & Intent

- **Repository**: `timurmalinko88-gif/java-interview`
- **Live Site (GitHub Pages)**: `https://timurmalinko88-gif.github.io/java-interview/`
- **Purpose**: High-performance Single Page Application (SPA), mock interview simulator, and knowledge hub for Java developer technical interviews (from Junior to Senior & Architect levels).
- **Core Metrics**:
  - **671 Questions** across **18 Domains** (Core Java, JVM, Multithreading, Spring Boot, System Design, Kafka, Java 21+, AI/LLM Integration, Algorithm Breakdown, etc.).
  - **4 Curated Learning Tracks (Roadmaps)**: Junior Express, Middle Spring & Microservices, Senior Architect, AI & Modern Java 21+.
  - **Interactive Features**: Mock Interview Simulator (with timed evaluation & Scorecards), Spaced Repetition System (Leitner box), XP & 7-tier Rank Gamification, YouTube search integration, Interactive System Architecture SVG Canvas, Algorithm Breakdown module, and Dark/Light UI themes.

---

## 🏗️ Architecture & Technology Stack

### Frontend Architecture
- **Core Technology**: Vanilla JavaScript (ES Modules), HTML5, CSS3.
- **Styling**: Tailwind CSS (with `@tailwindcss/typography` plugin), custom glassmorphism styles in `src/style.css`.
- **UI Components**: Native HTML `<dialog>` elements for modals (modal dialog polyfills/helpers in `src/ui.js` & `src/adaptive.js`).
- **Markdown Parsing**: `marked.js` with `breaks: true`.
- **Syntax Highlighting**: Highlight.js / PrismJS for Java code snippet rendering with one-click copy.
- **Icons**: FontAwesome 6 Free (`fa-solid`, `fa-brands`).
- **Build Tooling**: Vite 8 (`npm run dev`, `npm run build`, output directory `./dist`).

### Data & Indexing Architecture
- **Question Storage**: Individual `.md` files located in `public/questions/<category>/`.
- **Indexing Script**: `build.py` (Python 3 script scanning `public/questions/**/*.md` to generate `public/index.json`).
- **State Management & Persistence**: Entirely client-side via `LocalStorage` (`java_trainer_mastered`, `java_trainer_flagged`, `java_trainer_sr`, XP, streak). No external database backend required.

### CI/CD Deployment Workflow
- **GitHub Actions**: `.github/workflows/deploy.yml` triggers on push to `main`.
- **Pipeline Steps**:
  1. Check out repository.
  2. Run `python build.py` to regenerate `public/index.json`.
  3. Run `npm ci` and `npm run build` (`vite build` to `./dist`).
  4. Upload `./dist` artifact and deploy to **GitHub Pages**.

---

## 📂 Directory & File Map

```text
java-interview/
├── public/                     # Static assets served as-is by Vite & GitHub Pages
│   ├── questions/              # 671 Markdown question files organized in 18 subfolders
│   │   ├── ai-integration/     # Spring AI, RAG, PgVector, Prompt Engineering (20 files)
│   │   ├── algorithms/         # Algorithm Breakdown: sorting, graphs, DP (15 files)
│   │   ├── behavioral/         # HR & STAR methodology (10 files)
│   │   ├── collections/        # Java Collections & Data Structures (52 files)
│   │   ├── databases/          # SQL, Transactions, JPA, Hibernate (52 files)
│   │   ├── exceptions/         # Exception hierarchy & handling (2 files)
│   │   ├── general/            # Core Java syntax & fundamentals (46 files)
│   │   ├── jvm/                # JVM, Memory, GC, ClassLoaders (52 files)
│   │   ├── live-coding/        # Bug hunting & code refactoring (15 files)
│   │   ├── messaging/          # Kafka, Message Queues, DLQ (20 files)
│   │   ├── modern-java/        # Java 21+ Virtual Threads, Loom, Patterns (15 files)
│   │   ├── multithreading/     # Concurrency, JMM, Locks, Executors (52 files)
│   │   ├── oop/                # OOP principles, SOLID, GRASP (52 files)
│   │   ├── patterns/           # Design Patterns (50 files)
│   │   ├── spring/             # Spring Core, Boot, Security, Data (58 files)
│   │   ├── stream/             # Stream API & Functional Interfaces (52 files)
│   │   ├── system-design/      # Microservices, Caching, Scaling (58 files)
│   │   └── testing/            # JUnit 5, Mockito, Integration Testing (50 files)
│   ├── index.json              # Auto-generated catalog of all 671 questions
│   ├── quiz.json               # Diagnostic questions for adaptive learning quiz
│   └── og-image.png            # Open Graph preview image (1200x630) for link sharing
├── src/                        # Modular JavaScript source files
│   ├── adaptive.js             # Diagnostic quiz & personalized roadmap modal logic
│   ├── api.js                  # Dynamic question content fetching helper
│   ├── collections.js          # Helper utilities for question sorting & grouping
│   ├── main.js                 # App entry point, global event listeners, hotkeys
│   ├── mock.js                 # Mock interview simulator engine (timer, evaluation, scorecard)
│   ├── roadmaps.js             # Learning track filtering logic
│   ├── spacedRepetition.js     # Leitner box spaced repetition algorithm
│   ├── state.js                # Global state store, LocalStorage sync, filtering
│   ├── stats.js                # XP calculation, 7 rank tiers, statistics modal UI
│   ├── style.css               # Tailwind directives & glassmorphic custom CSS
│   ├── ui.js                   # DOM rendering (sidebar, cards, toast, theme toggle)
│   └── utils.js                # Debounce, formatting, string helpers
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD GitHub Pages deployment workflow
├── build.py                    # Python 3 build script to generate public/index.json
├── index.html                  # Main SPA HTML structure & Open Graph meta-tags
├── vite.config.js              # Vite configuration (PWA, build options)
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Project dependencies & npm scripts
├── README.md                   # Public repository documentation
└── AGENTS.md                   # This instruction file for AI agents
```

---

## 📝 Markdown Question File Format Specification

Every question file under `public/questions/**/*.md` MUST adhere to this structure:

```markdown
---
id: collections-001
topic: Collections
difficulty: Junior
format: Open Answer
time: 5
frequency: 90%
source: Custom
prerequisites: ["Data Structures"]
---

# Difference between ArrayList and LinkedList

What are the main differences between `ArrayList` and `LinkedList` in Java? When would you choose one over the other?

---ANSWER---

Both `ArrayList` and `LinkedList` implement the `List` interface...

### Life Analogy
Think of `ArrayList` like a row of lockers next to each other...

### Key Takeaways
- `ArrayList` uses a dynamic array.
- `LinkedList` uses a doubly-linked list.
```

### Frontmatter Metadata Fields:
- `id` (required): Unique string ID (e.g. `collections-001`, `java21-005`, `kafka-012`).
- `topic` (required): Category string matching one of the 18 topics.
- `difficulty` (required): `Junior`, `Middle`, or `Senior`.
- `format` (required): `Open Answer`, `Code Review`, `System Design`, `MCQ`, `Live Coding`, `Algo Breakdown`, or `HR Interview`.
- `time`: Estimated time in minutes.
- `frequency`: Expected frequency percentage in real interviews (e.g. `85%`).

### Document Body Delimiters:
- **`---ANSWER---`**: Mandatory divider separating the Question Prompt from the Answer Body.

---

## ⚙️ Key Development Workflows for AI Agents

### 1. Adding or Updating Questions
1. Create or edit Markdown files under `public/questions/<category>/<filename>.md`.
2. Run `python build.py` to regenerate `public/index.json`.
3. Verify index statistics: `python -c "import json; d=json.load(open('public/index.json')); print(d['total'])"`.
4. Run `npm run build` to verify production build.

### 2. Modifying UI or Application Logic
1. Edit ES modules in `src/`. Keep modules decoupled and single-responsibility (`state.js` for data, `ui.js` for DOM, `mock.js` for simulator).
2. Test changes locally (`npm run dev` or `python -m http.server 8000`).
3. Run `npm run build` to compile assets to `./dist`.

### 3. Deploying Updates to GitHub
1. Always run `python build.py` and `npm run build` before committing.
2. Stage modified files (`git add .`).
3. Commit with conventional commit messages (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
4. Push to remote: `git push origin main`. GitHub Actions will automatically deploy to GitHub Pages.

---

## ⚠️ Guidelines & Constraints for AI Agents

1. **Empirical Verification Required**: NEVER claim a task is completed without running `python build.py` and `npm run build` to confirm clean completion without errors.
2. **Preserve State Keys**: Do NOT modify existing `LocalStorage` key names (`java_trainer_mastered`, `java_trainer_flagged`, `java_trainer_sr`), as doing so would clear existing user progress.
3. **No Superficial Symptom Patches**: Trace root causes instead of suppressing exceptions or bypassing validation logic.
4. **Maintain Open Graph Integrity**: Keep Open Graph meta-tags (`og:title`, `og:description`, `og:image`, `og:url`) in sync with `README.md` and repo stats.
5. **Strict File Path Boundaries**: Always write code and docs within the project workspace (`c:\java-prep`). Do NOT create files outside the workspace.

---

*This guide should be maintained and updated whenever architectural changes or new modules are added to the repository.*
