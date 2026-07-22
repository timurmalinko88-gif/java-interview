# 🚀 Java Interview Prep Hub & Mock Simulator

<p align="center">
  <img src="https://img.shields.io/badge/Questions-583-brightgreen.svg?style=for-the-badge&logo=java" alt="Total Questions">
  <img src="https://img.shields.io/badge/Topics-11-blue.svg?style=for-the-badge&logo=codeforces" alt="Total Topics">
  <img src="https://img.shields.io/badge/Simulator-Mock%20Interview-purple.svg?style=for-the-badge&logo=target" alt="Mock Interview Simulator">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Active-success.svg?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

An interactive, high-performance Single Page Web Application (SPA), mock interview simulator, and structured knowledge base engineered for acing technical Java interviews — from **Junior** to **Senior** and **Lead / Architect** level.

🔗 **[Launch Live Demo (GitHub Pages)](https://timurmalinko88-gif.github.io/java-interview/)**

---

## 🌟 Key Features

### 🎙️ Mock Interview Simulator
- **Customizable Sessions**: Configure your mock interview by choosing specific topics, difficulty levels (Junior, Middle, Senior), and question volume (5, 10, 15, or 20 questions).
- **Live Interview Mode**: Includes a real-time countdown timer, live progress tracking, and dedicated status bar.
- **Interactive Self-Evaluation**: Evaluate your responses live during the mock interview:
  - ❌ **Missed** (0 XP) — Need to revisit.
  - ⚠️ **Partial** (+10 XP) — Satisfactory, missing key details.
  - ✅ **Nailed It** (+25 XP) — Flawless explanation.
- **Detailed Scorecard & Feedback**: Generates an end-of-session evaluation report with total score percentage, performance rank, and targeted advice for weak areas.

### 🎮 Gamification & Progress Persistence
- **Experience Points (XP)**: Earn XP by studying questions, marking topics as mastered, and completing mock interviews.
- **Developer Rank System**: Progress through 7 rank levels:
  1. 🌱 *Trainee*
  2. 🐣 *Intern*
  3. 💻 *Junior Developer*
  4. ⚡ *Middle Developer*
  5. 🔥 *Senior Developer*
  6. 👑 *Lead Engineer*
  7. 🧙‍♂️ *Java Architect*
- **Global Progress Bar**: Visual progress indicator calculating your overall mastery percentage across all 583 questions.
- **Local Persistence**: All progress, bookmarks, XP, and rank stats are automatically saved in browser `LocalStorage` without requiring any account registration.

### ⚡ Comprehensive Question Engine
- **583 Curated Questions**: Detailed answers, clean Java code snippets, key takeaways, and real-world life analogies.
- **Smart Filtering & Search**: Instant full-text search with hotkey support (`Ctrl+K`), topic filters, difficulty badges, and format selectors.
- **Flexible Training Modes**:
  - 📖 **Catalog View**: Browse, search, and bookmark questions systematically.
  - 🎲 **Blitz / Quiz Mode**: Rapid-fire random question testing.
  - 🎯 **Adaptive Mode**: Smart recommendations focusing on unlearned or low-accuracy categories.

### 🎨 Modern UI & UX
- **Glassmorphic Design**: Clean, modern aesthetics with smooth micro-animations.
- **macOS-Style Code Blocks**: Beautiful syntax highlighting powered by PrismJS with one-click code copy.
- **Dark & Light Mode**: Seamless theme toggle with automatic syntax highlighting adjustments.
- **Hotkeys**: Navigation via Left/Right arrows, `Space` / `Enter` to reveal answers, `Ctrl+K` to search.

---

## 📊 Content Breakdown & Statistics

The repository contains **583 pre-indexed questions** categorized across **11 core Java domains**:

### Topic Breakdown

| Icon | Category | # of Questions | Difficulty Range | Primary Topics Covered |
| :--- | :--- | :---: | :---: | :--- |
| 📦 | **Collections** | 50 | Junior – Senior | `ArrayList`, `LinkedList`, `HashMap`, `ConcurrentHashMap`, `PriorityQueue`, `Set`, `Deque` |
| 🗄️ | **Databases** | 50 | Middle – Senior | SQL, ACID, Isolation Levels, Indexes, Execution Plans, JPA, Hibernate, N+1 Problem |
| ☕ | **General Java** | 50 | Junior – Middle | Core Syntax, `String` Pool, Generics, Exception Handling, Pass-by-Value, Equals & HashCode |
| ⚙️ | **JVM & Memory** | 50 | Middle – Senior | JVM Memory Structure (`Heap`, `Stack`, `Metaspace`), GC Algorithms (G1, ZGC), JIT, ClassLoaders |
| 🧵 | **Multithreading** | 50 | Middle – Senior | `Thread`, `Runnable`, `Callable`, `Executors`, `ReentrantLock`, `volatile`, Atomic, JMM, Deadlocks |
| 🧱 | **OOP** | 50 | Junior – Senior | Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID Principles, GRASP |
| 🎨 | **Patterns** | 50 | Middle – Senior | Singleton, Factory, Builder, Adapter, Proxy, Observer, Strategy, Chain of Responsibility |
| 🍃 | **Spring Framework** | 50 | Middle – Senior | Spring Core, IoC/DI, Bean Lifecycle, Spring Boot, Spring Data JPA, Spring Security, AOP, REST |
| 🌊 | **Stream API** | 50 | Junior – Middle | Functional Interfaces (`Predicate`, `Function`, `Consumer`, `Supplier`), Stream Operations, `Optional` |
| 🏗️ | **System Design** | 50 | Middle – Senior | High Availability, Microservices, Load Balancing, Caching (Redis), Message Queues (Kafka), CAP Theorem |
| 🧪 | **Testing** | 50 | Junior – Middle | Unit Testing, Integration Testing, JUnit 5, Mockito, `@Mock`, `@InjectMocks`, TDD |

### Difficulty Distribution

- 🟢 **Junior**: 178 questions (32.4%)
- 🟡 **Middle**: 240 questions (43.6%)
- 🔴 **Senior**: 132 questions (24.0%)

### Format Breakdown

- 📝 **Open Answer**: 390 questions (detailed conceptual & theoretical breakdowns)
- 🔍 **Code Review**: 104 questions (code snippet analysis, bug finding, optimization)
- 🏗️ **System Design**: 56 questions (architectural decisions, trade-offs, scalability scenarios)

---

## 🛠️ Repository & File Architecture

```text
java-interview/
├── questions/                  # Markdown files containing questions & frontmatter metadata
│   ├── collections/            # 50 Collection & Data Structure questions
│   ├── databases/              # 50 Database & Persistence questions
│   ├── general/                # 50 Core Java questions
│   ├── jvm/                    # 50 JVM & Memory Management questions
│   ├── multithreading/         # 50 Multithreading & Concurrency questions
│   ├── oop/                    # 50 OOP & Object Design questions
│   ├── patterns/               # 50 Design Pattern questions
│   ├── spring/                 # 50 Spring Framework questions
│   ├── stream/                 # 50 Stream API & Functional Programming questions
│   ├── system-design/          # 50 System Design & Architecture questions
│   └── testing/                # 50 Testing & QA questions
├── .github/workflows/
│   └── deploy.yml              # CI/CD workflow for automated GitHub Pages deployment
├── build.py                    # Python build script to extract frontmatter & update index.json
├── index.html                  # Single-Page Web Application (HTML5, Tailwind CSS, Vanilla JS)
├── index.json                  # Pre-compiled JSON catalog of all 583 questions
├── .gitignore                  # Git exclusion rules for OS & Python artifacts
├── .nojekyll                   # Bypasses Jekyll processing on GitHub Pages
├── LICENSE                     # MIT Open Source License
└── README.md                   # Repository documentation
```

---

## 🚀 Quick Start & Local Development

No complex setup, Node.js, or build steps required. The application runs natively in any modern web browser.

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

If you add new questions or modify existing Markdown files in `questions/`, update `index.json` by running the build script:

```bash
python build.py
```

The script automatically:
1. Scans `questions/**/*.md` recursively.
2. Intelligent frontmatter parsing (handles YAML delimited by `---` or key-value headers).
3. Assigns IDs, topics, difficulty levels, estimated times, and formats.
4. Generates a clean, optimized `index.json`.

---

## 📝 How to Add New Questions

To add a new question, create a Markdown file in the appropriate directory inside `questions/<category>/`.

### Example Format (`questions/collections/collections-051.md`):

```markdown
---
id: collections-051
topic: Collections
difficulty: Middle
format: Open Answer
time: 5
frequency: 85%
source: Custom
prerequisites: ["Data Structures"]
---

# Difference between ConcurrentHashMap and Hashtable

What are the key internal differences between `ConcurrentHashMap` and `Hashtable`?

---ANSWER---

`Hashtable` synchronizes every method using a single monitor lock, causing thread contention.
`ConcurrentHashMap` uses bucket-level locking (striped locking in Java 7, CAS + `synchronized` per bucket node in Java 8+) for significantly higher concurrent throughput.

### Life Analogy
`Hashtable` is like a library with a single key for the whole building — only one person can enter at a time.
`ConcurrentHashMap` is like a library where each bookshelf has its own key — multiple people can browse different bookshelves simultaneously.

### Key Takeaways
- `Hashtable` locks the entire table.
- `ConcurrentHashMap` locks individual bucket bins.
- `ConcurrentHashMap` does not allow `null` keys or values.
```

---

## 🌐 Automated GitHub Pages Deployment

The repository uses **GitHub Actions** (`.github/workflows/deploy.yml`) for automated CI/CD deployment:

1. Whenever code is pushed to `main`, GitHub Actions triggers automatically.
2. It sets up Python, runs `build.py` to ensure `index.json` is fresh, and packages static artifacts.
3. Deploys the application directly to **GitHub Pages**:
   **`https://timurmalinko88-gif.github.io/java-interview/`**

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
