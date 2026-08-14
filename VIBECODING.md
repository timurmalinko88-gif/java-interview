# 🌊 Vibecoding Blueprint — Java Interview Prep Hub

Welcome to the Software 3.0 era. This repository is deliberately engineered for hyper-productive AI pair programming (Vibecoding). We stripped away modern JavaScript framework bloat, Webpack configuration hell, and monolithic backends. 

What's left is a crystal-clear, first-principles Single Page Application (SPA) where AI agents can write 90%+ of the code while human intuition steers the vision.

## 🧠 Why This Project is a Vibecoding Utopia

1. **Declarative Context as Data**: The entire knowledge base is structured as pure Markdown files in `public/questions/`. LLMs inherently *dream* in Markdown. Generating 50 new Spring Boot questions or 10 algorithm breakdowns takes a single prompt. No database migrations, no ORMs.
2. **Deterministic Feedback Loop**: 
   - `python build.py` intelligently indices all markdown files into a single `public/index.json`.
   - The feedback loop is instant: Write markdown -> Run `build.py` -> See UI update.
3. **Vanilla ES Modules**: No React/Angular/Vue abstractions. `src/state.js`, `src/ui.js`, `src/main.js` are fully transparent DOM manipulation and local state management. An AI can confidently rewrite components without fighting a Virtual DOM or dependency arrays.
4. **Zero-Backend Architecture**: State is synchronized via `LocalStorage` (`java_trainer_mastered`, etc.). This isolates all complexity to the client.

## 🛠️ The Vibecoder's Workflow

### 1. Generating Content at Scale
To add new questions or interactive scenarios, use the newly introduced AI scaffolding tool:
```bash
python tools/vibe_generator.py scaffold --filename "loom-001" --folder "modern-java" --title "Virtual Threads vs Platform Threads" --topic "Modern Java 21+"
```
Then, let your AI companion fill in the `---ANSWER---` section.
After generating, ALWAYS validate the schema:
```bash
python tools/vibe_generator.py validate
```

### 2. Updating the Index & UI
Once the LLM generates the markdown:
```bash
# 1. Regenerate the JSON catalog
python build.py

# 2. Rebuild the frontend
npm run build

# 3. Run automated deterministic UI tests
npx playwright test
```

## 🚀 Vision: Software 3.0 Integrations (Roadmap)

To elevate this project from a static tool to a fully autonomous AI simulator, we will integrate client-side ML:

### 1. WebLLM: In-Browser Mock Interviewer
- **Concept**: Embed WebLLM (powered by Apache TVM) to run a quantized local LLM (e.g., Llama-3-8B-Q4) directly in the user's browser using WebGPU.
- **Vibe**: The user presses "Start Mock Interview". The WebLLM model loads into GPU memory. The user types or speaks answers, and the LLM evaluates the response against the `index.json` knowledge base—zero server costs, full privacy.

### 2. Voice-Driven Simulator via Transformers.js
- **Concept**: Integrate `transformers.js` to run Whisper (Speech-to-Text) and TTS models locally. 
- **Vibe**: "Hey Java Trainer, what's the difference between HashMap and ConcurrentHashMap?" The app listens, transcribes, processes via WebLLM, and speaks back the evaluation.

### 3. Local Embeddings for Semantic RAG
- **Concept**: Generate embeddings for all 670+ questions using a lightweight in-browser model (e.g., all-MiniLM-L6-v2 via Transformers.js) and store them in IndexedDB/Vector-lite.
- **Vibe**: Instead of basic keyword search, users can describe a problem conceptually ("How do I handle out of memory issues when loading large files?"), and the UI instantly surfaces the relevant `JVM & Memory Management` questions.

## ⚡ Eliminating Friction
- **Old Friction**: Manual frontmatter entry led to typos and broken indexes.
- **New Flow**: `vibe_generator.py` enforces rigid schema, and `build.py` handles parsing robustly. The LLM only worries about high-quality technical content.
- **Golden Rule**: Always run `python build.py && npm run build && npx playwright test` after an AI coding session.
