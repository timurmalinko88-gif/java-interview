# 🚀 Viral Launch Kit: Java Interview Prep Hub & AI Simulator

Готовый набор материалов и пошаговый план для публичного запуска проекта на **Habr**, **Reddit**, **Hacker News**, **Product Hunt** и **LinkedIn / Twitter (X)** для сбора 1,000+ звёзд на GitHub и построения сильного личного бренда.

---

## 📅 Пошаговый план запуска (Timeline)

```mermaid
graph LR
    D1[День 1: Reddit & Hacker News] --> D2[День 2: Статья на Хабре]
    D2 --> D3[День 3: Product Hunt Launch]
    D3 --> D4[День 4-7: LinkedIn & Telegram Каналы]
```

---

## 1. 📝 Черновик статьи для Хабра (Habr)

**Заголовок**:  
*Как я запустил локальный AI-интервьюер на WebGPU и клиентский векторный поиск для 706 вопросов по Java с $0 серверных расходов*

**Хабы**: `Java`, `Искусственный интеллект`, `Веб-разработка`, `Open Source`, `Карьера в IT-индустрии`.

```markdown
Привет, Хабр!

Подготовка к техническим собеседованиям по Java (особенно на уровни Senior / Lead) — это всегда боль. Классические списки вопросов быстро устаревают, а на реальных интервью спрашивают тонкости виртуальных потоков (Java 21 Loom), распределенные транзакции в Kafka, Spring AI и поведение сборщиков мусора (ZGC/G1).

С другой стороны, тренироваться вслух в одиночку тяжело: непонятно, насколько точно ты сформулировал ответ, а платить за подписки на облачные LLM-сервисы или гонять платные API-токены OpenAI/Anthropic не всегда хочется.

Поэтому я создал **Java Interview Prep Hub** — полностью открытую платформу-тренажер, работающую на 100% в браузере пользователя без бэкенда и без платных API.

🔗 **[Попробовать Live Demo](https://timurmalinko88-gif.github.io/java-interview/)**  
⭐ **[Репозиторий на GitHub](https://github.com/timurmalinko88-gif/java-interview)**

---

### Что под капотом (Архитектура Software 3.0):

1. 🧠 **In-Browser AI Interviewer (WebGPU + WebLLM)**:
   - Квантованная модель (Qwen-2.5-Coder / Llama-3.2) компилируется в WebGPU-шейдеры и исполняется прямо на видеокарте пользователя через `@mlc-ai/web-llm`.
   - Ответ можно надиктовать голосом через микрофон (Web Speech API) или набрать текстом.
   - Модель сопоставляет ваш ответ с эталоном из базы знаний и выдает честный Scorecard: балл %, найденные и упущенные технические нюансы и каверзный уточняющий вопрос от интервьюера.

2. 🔍 **Локальный векторный поиск (Client-Side RAG)**:
   - Вместо примитивного поиска по подстроке используется модель эмбеддингов `all-MiniLM-L6-v2` через Transformers.js в Web Worker.
   - Запрос на естественном языке («как оптимизировать медленный SQL?») преобразуется в вектор и находит вопросы по B-Tree индексам, Explain Plan и партиционированию за < 0.5 мс.

3. 📦 **706 вопросов по 18 направлениям**:
   - Core Java, Multithreading & JMM, JVM Memory & GC, Collections, Databases & JPA, Kafka & Messaging, Spring Boot & Security, Modern Java 21+, System Design, AI & LLM Integration (RAG, PgVector, Spring AI) и др.

4. 🎮 **Интерактивные инструменты**:
   - **System Design Flow Canvas**: SVG-симулятор архитектуры микросервисов с визуализацией потоков данных.
   - **Algorithm Breakdown**: пошаговый интерактивный разбор алгоритмов с оценкой Big-O.
   - **Leitner Box SRS**: интервальное повторение для запоминания сложных тем.

---

### Почему это работает быстро и бесплатно?

Проект собран как ультра-легковесное SPA на чистом Vanilla JS (ES Modules) + Vite 8 + Tailwind CSS. Вся база хранится в оптимизированных Markdown-файлах, которые индексируются скриптом на Python в JSON и векторные массивы.

Весь проект развернут на бесплатном статическом хостинге GitHub Pages. Серверные расходы = $0.00.

Буду рад вашему фидбеку, предложениям и звездам на GitHub! Будущее за AI-Native приложениями на стороне клиента!
```

