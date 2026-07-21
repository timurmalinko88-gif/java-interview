# 🚀 Java Interview Prep Hub

<p align="center">
  <img src="https://img.shields.io/badge/Questions-550-brightgreen.svg?style=for-the-badge&logo=java" alt="Total Questions">
  <img src="https://img.shields.io/badge/Topics-11-blue.svg?style=for-the-badge&logo=codeforces" alt="Total Topics">
  <img src="https://img.shields.io/badge/Simulator-Mock%20Interview-purple.svg?style=for-the-badge&logo=target" alt="Mock Interview Simulator">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Active-success.svg?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

Интерактивный веб-тренажёр, симулятор собеседований и база знаний для успешного прохождения технических собеседований по Java — от **Junior** до **Senior** разработчика.

🔗 **[Запустить веб-версию (Live Demo)](https://timurmalinko88-gif.github.io/java-interview/)**

---

## 🌟 Основные возможности

- 📚 **550 структурированных вопросов** с подробными ответами, примерами кода и жизненными аналогиями.
- 🎙️ **Симулятор симуляции собеседования (Mock Interview Simulator)**:
  - Настройка формата: выбор темы, уровня сложности (Junior, Middle, Senior) и количества вопросов.
  - Живой таймер (обратный отсчёт на каждый вопрос).
  - Итоговая карточка оценки (Scorecard) с подсчётом баллов и рекомендациями.
- 🎮 **Геймификация и прогресс**:
  - Начисление **XP** за каждый изученный вопрос и прохождение симуляций.
  - Ранги и уровни (от *Junior Trainee* до *Java Architect*).
  - Отслеживание ежедневных серий знаний (Streak) и сохранение результатов в `LocalStorage`.
- ⚡ **Умный поиск и фильтрация**: по ключевым словам, темам, уровню сложности и формату ответа.
- 🧠 **Разнообразные форматы вопросов**:
  - `Open Answer` — развернутые ответы для глубокой подготовки.
  - `Multiple Choice` / `Single Choice` — интерактивные тесты с автоматической проверкой.
- 🎯 **Режимы обучения**:
  - **Каталог вопросов** — удобная фильтрация и навигация.
  - **Режим Квиза (Quiz Mode)** — случайный выбор вопросов для тренировки.
  - **Режим Флеш-карточек (Flashcards)** — карточки для быстрой самопроверки.
- 🎨 **Современный UI**: премиальный адаптивный дизайн (Glassmorphism, macOS-style блоки кода), поддержка **Dark / Light** темы и горячих клавиш (`Ctrl+K` для поиска).
- 💻 **Подсветка синтаксиса**: форматирование Java кода с помощью PrismJS.

---

## 📂 Темы и структура вопросов

В базе собрано **550 вопросов**, распределённых по **11 направлениям** (по 50 вопросов в каждой категории):

| Категория | Тема | Кол-во вопросов | Сложность |
| :--- | :--- | :---: | :---: |
| 📦 **Collections** | Коллекции и структуры данных (`List`, `Map`, `Set`, `Queue`) | 50 | Junior–Senior |
| 🗄️ **Databases** | Базы данных, SQL, транзакции, индексы, JPA / Hibernate | 50 | Middle–Senior |
| ☕ **General Java** | Core Java, ключевые слова, типы данных, обработка ошибок | 50 | Junior–Middle |
| ⚙️ **JVM & Memory** | Память (`Heap`, `Stack`), Garbage Collector, ClassLoaders | 50 | Middle–Senior |
| 🧵 **Multithreading** | Concurrency, `Thread`, `Executors`, `ReentrantLock`, JMM | 50 | Middle–Senior |
| 🧱 **OOP** | Инкапсуляция, наследование, полиморфизм, SOLID, GRASP | 50 | Junior–Senior |
| 🎨 **Patterns** | Порождающие, структурные и поведенческие паттерны | 50 | Middle–Senior |
| 🍃 **Spring** | Spring Core, IoC/DI, Boot, Data JPA, Security, REST | 50 | Middle–Senior |
| 🌊 **Stream API** | Функциональные интерфейсы, Stream API, Optional | 50 | Junior–Middle |
| 🏗️ **System Design** | Архитектура, микросервисы, масштабирование, кэширование | 50 | Middle–Senior |
| 🧪 **Testing** | Модульное тестирование, JUnit 5, Mockito, Интеграционные тесты | 50 | Junior–Middle |

---

## 🛠️ Структура проекта

```text
java-interview/
├── questions/                  # Папка с Markdown-файлами вопросов
│   ├── collections/            # 50 вопросов по коллекциям
│   ├── databases/              # 50 вопросов по БД
│   ├── general/                # 50 вопросов по Core Java
│   ├── jvm/                    # 50 вопросов по JVM
│   ├── multithreading/         # 50 вопросов по многопоточности
│   ├── oop/                    # 50 вопросов по ООП
│   ├── patterns/               # 50 вопросов по паттернам
│   ├── spring/                 # 50 вопросов по Spring
│   ├── stream/                 # 50 вопросов по Stream API
│   ├── system-design/          # 50 вопросов по System Design
│   └── testing/                # 50 вопросов по тестированию
├── .github/workflows/
│   └── deploy.yml              # CI/CD: Авто-деплой на GitHub Pages
├── build.py                    # Python-скрипт сборки файла index.json
├── index.html                  # Одностраничное веб-приложение (SPA)
├── index.json                  # Индексированный каталог вопросов (550 вопросов)
├── .gitignore                  # Исключения Git
├── .nojekyll                   # Отключение Jekyll для GitHub Pages
├── LICENSE                     # Лицензия MIT
└── README.md                   # Документация проекта
```

---

## 🚀 Быстрый запуск локально

Проект является статическим веб-приложением и не требует сторонних зависимостей.

### 1. Клонирование репозитория
```bash
git clone https://github.com/timurmalinko88-gif/java-interview.git
cd java-interview
```

### 2. Запуск локального сервера
Вы можете открыть `index.html` в браузере или запустить локальный HTTP-сервер через Python:

```bash
# Python 3
python -m http.server 8000
```
После этого откройте браузер по адресу: [http://localhost:8000](http://localhost:8000)

---

## 🔄 Сборка индекса вопросов (`build.py`)

Если вы добавляете новые вопросы или редактируете существующие Markdown-файлы в папке `questions/`, запустите скрипт `build.py` для автоматического обновления каталога `index.json`:

```bash
python build.py
```

Скрипт просканирует все `.md` файлы, обработает метаданные и обновит `index.json`.

---

## 📝 Как добавить новый вопрос

Все вопросы хранятся в формате Markdown с Frontmatter-метаданными в папках `questions/<category>/`.

### Пример файла вопроса (`questions/collections/collections-051.md`):

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

# Заголовок вопроса

Текст вопроса с описанием проблемы или сценария.

---ANSWER---

Подробный разбор ответа с примерами кода и объяснением:

```java
public class Example {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

### Жизненная аналогия
Наглядный пример из жизни для легкого запоминания.
```

---

## 🌐 Автоматический деплой на GitHub Pages

Проект автоматически собирается и публикуется при помощи **GitHub Actions**:

1. В репозитории на GitHub перейдите в **Settings** -> **Pages**.
2. В секции **Source** выберите **GitHub Actions**.
3. При каждом коммите в ветку `main` запускается workflow `.github/workflows/deploy.yml`, обновляющий сайт по адресу:
   `https://<your-username>.github.io/java-interview/`

---

## 📄 Лицензия

Проект распространяется под лицензией [MIT](LICENSE).
