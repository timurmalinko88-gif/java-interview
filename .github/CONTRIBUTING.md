# Contributing to Java Interview Prep Hub & Mock Simulator

Thank you for taking the time to contribute! 🎉 

We welcome contributions of all sizes—whether you are adding new interview questions, fixing typos, adding new learning tracks, or improving UI animations and tests.

---

## 🚀 Quick Start & Development Setup

1. **Fork & Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/java-interview.git
   cd java-interview
   ```

2. **Install Node.js & Python Dependencies**:
   - Ensure **Node.js 18+** and **Python 3.10+** are installed.
   - Install npm packages:
     ```bash
     npm install
     ```

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📚 Adding or Updating Questions

All pre-indexed questions reside in `quiz.json`.

1. Open `quiz.json`.
2. Add your question under the relevant topic array following the existing schema:
   ```json
   {
     "id": "unique-slug-id",
     "topic": "General Java",
     "title": "Your Question Title Here?",
     "difficulty": "Middle",
     "answer": "Detailed answer written in clean Markdown...",
     "code": "// Optional code snippet if applicable",
     "tags": ["core", "java"]
   }
   ```
3. **Rebuild Question Indexes**:
   Always run the index build script after modifying `quiz.json`:
   ```bash
   python build.py
   ```
   This generates updated `docs/index.json` and index counts.

---

## 🧪 Testing Guidelines

Before submitting your Pull Request, run all tests locally:

1. **Run Production Build**:
   ```bash
   npm run build
   ```
2. **Run End-to-End Tests**:
   ```bash
   npx playwright test
   ```

---

## 🔀 Submitting a Pull Request (PR)

1. Create a feature branch:
   ```bash
   git checkout -b feature/add-new-spring-questions
   ```
2. Commit your changes with a clear commit message:
   ```bash
   git commit -m "feat(questions): add 5 new Spring AI RAG questions"
   ```
3. Push to your fork and submit a Pull Request to `main`.
4. Ensure all CI checks pass.

Thank you for making Java interview preparation better for everyone! ☕