---

## 2. 🌍 Пост для Reddit (`r/java`, `r/programming`, `r/webdev`)

**Subreddits**: `r/java`, `r/programming`, `r/cscareerquestions`, `r/webdev`

**Title**:  
`I built a 100% Free & In-Browser AI Mock Interviewer for Java Developers powered by WebGPU (706 questions, Client-Side Vector Search, 0$ server costs)`

**Body**:
```markdown
Hey everyone! 👋

I've been working on an open-source technical interview simulator & knowledge hub tailored specifically for Java engineers (from Junior to Senior / Architect levels): **Java Interview Prep Hub**.

Everything runs 100% on the client-side with zero backend dependencies and $0 server costs.

🔗 **Live Simulator:** https://timurmalinko88-gif.github.io/java-interview/  
⭐ **GitHub Repo:** https://github.com/timurmalinko88-gif/java-interview

### 🌟 Key Highlights:
- 🎙️ **In-Browser WebGPU AI Examiner:** Run quantized LLMs (Qwen2.5-Coder / Llama-3.2) locally on your device via `@mlc-ai/web-llm`. Speak your answer via microphone (Web Speech API), and the AI grades your response against ground-truth technical rubrics with a breakdown of missed nuances.
- 🔍 **Client-Side Semantic Search (RAG):** Powered by `all-MiniLM-L6-v2` in a Web Worker — instant semantic retrieval (<0.5ms) for natural language queries like *"how to prevent kafka consumer rebalance storms"*.
- 📚 **706 Curated Questions across 18 Domains:** Java 21+ Virtual Threads, JMM, Spring Boot, Kafka, System Design, Algorithms, and Spring AI / Vector DBs.
- 🏗️ **Interactive System Architecture Canvas:** Animated SVG microservice data-flow simulator with real Java code snippets.
- ⚡ **PWA & Offline Capable:** Install it on your laptop or phone and practice anywhere.

The project is completely free and MIT-licensed. Check it out and let me know your thoughts or topics you'd like to see added!
```

---

## 3. 🐱 Питч для Product Hunt

- **Product Name**: Java Interview Hub & AI Simulator
- **Tagline**: In-Browser WebGPU AI Mock Interviewer for Java Engineers
- **Pricing**: Free / Open-Source (MIT)
- **Topics**: `Developer Tools`, `Artificial Intelligence`, `Open Source`, `Education`

**First Maker Comment**:
```text
Hey Product Hunt community! 🚀

I'm thrilled to share Java Interview Prep Hub — an open-source, AI-native platform designed to help software engineers master Java technical interviews.

Instead of relying on costly cloud LLM APIs or static text lists, we brought the AI directly into your browser:
✨ WebGPU In-Browser AI Examiner for voice-driven mock interviews
✨ Client-Side Vector Search (all-MiniLM-L6-v2) for instant conceptual search
✨ 706 deep technical questions from Core Java & JVM internals to Java 21 Virtual Threads & Spring AI
✨ Interactive System Design SVG Canvas & Algorithm Visualizers

100% Free. Zero server costs. No login required.

Give it a spin and let me know your feedback! ☕
```

---

## 4. 💼 Пост для LinkedIn & Twitter / X

```text
🚀 Excited to open-source the Java Interview Prep Hub & AI Simulator!

Preparing for Senior/Lead Java interviews just got a massive upgrade:
🔹 In-Browser AI Interviewer (runs locally via WebGPU shaders!)
🔹 Voice dictation & instant grading against ground-truth rubrics
🔹 Client-side semantic vector search across 706 deep technical questions
🔹 Interactive System Architecture SVG canvas & Leitner Box SRS

100% free, runs completely on the client with zero backend.

👉 Try the Live Demo: https://timurmalinko88-gif.github.io/java-interview/
⭐ Star the project on GitHub: https://github.com/timurmalinko88-gif/java-interview

#Java #SoftwareEngineering #AI #WebGPU #OpenSource #TechInterviews #Vite #JavaScript
```
