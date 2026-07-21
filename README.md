# 🚀 Java Interview Prep Hub

<p align="center">
  <img src="https://img.shields.io/badge/Questions-550-brightgreen.svg?style=for-the-badge&logo=java" alt="Total Questions">
  <img src="https://img.shields.io/badge/Topics-11-blue.svg?style=for-the-badge&logo=codeforces" alt="Total Topics">
  <img src="https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/GitHub%20Pages-Active-success.svg?style=for-the-badge&logo=github" alt="GitHub Pages">
</p>

 Интерактивный веб-тренажёр и структурированная база знаний для подготовки к техническим собеседованиям по Java — от **Junior** до **Senior** разработчика.

🔗 **[Запустить веб-версию (Live Demo)](https://timurmalinko88-gif.github.io/java-interview/)**

---

## 🌟 Основные возможности

- 📚 **550 структурированных вопросов** с подробными ответами, примерами кода и жизненными аналогиями.
- ⚡ **Мгновенный поиск и фильтрация**: по ключевым словам, темам, уровню сложности (Junior, Middle, Senior) и формату ответа.
- 🧠 **Разнообразные форматы вопросов**:
  - `Open Answer` — вопросы с развернутым ответом для глубокой подготовки.
  - `Multiple Choice` / `Single Choice` — тестовые вопросы с вариантами ответов для проверки знаний.
- 🎯 **Интерактивные режимы обучения**:
  - **Каталог вопросов** — удобно читать, искать и фильтровать.
  - **Режим Квиза (Quiz Mode)** — случайный выбор вопросов для проверки себя.
  - **Режим Флеш-карточек (Flashcards)** — карточки для запоминания.
- 📊 **Отслеживание прогресса**: сохранение изученных вопросов и закладок в `LocalStorage` браузера без необходимости регистрации.
- 🎨 **Современный UI**: адаптивный дизайн (Glassmorphism), поддержка **Dark / Light** темы и горячих клавиш.
- 💻 **Подсветка синтаксиса**: аккуратное форматирование Java кода с помощью PrismJS.

---

## 📂 Темы и структуры вопросов

В базе собрано **550 вопросов**, распределённых по **11 направлениям** (по 50 вопросов в каждой категории):

| Категория | Тема | Кол-во вопросов | Сложность |
| :--- | :--- | :---: | :---: |
| 📦 **Collections** | Коллекции и структуры данных (`List`, `Map`, `Set`, `Queue`) | 50 | Junior–Senior |
| 🗄️ **Databases** | Базы данных, SQL, транзакции, индексы, JPA / Hibernate | 50 | Middle–Senior |
| ☕ **General Java** | Core Java, ключевые слова, тип данных, обработка ошибок | 50 | Junior–Middle |
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
├── index.json                  # Индексированный каталог вопросов
├── .gitignore                  # Исключения Git
├── .nojekyll                   # Отключение Jekyll для GitHub Pages
├── LICENSE                     # Лицензия MIT
└── README.md                   # Документация проекта
```

---

## 🚀 Быстрый запуск локально

Проект является статическим веб-приложением и не требует внешних серверов или баз данных.

### 1. Клонирование репозитория
```bash
git clone https://github.com/timurmalinko88-gif/java-interview.git
cd java-interview
```

### 2. Запуск локального сервера
Вы можете открыть файл `index.html` напрямую в браузере или запустить простой HTTP-сервер через Python:

```bash
# Python 3
python -m http.server 8000
```
После этого откройте браузер по адресу: [http://localhost:8000](http://localhost:8000)

---

## 🔄 Сборка индекса вопросов (`build.py`)

Если вы добавляете или редактируете Markdown-файлы вопросов в папке `questions/`, запустите скрипт `build.py` для автоматического обновления `index.json`:

```bash
python build.py
```

Скрипт сканирует все файлы `.md`, считывает Frontmatter-метаданные и формирует актуальный каталог `index.json`.

---

## 📝 Как добавить новый вопрос

Каждый вопрос располагается в соответствующей подпапке `questions/<category>/` в формате Markdown.

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

## 🌐 Деплой на GitHub Pages

Проект настроен для автоматического деплоя через **GitHub Actions**:

1. Зайдите в раздел **Settings** вашего репозитория на GitHub.
2. Откройте вкладку **Pages** в боковом меню.
3. В разделе **Source** выберите **GitHub Actions**.
4. При каждом пуше в ветку `main` файл `deploy.yml` автоматически соберет проект и опубликует его по адресу:
   `https://<your-username>.github.io/java-interview/`

---

## 📄 Лицензия

Проект распространяется под лицензией [MIT](LICENSE). Вы можете свободно использовать, модифицировать и распространять его.
