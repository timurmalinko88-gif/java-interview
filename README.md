# 🚀 Java Interview Prep Hub & Mock Simulator

<p align="center">
  <img src="https://img.shields.io/badge/Questions-583-brightgreen.svg?style=for-the-badge&logo=java" alt="Total Questions">
  <img src="https://img.shields.io/badge/Topics-13-blue.svg?style=for-the-badge&logo=codeforces" alt="Total Topics">
  <img src="https://img.shields.io/badge/Simulator-Mock%20Interview-purple.svg?style=for-the-badge&logo=target" alt="Mock Interview Simulator">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Active-success.svg?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

An interactive, high-performance Single Page Web Application (SPA), mock interview simulator, and structured knowledge base engineered for acing technical Java interviews — from **Junior** to **Senior** and **Lead / Architect** level.

🔗 **[Launch Live Demo (GitHub Pages)](https://timurmalinko88-gif.github.io/java-interview/)**

---

## 🌟 Key Features & Updates

### 📊 Progress Bars 2.0 & Rank Tracker
- **Dynamic Rank Tracker**: Live visual tracker monitoring your progression from *Junior Trainee* to *Java Architect*.
- **Topic Micro-Progress**: Individual progress bars for each category showing percentage of mastered questions.
- **Experience Points (XP)**: Earn XP by reviewing questions, completing Spaced Repetition cards, and mastering mock interviews.
- **Stats Management**: Detailed Stats Modal with progress reset options, streak counters, and performance breakdown.

### 🧠 Spaced Repetition System (SRS)
- **Leitner Box System**: Algorithm-based question review that schedules questions based on your recall accuracy.
- **Adaptive Memory Cards**: Focuses practice on weak areas and unlearned topics to maximize retention.
- **XP Integration**: Automatically awards XP upon successfully answering Spaced Repetition questions.

### 🎙️ Mock Interview Simulator
- **Customizable Sessions**: Configure your mock interview by choosing specific topics, difficulty levels (Junior, Middle, Senior), and question volume (5, 10, 15, or 20 questions).
- **Live Interview Mode**: Real-time countdown timer, live progress tracking, and dedicated status bar.
- **Interactive Self-Evaluation**:
  - ❌ **Missed** (0 XP) — Need to revisit.
  - ⚠️ **Partial** (+10 XP) — Satisfactory, missing key details.
  - ✅ **Nailed It** (+25 XP) — Flawless explanation.
- **Detailed Scorecard**: End-of-session evaluation report with total score percentage, performance rank, and actionable feedback.

### ⚡ Comprehensive Question Engine
- **583 Curated Questions**: Detailed answers, clean Java code snippets, key takeaways, and real-world life analogies.
- **Multiple Formats**: Includes Open Answer theory, Code Review bug finding, System Design architecture, and Multiple Choice (MCQ) tests.
- **Smart Search & Filters**: Instant full-text search (`Ctrl+K`), difficulty badges, topic filters, and bookmark flags.
- **Local Persistence**: Progress, bookmarks, XP, and rank stats auto-saved in browser `LocalStorage`.

---

## 📊 Content Breakdown & Statistics

The repository contains **583 pre-indexed questions** categorized across **13 domains**:

### Topic Breakdown

| Icon | Category | # of Questions | Difficulty Range | Primary Topics Covered |
| :--- | :--- | :---: | :---: | :--- |
| 📦 | **Collections** | 52 | Junior – Senior | `ArrayList`, `LinkedList`, `HashMap`, `ConcurrentHashMap`, `PriorityQueue`, `Set`, `Deque` |
| 🗄️ | **Databases** | 52 | Middle – Senior | SQL, ACID, Isolation Levels, Indexes, Execution Plans, JPA, Hibernate, N+1 Problem |
| 🚨 | **Exceptions** | 2 | Junior – Middle | Exception Hierarchy, Checked vs Unchecked, `try-with-resources`, Custom Exceptions |
| ☕ | **General Java** | 53 | Junior – Middle | Core Syntax, `String` Pool, Generics, Exception Handling, Pass-by-Value, Equals & HashCode |
| ⚙️ | **JVM & Memory** | 52 | Middle – Senior | JVM Memory Structure (`Heap`, `Stack`, `Metaspace`), GC Algorithms (G1, ZGC), JIT, ClassLoaders |
| 🧵 | **Multithreading** | 52 | Middle – Senior | `Thread`, `Runnable`, `Callable`, `Executors`, `ReentrantLock`, `volatile`, Atomic, JMM, Deadlocks |
| 🧱 | **OOP** | 52 | Junior – Senior | Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID Principles, GRASP |
| 🎨 | **Patterns** | 50 | Middle – Senior | Singleton, Factory, Builder, Adapter, Proxy, Observer, Strategy, Chain of Responsibility |
| 🍃 | **Spring Framework** | 58 | Middle – Senior | Spring Core, IoC/DI, Bean Lifecycle, Spring Boot, Spring Data JPA, Spring Security, AOP, REST |
| 🌊 | **Stream API** | 52 | Junior – Middle | Functional Interfaces (`Predicate`, `Function`, `Consumer`, `Supplier`), Stream Operations, `Optional` |
| 🏗️ | **System Design** | 58 | Middle – Senior | High Availability, Microservices, Load Balancing, Caching (Redis), Message Queues (Kafka), CAP Theorem |
| 🧪 | **Testing** | 50 | Junior – Middle | Unit Testing, Integration Testing, JUnit 5, Mockito, `@Mock`, `@InjectMocks`, TDD |

### Difficulty Distribution

- 🟢 **Junior**: 186 questions (31.9%)
- 🟡 **Middle**: 257 questions (44.1%)
- 🔴 **Senior**: 140 questions (24.0%)

### Format Breakdown

- 📝 **Open Answer**: 390 questions
- 🔍 **Code Review**: 104 questions
- 🏗️ **System Design**: 56 questions
- ❓ **Multiple Choice (MCQ)**: 33 questions

---

## 🛠️ Repository & File Architecture

```text
java-interview/
├── public/                     # Static distribution & question files
│   ├── questions/              # 583 Markdown question files in category subfolders
│   └── index.json              # Pre-compiled JSON catalog of questions
├── .github/workflows/
│   └── deploy.yml              # CI/CD workflow for automated GitHub Pages deployment
├── build.py                    # Python build script to parse frontmatter & generate index.json
├── index.html                  # Single-Page Web Application (HTML5, Tailwind CSS, Vanilla JS)
├── .gitignore                  # Git exclusion rules for OS & Python artifacts
├── .nojekyll                   # Bypasses Jekyll processing on GitHub Pages
├── LICENSE                     # MIT Open Source License
└── README.md                   # Repository documentation
```

---

## 🚀 Quick Start & Local Development

No complex setup or build steps required. The application runs natively in any modern web browser.

### 1. Clone the Repository
```bash
git clone https://github.com/timurmalinko88-gif/java-interview.git
cd java-interview
```

### 2. Start a Local HTTP Server
Launch a local server using Python's built-in HTTP module:

```bash
# Python 3
python -m http.server 8000
```
Then navigate to: **[http://localhost:8000](http://localhost:8000)** in your browser.

---

## 🔄 Building / Re-indexing (`build.py`)

If you add new questions or modify Markdown files in `public/questions/`, update `public/index.json` by running the build script:

```bash
python build.py
```

The script automatically:
1. Scans `public/questions/**/*.md` recursively.
2. Parses frontmatter metadata (handles YAML delimited by `---` or key-value headers).
3. Assigns IDs, topics, difficulty levels, estimated times, and formats.
4. Generates a clean, optimized `public/index.json`.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
