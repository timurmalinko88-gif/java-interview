# 🚀 Java Interview Prep Hub

<p align="center">
  <img src="https://img.shields.io/badge/Questions-550-brightgreen.svg?style=for-the-badge&logo=java" alt="Total Questions">
  <img src="https://img.shields.io/badge/Topics-11-blue.svg?style=for-the-badge&logo=codeforces" alt="Total Topics">
  <img src="https://img.shields.io/badge/Simulator-Mock%20Interview-purple.svg?style=for-the-badge&logo=target" alt="Mock Interview Simulator">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Active-success.svg?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

An interactive web trainer, mock interview simulator, and knowledge base designed to help you ace Java technical interviews—from **Junior** to **Senior** level.

🔗 **[Live Demo](https://timurmalinko88-gif.github.io/java-interview/)**

---

## 🌟 Key Features

- 📚 **550 well‑structured questions** with detailed answers, code examples, and real‑world analogies.
- 🎙️ **Mock Interview Simulator**:
  - Customizable settings (topic, difficulty, number of questions).
  - Live countdown timer for each question.
  - Final scorecard with feedback and suggestions.
- 🎮 **Gamification**:
  - Earn **XP** for each studied question and completed mock interview.
  - Rank progression (from *Junior Trainee* to *Java Architect*).
  - Daily streak tracking, all persisted in `LocalStorage`.
- ⚡ **Instant Search & Filtering** by keywords, topic, difficulty, and answer format.
- 🧠 **Multiple Question Formats**:
  - `Open Answer` – detailed explanations for deep learning.
  - `Multiple Choice` / `Single Choice` – quick self‑assessment tests.
- 🎯 **Training Modes**:
  - **Catalog** – browse, filter, and bookmark questions.
  - **Quiz Mode** – random selection for rapid practice.
  - **Flashcards** – spaced‑repetition style review.
- 🎨 **Premium UI**: glass‑morphism, dark/light themes, responsive layout, hotkeys (Ctrl+K for search).
- 💻 **Syntax Highlighting** with PrismJS for Java code snippets.

---

## 📂 Topics & Question Breakdown

The repository contains **550 questions** split across **11 categories** (≈50 per category):

| Category | Topic | # of Questions | Difficulty Range |
| :--- | :--- | :---: | :---: |
| 📦 **Collections** | Lists, Sets, Maps, Queues | 50 | Junior–Senior |
| 🗄️ **Databases** | SQL, transactions, JPA/Hibernate | 50 | Middle–Senior |
| ☕ **General Java** | Core language features, error handling | 50 | Junior–Middle |
| ⚙️ **JVM & Memory** | Heap, Stack, GC, ClassLoaders | 50 | Middle–Senior |
| 🧵 **Multithreading** | Threads, Executors, Locks, JMM | 50 | Middle–Senior |
| 🧱 **OOP** | Encapsulation, inheritance, polymorphism, SOLID | 50 | Junior–Senior |
| 🎨 **Patterns** | Creational, structural, behavioral patterns | 50 | Middle–Senior |
| 🍃 **Spring** | Spring Core, DI, Boot, Data JPA, Security, REST | 50 | Middle–Senior |
| 🌊 **Stream API** | Functional interfaces, streams, Optional | 50 | Junior–Middle |
| 🏗️ **System Design** | Architecture, micro‑services, scaling, caching | 50 | Middle–Senior |
| 🧪 **Testing** | JUnit 5, Mockito, integration testing | 50 | Junior–Middle |

---

## 🛠️ Project Structure

```text
java-interview/
├── questions/                  # Markdown questions organized by category
│   ├── collections/
│   ├── databases/
│   ├── general/
│   ├── jvm/
│   ├── multithreading/
│   ├── oop/
│   ├── patterns/
│   ├── spring/
│   ├── stream/
│   ├── system-design/
│   └── testing/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions CI/CD for GitHub Pages
├── build.py                    # Generates index.json from Markdown files
├── index.html                  # Single‑page app (SPA)
├── index.json                  # Pre‑generated catalogue of questions
├── .gitignore
├── .nojekyll                   # Disables Jekyll processing on GitHub Pages
├── LICENSE                     # MIT license
└── README.md                   # This documentation
```

---

## 🚀 Quick Local Development

1. **Clone the repository**
```bash
git clone https://github.com/timurmalinko88-gif/java-interview.git
cd java-interview
```
2. **Run a local web server** (any static server will do)
```bash
# Python 3 built‑in server
python -m http.server 8000
```
Open your browser at <http://localhost:8000> to explore the app.

---

## 🔄 Re‑building the Index (`build.py`)

Whenever you add or modify Markdown questions, regenerate `index.json`:
```bash
python build.py
```
The script scans `questions/**/*.md`, extracts Front‑Matter metadata, and updates the JSON catalog.

---

## 📄 Adding a New Question

All questions follow the same structure:
```markdown
---
id: <unique-id>
topic: <category>
difficulty: <Junior|Middle|Senior>
format: Open Answer   # or Multiple Choice / Single Choice
time: <estimated minutes>
frequency: <expected occurrence %>
source: Custom
prerequisites: ["<related topic>"]
---

# Question Title

Question text goes here.

---ANSWER---

Answer explanation, code examples, and optional life‑analogy.
```
Place the file in the appropriate `questions/<category>/` folder.

---

## 🌐 Automated Deployment to GitHub Pages

The repository includes a **GitHub Actions** workflow (`.github/workflows/deploy.yml`). It automatically:
1. Checks out the repo.
2. Sets up Python and runs `build.py`.
3. Deploys the static site to GitHub Pages.

To enable it:
1. Go to **Settings → Pages** in the GitHub UI.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Push to `main` and the workflow will publish the site at:
   `https://<your‑username>.github.io/java-interview/`

---

## 📄 License

This project is released under the **MIT License**. See the `LICENSE` file for details.
