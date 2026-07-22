
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
import "./style.css";

// --- state.js ---
const fallbackDatabase = [
    {
        "id": "jvm-001",
        "topic": "JVM & Memory Management",
        "difficulty": "Junior",
        "format": "Open Answer",
        "question": "Что такое Garbage Collector (GC) в Java и как он работает в общих чертах?",
        "code": "",
        "answer": "**Garbage Collector (GC)** — это компонент виртуальной машины Java (JVM), предназначенный для автоматического управления памятью (Heap).\n\n**Ключевые этапы работы сборщика мусора:**\n1. **Mark (Пометка):** GC сканирует память, начиная с корневых ссылок (GC Roots: стек потоков, статические переменные, системные классы). Все достижимые объекты помечаются как живые.\n2. **Sweep (Удаление):** Все непомеченные объекты в куче считаются мусором и удаляются. Освободившаяся память регистрируется как доступная.\n3. **Compact (Уплотнение):** Чтобы избежать фрагментации памяти, выжившие объекты сдвигаются ближе друг к другу. Это обеспечивает непрерывные блоки для будущих крупных объектов.",
        "analogy": "Сборщик мусора похож на уборщика в роскошном отеле. Гости (объекты) заселяются в номера (выделение памяти в куче). Когда гости уезжают навсегда (все ссылки на объект стерты), уборщик замечает, что в номере никого нет, выносит старые вещи и заправляет постель заново, подготавливая номер для новых жильцов."
    },
    {
        "id": "jvm-002",
        "topic": "JVM & Memory Management",
        "difficulty": "Junior",
        "format": "Code Review",
        "question": "Где будут распределены переменные из следующего Java фрагмента в памяти (Stack vs Heap)? Вызовет ли данный бесконечный цикл критическую ошибку OutOfMemoryError?",
        "code": "public class MemoryDemo {\n    public static void main(String[] args) {\n        int localVal = 42;\n        String text = \"Hello JVM\";\n        \n        while (true) {\n            List<Integer> list = new ArrayList<>();\n            list.add(localVal);\n        }\n    }\n}",
        "answer": "### Распределение в памяти:\n- `localVal` является локальным примитивом типа `int` и сохраняется непосредственно в **Stack Frame** (стек-кадре) метода `main` текущего потока.\n- `text` — локальная ссылка. Сама ссылка лежит в **Stack**, а текстовый литерал `\"Hello JVM\"` хранится в специальном пуле строк (String Pool), расположенном внутри **Heap** (кучи).\n- `list` — ссылка на список, хранится в **Stack**, в то время как объект `new ArrayList<>()` и все добавляемые обертки `Integer` размещаются в **Heap**.\n\n### Поведение бесконечного цикла:\nЭтот код **НЕ вызовет OutOfMemoryError**.\nНа каждой итерации цикла создается локальный объект списка `list`. В конце каждой итерации область видимости текущей переменной `list` завершается. На следующей итерации ссылка переопределяется. Ссылка на предыдущий объект списка теряется, делая его недостижимым из GC Roots. Сборщик мусора будет беспрепятственно очищать кучу на фоне работы цикла, предотвращая переполнение памяти. Тем не менее, такой цикл создаст высокую нагрузку на CPU из-за постоянного выделения и очистки короткоживущих объектов.",
        "analogy": "Представьте себе конвейерную ленту, на которой вы берете пластиковый стаканчик (ArrayList), наливаете туда воду, а затем выбрасываете его в мусорный бак перед тем, как взять следующий. Бак никогда не переполнится, если мусорщик вовремя его освобождает, хотя вы и совершаете массу лишних действий."
    },
    {
        "id": "jvm-003",
        "topic": "JVM & Memory Management",
        "difficulty": "Middle",
        "format": "Open Answer",
        "question": "В чем ключевые отличия между Strong, Weak, Soft и Phantom ссылками в Java?",
        "code": "",
        "answer": "В Java существуют разные уровни силы ссылок, помогающие GC гибко управлять памятью:\n\n1. **Strong Reference (Сильные):** \n   Обычные ссылки по умолчанию (например, `Object obj = new Object()`). GC **никогда** не удалит объект, на который ведет хотя бы одна сильная ссылка, даже если памяти критически не хватает.\n\n2. **Soft Reference (Мягкие):**\n   Обертка `SoftReference<T>`. Объект удаляется GC **только при нехватке памяти** на куче (перед выбросом OOM). Идеально для построения простых кешей изображений или тяжелых данных.\n\n3. **Weak Reference (Слабые):**\n   Обертка `WeakReference<T>`. Объект удаляется GC при **ближайшей сборке мусора**, независимо от того, сколько свободной памяти есть вокруг. Полезно для ассоциативных маппингов (например, `WeakHashMap`).\n\n4. **Phantom Reference (Фантомные):**\n   Обертка `PhantomReference<T>`. Получить объект через метод `.get()` всегда возвращает `null`. Используется исключительно для отслеживания момента физического уничтожения объекта и тонкой очистки ресурсов вне кучи (вместо устаревшего `finalize()`).",
        "analogy": "Strong — железобетонный канат (держит намертво). Soft — прочная резиновая лента (держит, но растягивается и рвется, если тянуть слишком сильно из-за нехватки ресурсов). Weak — тонкая паутинка (рвется от легкого ветерка сборщика мусора). Phantom — тень покойного (объекта уже нет, но запись о том, что он ушел, осталась в системе регистрации)."
    },
    {
        "id": "multithreading-001",
        "topic": "Multithreading",
        "difficulty": "Junior",
        "format": "Open Answer",
        "question": "Зачем нужно ключевое слово volatile в Java и какие проблемы конкурентного доступа оно решает?",
        "code": "",
        "answer": "Ключевое слово `volatile` применяется к переменным и гарантирует:\n1. **Видимость (Visibility):** Чтение и запись переменной происходят непосредственно в основную оперативную память (RAM), минуя локальные кэши ядер процессоров (L1/L2/L3 cache). Изменение переменной одним потоком мгновенно отражается во всех остальных потоках.\n2. **Запрет переупорядочивания инструкций (Instruction Reordering Prevention):** Предотвращает оптимизационное перестроение инструкций компилятором JIT и процессором за счет расстановки специальных барьеров памяти (Memory Barriers).\n\n**Важное ограничение:**\n`volatile` **не гарантирует атомарность** сложных операций. Например, неатомарный инкремент `count++` (состоящий из 3-х шагов: чтение, модификация, запись) при многопоточном использовании приведет к состоянию гонки (Race Condition). Для атомарных операций используйте блокировки `synchronized` или классы семейства `Atomic*` (например, `AtomicInteger`).",
        "analogy": "volatile — это прозрачная маркерная доска в центре офиса. Любое изменение информации на ней мгновенно видят все сотрудники. Без нее каждый сотрудник записывает инструкции в личный бумажный блокнот (кэш процессора), который обновляется со значительной и непредсказуемой задержкой."
    },
    {
        "id": "multithreading-004",
        "topic": "Multithreading",
        "difficulty": "Middle",
        "format": "Code Review",
        "question": "Найдите уязвимость в данном синглтоне с двойной проверкой блокировки (Double-Checked Locking) и устраните её.",
        "code": "public class DatabaseConnection {\n    private static DatabaseConnection instance;\n\n    private DatabaseConnection() {}\n\n    public static DatabaseConnection getInstance() {\n        if (instance == null) { // Первая проверка\n            synchronized (DatabaseConnection.class) {\n                if (instance == null) { // Вторая проверка\n                    instance = new DatabaseConnection();\n                }\n            }\n        }\n        return instance;\n    }\n}",
        "answer": "### Ошибка в коде:\nПеременная `instance` не объявлена с ключевым словом **`volatile`**.\n\n### В чем опасность?\nОперация создания объекта `new DatabaseConnection()` не является атомарной. На низком уровне она компилируется в следующие три шага:\n1. Выделение памяти под объект.\n2. Вызов конструктора для инициализации полей.\n3. Присвоение адреса выделенной памяти в переменную `instance`.\n\nИз-за оптимизационного переупорядочивания инструкций процессор может поменять шаги 2 и 3 местами. В таком случае переменной `instance` присвоится адрес памяти до того, как завершится инициализация конструктором.\n\nЕсли в этот критический микросекундный момент другой поток вызовет `getInstance()`, первая проверка `if (instance == null)` вернет `false` (так как ссылка уже не null), и поток получит **частично инициализированный объект**, что приведет к непредсказуемым ошибкам в приложении (например, NullPointerException при вызовах методов).\n\n### Правильное решение:\nНеобходимо добавить модификатор `volatile` к объявлению переменной:\n```java\nprivate static volatile DatabaseConnection instance;\n```\nЭто запретит переупорядочивание инструкций инициализации объекта и гарантирует корректную работу в многопоточной среде.",
        "analogy": "Это как разрешить зайти покупателю в недостроенный магазин, в котором еще не повесили полки и не подключили электричество, только потому, что строители повесили красивую вывеску на входе."
    },
    {
        "id": "oop-001",
        "topic": "OOP",
        "difficulty": "Junior",
        "format": "Open Answer",
        "question": "Каковы ключевые различия между абстрактными классами и интерфейсами в современных версиях Java (Java 8+ и 17+)?",
        "code": "",
        "answer": "С развитием Java (особенно после добавления default-методов в Java 8 и sealed-классов в Java 17) границы размылись, но фундаментальные отличия остались:\n\n1. **Множественное наследование:** \n   Класс может наследоваться только от одного класса (включая абстрактные), но может имплементировать неограниченное количество интерфейсов.\n\n2. **Управление состоянием:** \n   Абстрактные классы могут иметь переменные состояния (instance fields), конструкторы и нестатические блоки инициализации. \n   Интерфейсы **не могут хранить состояние**; любые переменные в интерфейсе автоматически трактуются как `public static final` (константы).\n\n3. **Методы:**\n   - Абстрактные классы могут содержать методы с любыми модификаторами доступа (`private`, `protected`, `package-private`, `public`).\n   - В интерфейсах методы по умолчанию публичные (`public`). Начиная с Java 8 разрешены `default` и `static` методы с телом, с Java 9 — `private` методы для переиспользования кода внутри интерфейса.\n\n4. **Идеология применения:**\n   - **Абстрактный класс** используется при проектировании жесткой иерархии родственных сущностей, отвечающей на вопрос **«Кто я?» (IS-A)**.\n   - **Интерфейс** используется для декларирования независимых поведенческих контрактов, отвечающих на вопрос **«Что я умею делать?» (CAN-DO)**.",
        "analogy": "Абстрактный класс — это чертеж 'Смартфона'. Смартфон имеет физические компоненты: батарею, экран (переменные состояния). Интерфейс — это стандарт порта USB-C. Смартфон, плеер и лампа умеют заряжаться через этот порт, хотя они вообще не родственники по иерархии классов."
    },
    {
        "id": "oop-034",
        "topic": "OOP",
        "difficulty": "Middle",
        "format": "Code Review",
        "question": "Какие правила (контракты) будут нарушены, если переопределить метод equals(), но проигнорировать метод hashCode()?",
        "code": "public class Developer {\n    private String name;\n    private int age;\n\n    public Developer(String name, int age) {\n        this.name = name; \n        this.age = age;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Developer)) return false;\n        Developer dev = (Developer) o;\n        return age == dev.age && Objects.equals(name, dev.name);\n    }\n    // hashCode() НЕ переопределен!\n}",
        "answer": "### Последствия нарушения контракта:\nЕсли два объекта равны согласно методу `equals()`, у них **обязательно должны быть одинаковые значения `hashCode()`**.\n\nЕсли не переопределить `hashCode()`, будет использоваться стандартная реализация из класса `Object`, которая возвращает уникальный хэш-код, завязанный на внутренний адрес объекта в памяти.\n\n### К каким багам это приведет?\nТакой класс сломает работу всех хэш-коллекций (`HashMap`, `HashSet`, `Hashtable`):\n1. При добавлении дубликата в `HashSet<Developer>` будут сохранены оба объекта, так как хэш-коллекция сначала сравнивает хэш-коды объектов. У разных физических экземпляров хэш-коды будут разными, поэтому они попадут в разные бакеты.\n2. При поиске объекта в `HashMap` методом `.get(key)` вы получите `null`, даже если в мапе лежит абсолютно эквивалентный по значению `equals()` ключ.\n\n### Корректное решение:\nНеобходимо добавить генерацию согласованного хэш-кода:\n```java\n@Override\npublic int hashCode() {\n    return Objects.hash(name, age);\n}\n```",
        "analogy": "Вы расставили в архиве книги по жанрам (хэш-кодам), но две абсолютно одинаковые книги положили на разные полки (в разные бакеты). Читатель, пытаясь найти дубликат книги по ее содержанию (equals), заглянет на полку 'Фантастика' и уйдет ни с чем, потому что вторая книга по ошибке оказалась на полке 'Кулинария'."
    }
];

// Global State variables
let questionsList = [];
let filteredQuestions = [];
let currentIndex = 0;
let isAnswerVisible = false;
let masteredIds = [];
let flaggedIds = [];
let selectedDiffFilters = [];

// Loading states from LocalStorage for persistence
function loadPersistence() {
    try {
        const storedMastered = localStorage.getItem('java_trainer_mastered');
        const storedFlagged = localStorage.getItem('java_trainer_flagged');
        
        masteredIds = storedMastered ? JSON.parse(storedMastered) : [];
        flaggedIds = storedFlagged ? JSON.parse(storedFlagged) : [];
        
        if (typeof updateStatsUI === 'function') updateStatsUI();
        if (typeof updateStatsDashboard === 'function') updateStatsDashboard();
    } catch (err) {
        console.error("Failed to read localStorage persistence states", err);
    }
}

function savePersistence() {
    try {
        localStorage.setItem('java_trainer_mastered', JSON.stringify(masteredIds));
        localStorage.setItem('java_trainer_flagged', JSON.stringify(flaggedIds));
        if (typeof updateStatsUI === 'function') updateStatsUI();
        if (typeof updateStatsDashboard === 'function') updateStatsDashboard();
    } catch (err) {
        console.error("Failed to write to localStorage", err);
    }
}


// --- ui.js ---
// Build the left sidebar navigation items
function buildSidebarList() {
    const container = document.getElementById('questions-container');
    const countLabel = document.getElementById('question-list-count');
    
    container.innerHTML = '';
    countLabel.textContent = filteredQuestions.length;

    if (filteredQuestions.length === 0) {
        renderNoQuestionsFoundState();
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredQuestions.forEach((q, idx) => {
        const isMastered = masteredIds.includes(q.id);
        const isFlagged = flaggedIds.includes(q.id);
        const isActive = idx === currentIndex;

        // Color configuration for difficulties
        let diffStyle = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
        if (q.difficulty === 'Middle') diffStyle = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
        if (q.difficulty === 'Senior') diffStyle = 'bg-purple-500/10 text-purple-600 dark:text-purple-400';

        const button = document.createElement('button');
        button.className = `w-full text-left p-4 transition-all duration-200 border-l-4 flex flex-col space-y-2 ${
            isActive 
            ? 'bg-slate-100 dark:bg-slate-800/80 border-brand-500' 
            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30'
        }`;

        // Extract short question label
        const shortQuestionText = q.title || q.question || q.id;

        button.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-1.5">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${diffStyle}">
                        ${q.difficulty}
                    </span>
                    <span class="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        ${q.topic}
                    </span>
                </div>
                <div class="flex items-center space-x-1">
                    ${isMastered ? '<i class="fa-solid fa-circle-check text-emerald-500 text-xs"></i>' : ''}
                    ${isFlagged ? '<i class="fa-solid fa-bookmark text-amber-500 text-xs"></i>' : ''}
                </div>
            </div>
            <h4 class="text-xs font-bold leading-snug line-clamp-2 ${isActive ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'}">
                ${shortQuestionText}
            </h4>
        `;

        button.onclick = async () => {
            currentIndex = idx;
            isAnswerVisible = false;
            await loadQuestion(idx);
            buildSidebarList();
        };

        fragment.appendChild(button);
    });
    container.appendChild(fragment);
}

// Filter actions triggered on inputs change
function triggerFilterAction() {
    const searchValue = document.getElementById('search-input').value.toLowerCase().trim();
    const topicValue = document.getElementById('topic-filter').value;
    
    // Checkboxes for format
    const checkedFormats = Array.from(document.querySelectorAll('.format-checkbox:checked')).map(el => el.value);

    filteredQuestions = questionsList.filter(q => {
        // Search Matches
        const searchMatches = (q.question && q.question.toLowerCase().includes(searchValue)) || 
                              (q.id && q.id.toLowerCase().includes(searchValue)) ||
                              (q.loadedQuestion && q.loadedQuestion.toLowerCase().includes(searchValue)) ||
                              (q.loadedAnswer && q.loadedAnswer.toLowerCase().includes(searchValue));
        
        // Topic Matches
        const topicMatches = topicValue === 'all' || q.topic === topicValue;

        // Difficulty Matches
        const diffMatches = selectedDiffFilters.length === 0 || selectedDiffFilters.includes(q.difficulty);

        // Format Matches
        const formatMatches = checkedFormats.length === 0 || checkedFormats.includes(q.format);

        return searchMatches && topicMatches && diffMatches && formatMatches;
    });

    // Reset cursor if out of bounds
    if (currentIndex >= filteredQuestions.length) {
        currentIndex = 0;
    }

    // Toggle "Clear" filters indicator link
    const hasActiveFilters = searchValue !== '' || topicValue !== 'all' || selectedDiffFilters.length > 0 || checkedFormats.length > 0;
    document.getElementById('clear-filters').style.display = hasActiveFilters ? 'inline' : 'none';

    buildSidebarList();
    if (filteredQuestions.length > 0) {
        loadQuestion(currentIndex);
    }
}

// Reset global filter selections
function clearAllFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('topic-filter').value = 'all';
    
    selectedDiffFilters = [];
    document.querySelectorAll('.diff-chip').forEach(el => {
        el.classList.remove('bg-brand-500', 'text-white', 'border-brand-500');
        const diff = el.getAttribute('data-diff');
        if (diff === 'Junior') el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
        if (diff === 'Middle') el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
        if (diff === 'Senior') el.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
    });

    document.querySelectorAll('.format-checkbox').forEach(el => el.checked = false);
    
    triggerFilterAction();
}

// Sync UI global stats metrics
function updateStatsUI() {
    const total = questionsList.length;
    if (total === 0) return;

    const masteredCount = masteredIds.length;
    
    // Gamification Logic
    const xp = masteredCount * 10;
    let rank = "Intern";
    if (xp >= 5000) rank = "Staff Engineer";
    else if (xp >= 3000) rank = "Senior";
    else if (xp >= 1500) rank = "Middle";
    else if (xp >= 500) rank = "Junior";

    const statsXpEl = document.getElementById('stats-xp');
    if (statsXpEl) statsXpEl.textContent = xp + ' XP';
    
    const statsRankEl = document.getElementById('stats-rank');
    if (statsRankEl) statsRankEl.textContent = rank;

    // Calculate percentage progress for globally tracked completion progress bar
    const percent = Math.min(100, Math.round((masteredCount / total) * 100));
    const statsProgEl = document.getElementById('stats-progress');
    if (statsProgEl) statsProgEl.textContent = `${percent}% (${masteredCount}/${total})`;
    
    const globalProgEl = document.getElementById('global-progress');
    if (globalProgEl) globalProgEl.style.width = `${percent}%`;
}

// Parse the canonical Markdown format
function parseMarkdown(text) {
    const result = { question: '', answer: '', code: '', analogy: '', keyPoints: '' };
    const cleanText = text.replace(/^---[\s\S]*?---\s*/m, '').trim();
    
    const parts = cleanText.split('---ANSWER---');
    result.question = parts[0] ? parts[0].trim() : '';
    let rawAnswer = parts[1] ? parts[1].trim() : '';

    const codeMatch = rawAnswer.match(/```java\s*\n([\s\S]*?)\n```/i) || result.question.match(/```java\s*\n([\s\S]*?)\n```/i);
    if (codeMatch) result.code = codeMatch[1];
    
    // Extract Analogy
    const analogyMatch = rawAnswer.match(/###\s*Life Analogy\s*\n([\s\S]*?)(?=###|$)/i);
    if (analogyMatch) {
        result.analogy = analogyMatch[1].trim();
        rawAnswer = rawAnswer.replace(analogyMatch[0], '');
    }

    // Extract Key Points
    const keyPointsMatch = rawAnswer.match(/###\s*Key Points\s*\n([\s\S]*?)(?=###|$)/i);
    if (keyPointsMatch) {
        result.keyPoints = keyPointsMatch[1].trim();
        rawAnswer = rawAnswer.replace(keyPointsMatch[0], '');
    }

    result.answer = rawAnswer.trim();
    return result;
}

// Handle dynamically loading file content or pulling from fallbacks
async function loadQuestion(indexOrQuestion) {
    let q;
    let index = 0;
    if (typeof indexOrQuestion === 'object') {
        q = indexOrQuestion;
    } else {
        index = indexOrQuestion;
        if (filteredQuestions.length === 0) {
            renderNoQuestionsFoundState();
            return;
        }
        q = filteredQuestions[index];
    }

    // Update Header Meta Immediately for maximum responsiveness
    const diffEl = document.getElementById('active-difficulty');
    diffEl.textContent = q.difficulty;
    diffEl.className = 'px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ';
    if (q.difficulty === 'Junior') {
        diffEl.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
    } else if (q.difficulty === 'Middle') {
        diffEl.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
    } else {
        diffEl.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
    }

    document.getElementById('active-topic').textContent = q.topic;
    document.getElementById('active-id').textContent = '#' + q.id;
    document.getElementById('active-format').textContent = q.format;
    document.getElementById('counter').textContent = `${index + 1} / ${filteredQuestions.length}`;

    // Render Extra Metadata
    const extraMetaContainer = document.getElementById('extra-metadata');
    extraMetaContainer.innerHTML = '';
    if (q.time) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-regular fa-clock text-amber-500"></i> ${q.time} мин</span>`;
    }
    if (q.frequency) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-fire-flame-curved text-brand-500"></i> Frequency: ${q.frequency}</span>`;
    }
    if (q.related && q.related.length > 0) {
        extraMetaContainer.innerHTML += `<span class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded"><i class="fa-solid fa-link text-blue-500"></i> ${Array.isArray(q.related) ? q.related.join(', ') : q.related}</span>`;
    }

    // Reset action bookmark/completed status indicators
    syncActionButtons(q.id);

    // Hide the answer sections
    const answerSection = document.getElementById('answer-section');
    answerSection.classList.add('hidden');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');
    ansBtnText.textContent = "Show Answer";
    ansBtnIcon.className = "fa-solid fa-eye";
    isAnswerVisible = false;

    // Display loading indicators
    const questionTextEl = document.getElementById('question-text');
    questionTextEl.innerHTML = `
        <div class="flex items-center space-x-2 text-slate-400 py-4 animate-pulse">
            <i class="fa-solid fa-spinner fa-spin text-brand-500"></i>
            <span>Loading question content...</span>
        </div>
    `;
    document.getElementById('code-section').classList.add('hidden');

    // If question has not been loaded before, fetch it dynamically
    if (!q.loadedQuestion) {
        let parsedContent = null;
        
        if (q.path) {
            try {
                const response = await fetch(q.path);
                if (!response.ok) throw new Error("File fetch failed");
                const markdownText = await response.text();
                parsedContent = parseMarkdown(markdownText);
            } catch (err) {
                console.warn(`Dynamic fetch failed for ${q.path}, loading fallback item.`, err);
            }
        }

        // Match with embedded static database
        if (!parsedContent) {
            const fallbackObj = fallbackDatabase.find(f => f.id === q.id) || fallbackDatabase.find(f => f.id === "jvm-001");
            parsedContent = {
                question: fallbackObj.question,
                answer: fallbackObj.answer,
                code: fallbackObj.code,
                analogy: fallbackObj.analogy
            };
        }

        // Cache the loaded fields onto the active question object to optimize toggles and navigation
        q.loadedQuestion = parsedContent.question;
        q.loadedAnswer = parsedContent.answer;
        q.loadedCode = parsedContent.code;
        q.loadedAnalogy = parsedContent.analogy;
        
        // If question title in original list was empty, enrich it dynamically
        if (!q.question) {
            q.question = parsedContent.question.split('\n')[0].replace(/[#*`]/g, '').trim();
            buildSidebarList();
        }
    }

    // Render Markdown Question Content
    questionTextEl.innerHTML = marked.parse(q.loadedQuestion || "No question content.");

    // Display code section if Java source is present
    const codeSec = document.getElementById('code-section');
    if (q.loadedCode && q.loadedCode.trim() !== '') {
        codeSec.classList.remove('hidden');
        const codeContent = document.getElementById('code-content');
        codeContent.textContent = q.loadedCode;
        codeContent.removeAttribute('data-highlighted');
        hljs.highlightElement(codeContent);
    } else {
        codeSec.classList.add('hidden');
    }

    // Manage navigation boundaries
    if (isMockMode) {
        document.getElementById('btn-prev').disabled = true; // disable prev in mock
        document.getElementById('btn-next').disabled = true; // disable next in mock (controlled by evaluation)
    } else {
        document.getElementById('btn-prev').disabled = index === 0;
        document.getElementById('btn-next').disabled = index === filteredQuestions.length - 1;
    }
}

// Synch flag/mastered active buttons styling state
function syncActionButtons(activeId) {
    const isFlagged = flaggedIds.includes(activeId);
    const flagBtn = document.getElementById('flag-btn');
    if (isFlagged) {
        flagBtn.classList.add('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
        flagBtn.classList.remove('text-slate-400');
    } else {
        flagBtn.classList.remove('bg-amber-500/10', 'text-amber-500', 'border-amber-500/30');
        flagBtn.classList.add('text-slate-400');
    }

    const isMastered = masteredIds.includes(activeId);
    const masteredBtn = document.getElementById('mastered-btn');
    if (isMastered) {
        masteredBtn.classList.add('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
        masteredBtn.classList.remove('text-slate-400');
    } else {
        masteredBtn.classList.remove('bg-emerald-500/10', 'text-emerald-500', 'border-emerald-500/30');
        masteredBtn.classList.add('text-slate-400');
    }
}

// Render empty layout inside questions wrapper
function renderNoQuestionsFoundState() {
    const card = document.getElementById('main-content-card');
    card.innerHTML = `
        <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div class="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4 text-2xl">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Nothing Found</h3>
            <p class="text-sm text-slate-400 max-w-sm">Reset filters to see the full list of preparation questions.</p>
            <button id="btn-empty-reset"  class="mt-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all">
                Reset фильтры
            </button>
        </div>
    `;
    setTimeout(() => {
        const resetBtn = document.getElementById('btn-empty-reset');
        if (resetBtn) resetBtn.addEventListener('click', clearAllFilters);
    }, 0);
}

// Trigger non-intrusive beautiful toast notification message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const msgSpan = document.getElementById('toast-message');

    msgSpan.textContent = message;

    if (type === 'success') {
        icon.className = "fa-solid fa-circle-check text-emerald-500";
    } else if (type === 'bookmark') {
        icon.className = "fa-solid fa-bookmark text-amber-500";
    } else {
        icon.className = "fa-solid fa-info-circle text-blue-500";
    }

    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 2500);
}

// Mock Interview Engine State
let isMockMode = false;
let mockQuestions = [];
let mockCurrentIdx = 0;
let mockTimerInterval = null;
let mockTimeRemaining = 0;
let mockScores = [];
let mockSelectedGrade = 'Junior';
let mockSelectedCompany = 'Any';

function openMockSetup() {
    document.getElementById('mock-setup-modal').classList.remove('hidden');
}

function closeMockSetup() {
    document.getElementById('mock-setup-modal').classList.add('hidden');
}

function startMockInterview() {
    const timeLimit = parseInt(document.getElementById('mock-time-select').value, 10);
    
    // Pool filtering based on target grade
    let candidatePool = questionsList.filter(q => {
        if (mockSelectedGrade === 'Junior') return q.difficulty === 'Junior' || q.difficulty === 'Middle';
        if (mockSelectedGrade === 'Middle') return q.difficulty === 'Middle' || q.difficulty === 'Senior' || q.difficulty === 'Junior';
        return q.difficulty === 'Senior' || q.difficulty === 'Middle';
    });

    // Pool filtering based on target company
    if (mockSelectedCompany !== 'Any') {
        const companyProfiles = {
            'Bank': ['multithreading', 'memory', 'databases', 'jvm', 'spring-core'],
            'Outsource': ['oop', 'patterns', 'stream-api', 'collections', 'solid', 'exceptions', 'spring-mvc'],
            'BigTech': ['system-design', 'jvm', 'memory', 'multithreading', 'collections', 'high-load'],
            'Startup': ['spring-boot', 'stream-api', 'databases', 'collections', 'patterns', 'rest']
        };
        const preferredTags = companyProfiles[mockSelectedCompany] || [];
        
        let filteredByCompany = candidatePool.filter(q => {
            if (!q.tags) return false;
            return q.tags.some(tag => preferredTags.includes(tag.toLowerCase()));
        });
        
        let targetCount = mockSelectedGrade === 'Senior' ? 15 : (mockSelectedGrade === 'Middle' ? 12 : 10);
        // Fallback: If strict company filter produces too few questions, pad with general pool
        if (filteredByCompany.length < targetCount) {
            const needed = targetCount - filteredByCompany.length;
            const remaining = candidatePool.filter(q => !filteredByCompany.includes(q));
            // Simple shuffle for remaining
            for (let i = remaining.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
            }
            filteredByCompany = [...filteredByCompany, ...remaining.slice(0, needed)];
        }
        candidatePool = filteredByCompany;
    }

    if (candidatePool.length === 0) candidatePool = [...questionsList];

    // Shuffle pool (Fisher-Yates)
    for (let i = candidatePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
    }

    // Target question count: Junior: 10, Middle: 12, Senior: 15
    let targetCount = 10;
    if (mockSelectedGrade === 'Middle') targetCount = 12;
    if (mockSelectedGrade === 'Senior') targetCount = 15;

    mockQuestions = candidatePool.slice(0, Math.min(targetCount, candidatePool.length));
    mockCurrentIdx = 0;
    mockScores = [];
    isMockMode = true;

    // Timer setup
    if (mockTimerInterval) clearInterval(mockTimerInterval);
    if (timeLimit > 0) {
        mockTimeRemaining = timeLimit * 60;
        updateMockTimerDisplay();
        mockTimerInterval = setInterval(() => {
            mockTimeRemaining--;
            updateMockTimerDisplay();
            if (mockTimeRemaining <= 0) {
                clearInterval(mockTimerInterval);
                showToast("Time's up! Submitting interview...", "info");
                finishMockInterview();
            }
        }, 1000);
    } else {
        document.getElementById('mock-timer-display').textContent = "Untimed";
    }

    closeMockSetup();
    document.getElementById('mock-status-bar').classList.remove('hidden');
    loadMockQuestion(0);
    showToast(`Mock Interview Started (${mockQuestions.length} Questions)`, "success");
}

function updateMockTimerDisplay() {
    const mins = Math.floor(mockTimeRemaining / 60);
    const secs = mockTimeRemaining % 60;
    document.getElementById('mock-timer-display').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function loadMockQuestion(idx) {
    if (idx < 0 || idx >= mockQuestions.length) return;
    mockCurrentIdx = idx;
    const q = mockQuestions[idx];
    
    await loadQuestion(q);
    
    // Adjust UI for mock
    document.getElementById('counter').textContent = `Mock: ${idx + 1} / ${mockQuestions.length}`;
    document.getElementById('mock-eval-bar').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.remove('flex');
    document.getElementById('btn-answer').classList.remove('hidden');
}

function renderAnswerContent() {
    let q;
    if (isMockMode) {
        q = mockQuestions[mockCurrentIdx];
    } else {
        if (filteredQuestions.length === 0) return;
        q = filteredQuestions[currentIndex];
    }
    isAnswerVisible = true;
    
    const answerSection = document.getElementById('answer-section');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');

    answerSection.classList.remove('hidden');
    document.getElementById('answer-content').innerHTML = marked.parse(q.loadedAnswer || "No answer content.");

    // Populate intuitive analogy if defined
    const analogySec = document.getElementById('analogy-subsection');
    if (q.loadedAnalogy && q.loadedAnalogy.trim() !== '') {
        analogySec.classList.remove('hidden');
        document.getElementById('analogy-content').textContent = q.loadedAnalogy;
    } else {
        analogySec.classList.add('hidden');
    }

    if (ansBtnText) ansBtnText.textContent = "Hide Answer";
    if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye-slash";
}

function hideAnswerSection() {
    isAnswerVisible = false;
    const answerSection = document.getElementById('answer-section');
    const ansBtnText = document.getElementById('btn-answer-text');
    const ansBtnIcon = document.getElementById('btn-answer-icon');

    answerSection.classList.add('hidden');
    if (ansBtnText) ansBtnText.textContent = "Show Answer";
    if (ansBtnIcon) ansBtnIcon.className = "fa-solid fa-eye";
}

function revealMockAnswer() {
    renderAnswerContent();
    document.getElementById('btn-answer').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.remove('hidden');
    document.getElementById('mock-eval-bar').classList.add('flex');
}

function evaluateMockQuestion(points) {
    const currentQ = mockQuestions[mockCurrentIdx];
    mockScores.push({
        id: currentQ.id,
        topic: currentQ.topic,
        points: points
    });

    if (points === 10 && !masteredIds.includes(currentQ.id)) {
        masteredIds.push(currentQ.id);
        savePersistence();
    }

    if (mockCurrentIdx + 1 < mockQuestions.length) {
        loadMockQuestion(mockCurrentIdx + 1);
    } else {
        finishMockInterview();
    }
}

function finishMockInterview() {
    if (mockTimerInterval) clearInterval(mockTimerInterval);
    isMockMode = false;
    
    document.getElementById('mock-status-bar').classList.add('hidden');
    document.getElementById('mock-eval-bar').classList.add('hidden');
    document.getElementById('btn-answer').classList.remove('hidden');

    // Calculate results
    const totalQuestions = mockQuestions.length;
    const maxPossibleXP = totalQuestions * 10;
    const totalEarnedXP = mockScores.reduce((acc, curr) => acc + curr.points, 0);
    const scorePercent = maxPossibleXP > 0 ? Math.round((totalEarnedXP / maxPossibleXP) * 100) : 0;

    document.getElementById('mock-result-score').textContent = `${scorePercent}%`;
    document.getElementById('mock-result-xp').textContent = `+${totalEarnedXP} XP`;

    let verdict = "PASSED";
    let verdictColor = "text-emerald-500";
    let badgeIcon = '<i class="fa-solid fa-trophy"></i>';
    let badgeBg = "bg-emerald-500/10 text-emerald-500";

    if (scorePercent < 50) {
        verdict = "NEEDS WORK";
        verdictColor = "text-red-500";
        badgeIcon = '<i class="fa-solid fa-book-open"></i>';
        badgeBg = "bg-red-500/10 text-red-500";
    } else if (scorePercent < 75) {
        verdict = "PARTIAL PASS";
        verdictColor = "text-amber-500";
        badgeIcon = '<i class="fa-solid fa-award"></i>';
        badgeBg = "bg-amber-500/10 text-amber-500";
    }

    document.getElementById('mock-result-verdict').textContent = verdict;
    document.getElementById('mock-result-verdict').className = `text-xs font-bold ${verdictColor} block mt-1`;
    
    const badgeEl = document.getElementById('mock-result-badge-icon');
    badgeEl.className = `w-16 h-16 rounded-2xl ${badgeBg} flex items-center justify-center text-3xl mx-auto`;
    badgeEl.innerHTML = badgeIcon;

    // Topic Breakdown
    const topicStats = {};
    mockScores.forEach(s => {
        const topic = s.topic || "General";
        if (!topicStats[topic]) topicStats[topic] = { earned: 0, total: 0 };
        topicStats[topic].earned += s.points;
        topicStats[topic].total += 10;
    });

    const topicsContainer = document.getElementById('mock-result-topics');
    topicsContainer.innerHTML = '';

    Object.keys(topicStats).forEach(topic => {
        const stat = topicStats[topic];
        const pct = Math.round((stat.earned / stat.total) * 100);
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs";
        row.innerHTML = `
            <span class="font-semibold text-slate-700 dark:text-slate-300">${topic}</span>
            <span class="font-bold ${pct >= 70 ? 'text-emerald-500' : 'text-amber-500'}">${pct}% (${stat.earned}/${stat.total} XP)</span>
        `;
        topicsContainer.appendChild(row);
    });

    document.getElementById('mock-results-modal').classList.remove('hidden');
    triggerFilterAction();
}

function exitMockInterview() {
    if (confirm("Are you sure you want to exit the active Mock Interview? Progress will be lost.")) {
        if (mockTimerInterval) clearInterval(mockTimerInterval);
        isMockMode = false;
        document.getElementById('mock-status-bar').classList.add('hidden');
        document.getElementById('mock-eval-bar').classList.add('hidden');
        document.getElementById('btn-answer').classList.remove('hidden');
        triggerFilterAction();
        showToast("Mock Interview cancelled", "info");
    }
}


// --- stats.js ---
// Helper function to map topics to icons and gradients
function getTopicStyles(topic) {
    const t = topic.toLowerCase();
    if (t.includes('jvm') || t.includes('memory')) return { icon: 'fa-server', gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' };
    if (t.includes('spring') || t.includes('boot')) return { icon: 'fa-leaf', gradient: 'from-emerald-400 to-green-500', shadow: 'shadow-emerald-500/20' };
    if (t.includes('multithreading') || t.includes('concurrency')) return { icon: 'fa-network-wired', gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/20' };
    if (t.includes('oop') || t.includes('object')) return { icon: 'fa-cubes', gradient: 'from-purple-500 to-fuchsia-500', shadow: 'shadow-purple-500/20' };
    if (t.includes('pattern') || t.includes('design')) return { icon: 'fa-puzzle-piece', gradient: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20' };
    if (t.includes('stream') || t.includes('api')) return { icon: 'fa-water', gradient: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-500/20' };
    if (t.includes('collection')) return { icon: 'fa-layer-group', gradient: 'from-teal-400 to-emerald-500', shadow: 'shadow-teal-500/20' };
    if (t.includes('testing') || t.includes('junit')) return { icon: 'fa-vial', gradient: 'from-red-400 to-rose-500', shadow: 'shadow-red-500/20' };
    if (t.includes('database') || t.includes('sql')) return { icon: 'fa-database', gradient: 'from-indigo-400 to-purple-500', shadow: 'shadow-indigo-500/20' };
    if (t.includes('system') || t.includes('design')) return { icon: 'fa-sitemap', gradient: 'from-violet-500 to-fuchsia-600', shadow: 'shadow-violet-500/20' };
    
    // Default
    return { icon: 'fa-code', gradient: 'from-slate-400 to-slate-500', shadow: 'shadow-slate-500/20' };
}

function updateStatsDashboard() {
    const container = document.getElementById('stats-topics-container');
    if (!container) return;
    
    if (questionsList.length === 0) {
        container.innerHTML = '<div class="text-slate-400 text-center py-8 col-span-full">Нет данных для статистики.</div>';
        return;
    }

    // Group questions by topic
    const topicStats = {};
    
    questionsList.forEach(q => {
        const topic = q.topic || "Остальное";
        if (!topicStats[topic]) {
            topicStats[topic] = { total: 0, mastered: 0 };
        }
        topicStats[topic].total++;
        if (masteredIds.includes(q.id)) {
            topicStats[topic].mastered++;
        }
    });

    // Sort topics by total questions descending
    const sortedTopics = Object.keys(topicStats).sort((a, b) => topicStats[b].total - topicStats[a].total);

    container.innerHTML = '';
    
    let totalMastered = 0;
    
    sortedTopics.forEach(topic => {
        const stats = topicStats[topic];
        totalMastered += stats.mastered;
        const percent = Math.round((stats.mastered / stats.total) * 100);
        
        const styles = getTopicStyles(topic);
        
        // Define card structure
        const card = document.createElement('div');
        // Glassmorphism styling with subtle border and hover glow
        card.className = "group relative bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden";
        
        card.innerHTML = `
            <!-- Background Glow Effect on Hover -->
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${styles.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            
            <div class="relative z-10 flex items-start space-x-4 mb-4">
                <div class="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${styles.gradient} shadow-lg ${styles.shadow} flex items-center justify-center text-white text-xl">
                    <i class="fa-solid ${styles.icon}"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 dark:text-white truncate" title="${topic}">${topic}</h4>
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        <span class="text-slate-700 dark:text-slate-300">${stats.mastered}</span> / ${stats.total} Mastered
                    </p>
                </div>
                <div class="font-black text-lg text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-400 transition-colors">
                    ${percent}%
                </div>
            </div>
            
            <div class="relative z-10 w-full bg-slate-100 dark:bg-slate-900/80 rounded-full h-2.5 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
                <div class="bg-gradient-to-r ${styles.gradient} h-full rounded-full transition-all duration-1000 ease-out shadow-sm" style="width: 0%"></div>
            </div>
        `;
        
        container.appendChild(card);

        // Animate the bar width after appending
        setTimeout(() => {
            const bar = card.querySelector('div.bg-gradient-to-r');
            if (bar) bar.style.width = `${percent}%`;
        }, 50);
    });

    // Overall summary header
    const overallPercent = Math.round((totalMastered / questionsList.length) * 100);
    const summary = document.getElementById('stats-summary-cards');
    if (summary) {
        summary.innerHTML = `
            <div class="relative overflow-hidden bg-gradient-to-br from-brand-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl shadow-brand-500/20 col-span-full flex flex-col md:flex-row items-center justify-between">
                <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 blur-2xl rounded-full"></div>
                <div class="absolute -left-10 -top-10 w-32 h-32 bg-brand-400/20 blur-xl rounded-full"></div>
                
                <div class="relative z-10 flex items-center space-x-6">
                    <div class="w-20 h-20 shrink-0 relative flex items-center justify-center">
                        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-white/20" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="text-white drop-shadow-md" stroke-width="3" stroke-dasharray="${overallPercent}, 100" stroke="currentColor" fill="none" stroke-linecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center font-bold text-xl">${overallPercent}%</div>
                    </div>
                    <div>
                        <h3 class="text-brand-100 font-semibold tracking-wide uppercase text-sm mb-1">Overall Progress</h3>
                        <div class="text-3xl font-extrabold">${totalMastered} <span class="text-lg font-medium text-brand-200">/ ${questionsList.length}</span></div>
                    </div>
                </div>
                
                <div class="relative z-10 mt-6 md:mt-0 text-right">
                    <p class="text-brand-100 max-w-xs text-sm">You are making great progress! Focus on your weakest topics to level up faster.</p>
                </div>
            </div>
        `;
    }
}


// --- adaptive.js ---
window.isAdaptivePlanActive = false;

window.checkAdaptiveProgression = function() {
    if (!window.isAdaptivePlanActive) return;
    
    // Find next unmastered
    const nextQ = filteredQuestions.find(q => !masteredIds.includes(q.id));
    if (nextQ) {
        // Load next
        if(typeof loadQuestion === 'function') {
            const idx = filteredQuestions.indexOf(nextQ);
            if (idx !== -1) {
                currentIndex = idx;
                loadQuestion(idx);
            }
            if(typeof buildSidebarList === 'function') buildSidebarList();
        }
    } else {
        // Plan complete!
        window.isAdaptivePlanActive = false;
        document.getElementById('my-roadmap-btn').classList.add('hidden');
        document.getElementById('my-roadmap-btn').classList.remove('flex');
        
        // Reset search filter
        document.getElementById('search-input').value = "";
        if(typeof triggerFilterAction === 'function') triggerFilterAction();
        
        // Show success modal
        const successModal = document.getElementById('adaptive-success-modal');
        if (successModal) {
            successModal.classList.remove('hidden');
            successModal.style.display = 'flex';
            setTimeout(() => successModal.classList.remove('opacity-0', 'scale-95'), 10);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const adaptiveBtn = document.getElementById('adaptive-btn');
    const modal = document.getElementById('adaptive-modal');
    const closeBtn = document.getElementById('close-adaptive-modal');
    
    const step1 = document.getElementById('adaptive-step-1');
    const step2 = document.getElementById('adaptive-step-2');
    const step3 = document.getElementById('adaptive-step-3');
    
    const levelBtns = document.querySelectorAll('.level-select-btn');
    const applyPlanBtn = document.getElementById('apply-adaptive-plan');
    
    const roadmapModal = document.getElementById('adaptive-roadmap-modal');
    const closeRoadmapBtn = document.getElementById('close-roadmap-modal');
    const roadmapContent = document.getElementById('roadmap-content');
    const myRoadmapBtn = document.getElementById('my-roadmap-btn');
    
    const successModal = document.getElementById('adaptive-success-modal');
    const closeSuccessBtn = document.getElementById('close-success-modal');
    
    let quizData = [];
    let currentQuizIndex = 0;
    let selectedLevel = 'Middle';
    let failedTags = new Set();
    
    // Load quiz data
    async function loadQuizData() {
        try {
            const res = await fetch('quiz.json?t=' + new Date().getTime());
            quizData = await res.json();
            quizData.sort(() => Math.random() - 0.5);
        } catch (e) {
            console.error("Failed to load quiz.json", e);
        }
    }
    
    if (adaptiveBtn) {
        adaptiveBtn.addEventListener('click', async () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            step1.classList.remove('hidden');
            step2.classList.add('hidden');
            step3.classList.add('hidden');
            failedTags.clear();
            currentQuizIndex = 0;
            if (quizData.length === 0) await loadQuizData();
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }
    
    if (closeRoadmapBtn) {
        closeRoadmapBtn.addEventListener('click', () => {
            roadmapModal.classList.add('opacity-0');
            setTimeout(() => {
                roadmapModal.classList.add('hidden');
                roadmapModal.style.display = '';
            }, 300);
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', () => {
            successModal.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                successModal.classList.add('hidden');
                successModal.style.display = '';
            }, 300);
        });
    }
    
    if (myRoadmapBtn) {
        myRoadmapBtn.addEventListener('click', () => {
            console.log("My Roadmap button clicked!");
            try {
                if (typeof window.renderRoadmap === 'function') {
                    window.renderRoadmap();
                }
                if (roadmapModal) {
                    roadmapModal.classList.remove('hidden');
                    roadmapModal.style.display = 'flex'; // Ensure it's treated as flex
                    setTimeout(() => roadmapModal.classList.remove('opacity-0'), 10);
                } else {
                    console.error("roadmapModal not found!");
                }
            } catch (err) {
                console.error("Error in myRoadmapBtn click:", err);
            }
        });
    }
    
    levelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedLevel = e.target.getAttribute('data-level');
            document.getElementById('quiz-level-badge').innerText = selectedLevel;
            step1.classList.add('hidden');
            step2.classList.remove('hidden');
            renderQuizQuestion();
        });
    });
    
    function renderQuizQuestion() {
        if (currentQuizIndex >= quizData.length) {
            finishQuiz();
            return;
        }
        const q = quizData[currentQuizIndex];
        document.getElementById('quiz-progress-text').innerText = `Question ${currentQuizIndex + 1} of ${quizData.length}`;
        document.getElementById('quiz-progress-bar').style.width = `${((currentQuizIndex) / quizData.length) * 100}%`;
        document.getElementById('quiz-question-text').innerText = q.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = "w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300";
            btn.innerText = opt;
            btn.addEventListener('click', () => {
                if (idx !== q.correctIndex) q.testedTags.forEach(tag => failedTags.add(tag));
                currentQuizIndex++;
                renderQuizQuestion();
            });
            optionsContainer.appendChild(btn);
        });
    }
    
    function finishQuiz() {
        step2.classList.add('hidden');
        step3.classList.remove('hidden');
        let msg = "Excellent result! You have almost no knowledge gaps.";
        if (failedTags.size > 0) {
            msg = `We found knowledge gaps in the following topics: ${Array.from(failedTags).join(', ')}. Your plan is ready!`;
        }
        document.getElementById('quiz-results-text').innerText = msg;
    }
    
    window.renderRoadmap = function() {
        try {
            if (!roadmapContent) return;
            roadmapContent.innerHTML = '';
            
            // Check if filteredQuestions is accessible
            const questions = typeof filteredQuestions !== 'undefined' ? filteredQuestions : [];
            if (!questions || questions.length === 0) {
                roadmapContent.innerHTML = '<p class="text-slate-500">Your roadmap is empty.</p>';
                return;
            }
            
            const mArray = (typeof masteredIds !== 'undefined' && Array.isArray(masteredIds)) ? masteredIds : [];
            
            // Group by topic
            const grouped = {};
            questions.forEach(q => {
                const topic = q.topic || 'General';
                if (!grouped[topic]) grouped[topic] = [];
                grouped[topic].push(q);
            });
            
            for (const [topic, qList] of Object.entries(grouped)) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'mb-8';
                
                const groupTitle = document.createElement('h3');
                groupTitle.className = 'text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2';
                groupTitle.innerHTML = `<i class="fa-solid fa-folder-open text-amber-500"></i><span>${topic}</span><span class="text-sm font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">${qList.length}</span>`;
                groupDiv.appendChild(groupTitle);
                
                const listDiv = document.createElement('div');
                listDiv.className = 'space-y-3';
                
                qList.forEach(q => {
                    const isMastered = mArray.includes(q.id);
                    const qDiv = document.createElement('div');
                    qDiv.className = `p-4 rounded-xl border flex justify-between items-center transition-all ${isMastered ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-brand-500/30 hover:shadow-md'}`;
                    
                    const left = document.createElement('div');
                    left.className = 'flex items-center space-x-3';
                    if (isMastered) {
                        left.innerHTML = `<div class="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-check"></i></div>`;
                    } else {
                        left.innerHTML = `<div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 flex items-center justify-center shrink-0"><i class="fa-solid fa-book"></i></div>`;
                    }
                    
                    const title = document.createElement('div');
                    title.className = `font-semibold ${isMastered ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-70' : 'text-slate-800 dark:text-slate-200'}`;
                    const qText = q.question || 'Question';
                    title.innerText = q.id + ': ' + (qText.length > 60 ? qText.substring(0,60)+'...' : qText);
                    left.appendChild(title);
                    
                    const right = document.createElement('div');
                    if (!isMastered) {
                        const studyBtn = document.createElement('button');
                        studyBtn.className = 'px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors';
                        studyBtn.innerText = 'Study Now';
                        studyBtn.onclick = () => {
                            if (roadmapModal) {
                                roadmapModal.classList.add('opacity-0');
                                setTimeout(() => {
                                    roadmapModal.classList.add('hidden');
                                    roadmapModal.style.display = ''; // Clear inline style
                                }, 300);
                            }
                            if (typeof loadQuestion === 'function') {
                                const idx = window.filteredQuestions ? window.filteredQuestions.indexOf(q) : (typeof filteredQuestions !== 'undefined' ? filteredQuestions.indexOf(q) : -1);
                                if (idx !== -1) {
                                    if (typeof currentIndex !== 'undefined') currentIndex = idx;
                                    loadQuestion(idx);
                                }
                                if(typeof buildSidebarList === 'function') buildSidebarList();
                            }
                        };
                        right.appendChild(studyBtn);
                    } else {
                        const doneSpan = document.createElement('span');
                        doneSpan.className = 'text-emerald-500 font-bold text-sm px-4 py-2';
                        doneSpan.innerText = 'Done';
                        right.appendChild(doneSpan);
                    }
                    
                    qDiv.appendChild(left);
                    qDiv.appendChild(right);
                    listDiv.appendChild(qDiv);
                });
                
                groupDiv.appendChild(listDiv);
                roadmapContent.appendChild(groupDiv);
            }
        } catch (err) {
            console.error("Roadmap Render Error:", err);
            if (roadmapContent) roadmapContent.innerHTML = `<p class="text-rose-500 p-4">Error loading roadmap: ${err.message}</p>`;
        }
    };
    
    if (applyPlanBtn) {
        applyPlanBtn.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
            
            if (typeof questionsList !== 'undefined') {
                const diffSelect = document.querySelector(`.diff-chip[data-diff="${selectedLevel}"]`);
                if(diffSelect && typeof toggleDifficulty === 'function') {
                    document.querySelectorAll('.diff-chip').forEach(c => c.classList.remove('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard'));
                    if (typeof selectedDifficulties !== 'undefined') {
                        selectedDifficulties.clear();
                        selectedDifficulties.add(selectedLevel);
                    }
                    const isJunior = selectedLevel === 'Junior';
                    const isMiddle = selectedLevel === 'Middle';
                    diffSelect.classList.add('ring-2', 'ring-offset-2', 'ring-offset-white', 'dark:ring-offset-darkCard', 
                        isJunior ? 'ring-emerald-500' : isMiddle ? 'ring-amber-500' : 'ring-rose-500');
                }
                
                filteredQuestions = questionsList.filter(q => {
                    const matchDiff = q.difficulty === selectedLevel || (q.difficulty === 'All');
                    if (failedTags.size === 0) return matchDiff;
                    if (!q.tags || q.tags.length === 0) return false;
                    const hasFailedTag = q.tags.some(tag => failedTags.has(tag));
                    return matchDiff && hasFailedTag;
                });
                
                if (filteredQuestions.length > 0) {
                    window.isAdaptivePlanActive = true;
                    
                    // Show My Roadmap button
                    myRoadmapBtn.classList.remove('hidden');
                    myRoadmapBtn.classList.add('flex');
                    
                    // Show roadmap modal
                    if (typeof window.renderRoadmap === 'function') {
                        window.renderRoadmap();
                    }
                    if (roadmapModal) {
                        roadmapModal.classList.remove('hidden');
                        roadmapModal.style.display = 'flex';
                        setTimeout(() => roadmapModal.classList.remove('opacity-0'), 10);
                    }
                    
                    if (typeof buildSidebarList === 'function') buildSidebarList();
                    document.getElementById('search-input').value = `[Adaptive Plan] Tags: ${Array.from(failedTags).join(',')}`;
                    
                    // Auto-load first unmastered
                    checkAdaptiveProgression();
                } else {
                    const successModal = document.getElementById('adaptive-success-modal');
                    if (successModal) {
                        successModal.classList.remove('hidden');
                        setTimeout(() => successModal.classList.remove('opacity-0', 'scale-95'), 10);
                    }
                }
            }
        });
    }
});


// --- app.js ---
// Initialize and load dynamic questions indexes
async function fetchQuestions() {
    try {
        // Try fetching index.json dynamically.
        const response = await fetch('index.json');
        if (!response.ok) throw new Error("Index file not found");
        const data = await response.json();
        
        if (data && data.questions && data.questions.length > 0) {
            questionsList = data.questions;
        } else {
            questionsList = [...fallbackDatabase];
        }
    } catch (err) {
        console.log("Using rich embedded fallback database.");
        questionsList = [...fallbackDatabase];
    }

    filteredQuestions = [...questionsList];
    loadPersistence();
    buildSidebarList();
    await loadQuestion(0);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Load and initialize core engine
    fetchQuestions();

    // Mock Interview listeners
    const mockInterviewBtn = document.getElementById('mock-interview-btn');
    if (mockInterviewBtn) mockInterviewBtn.addEventListener("click", openMockSetup);
    
    const closeMockSetupBtn = document.getElementById('close-mock-setup-btn');
    if (closeMockSetupBtn) closeMockSetupBtn.addEventListener("click", closeMockSetup);
    
    const startMockBtn = document.getElementById('start-mock-btn');
    if (startMockBtn) startMockBtn.addEventListener("click", startMockInterview);
    
    const exitMockBtn = document.getElementById('exit-mock-btn');
    if (exitMockBtn) exitMockBtn.addEventListener("click", exitMockInterview);
    
    const finishMockBtn = document.getElementById('finish-mock-btn');
    if (finishMockBtn) finishMockBtn.onclick = () => {
        document.getElementById('mock-results-modal').classList.add('hidden');
    };

    // Grade selection buttons inside setup modal
    document.querySelectorAll('.mock-grade-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.mock-grade-btn').forEach(b => {
                b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
                b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
            mockSelectedGrade = btn.getAttribute('data-mock-grade');
        };
    });

    // Company selection buttons inside setup modal
    document.querySelectorAll('.mock-company-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.mock-company-btn').forEach(b => {
                b.classList.remove('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
                b.classList.add('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            });
            btn.classList.remove('border-slate-200', 'dark:border-slate-800', 'text-slate-600', 'dark:text-slate-400');
            btn.classList.add('bg-brand-500/10', 'border-brand-500', 'text-brand-600', 'dark:text-brand-400');
            mockSelectedCompany = btn.getAttribute('data-mock-company');
        };
    });

    // Evaluation buttons
    const evalMissedBtn = document.getElementById('eval-missed-btn');
    if (evalMissedBtn) evalMissedBtn.addEventListener("click", () => evaluateMockQuestion(0));
    
    const evalPartialBtn = document.getElementById('eval-partial-btn');
    if (evalPartialBtn) evalPartialBtn.addEventListener("click", () => evaluateMockQuestion(5));
    
    const evalNailedBtn = document.getElementById('eval-nailed-btn');
    if (evalNailedBtn) evalNailedBtn.addEventListener("click", () => evaluateMockQuestion(10));

    // Toggle Answer actions event triggers
    const btnAnswer = document.getElementById('btn-answer');
    if (btnAnswer) {
        btnAnswer.onclick = () => {
            if (isMockMode) {
                revealMockAnswer();
                return;
            }
            if (isAnswerVisible) {
                hideAnswerSection();
            } else {
                renderAnswerContent();
            }
        };
    }

    // Previous and Next button actions
    const btnPrev = document.getElementById('btn-prev');
    if (btnPrev) {
        btnPrev.onclick = async () => {
            if (currentIndex > 0) {
                currentIndex--;
                isAnswerVisible = false;
                await loadQuestion(currentIndex);
                buildSidebarList();
            }
        };
    }

    const btnNext = document.getElementById('btn-next');
    if (btnNext) {
        btnNext.onclick = async () => {
            if (currentIndex < filteredQuestions.length - 1) {
                currentIndex++;
                isAnswerVisible = false;
                await loadQuestion(currentIndex);
                buildSidebarList();
            }
        };
    }

    // Flag / Bookmark toggling
    const flagBtn = document.getElementById('flag-btn');
    if (flagBtn) {
        flagBtn.onclick = () => {
            if (filteredQuestions.length === 0) return;
            const activeId = filteredQuestions[currentIndex].id;
            const idx = flaggedIds.indexOf(activeId);

            if (idx > -1) {
                flaggedIds.splice(idx, 1);
                showToast("Removed from bookmarks", "info");
            } else {
                flaggedIds.push(activeId);
                showToast("Added to bookmarks!", "bookmark");
            }
            
            savePersistence();
            syncActionButtons(activeId);
            buildSidebarList();
        };
    }

    // Mastered toggle trigger
    const masteredBtn = document.getElementById('mastered-btn');
    if (masteredBtn) {
        masteredBtn.onclick = () => {
            if (filteredQuestions.length === 0) return;
            const activeId = filteredQuestions[currentIndex].id;
            const idx = masteredIds.indexOf(activeId);

            if (idx > -1) {
                masteredIds.splice(idx, 1);
                showToast("Question возвращен к изучению", "info");
            } else {
                masteredIds.push(activeId);
                showToast("Congratulations! Marked as mastered 👍", "success");
            }

            savePersistence();
            syncActionButtons(activeId);
            buildSidebarList();
            
            // Adaptive Plan hook
            if (typeof checkAdaptiveProgression === 'function') {
                checkAdaptiveProgression();
            }
        };
    }

    // Filters updates triggers
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.oninput = debounce(triggerFilterAction, 200);
    
    const topicFilter = document.getElementById('topic-filter');
    if (topicFilter) topicFilter.onchange = triggerFilterAction;
    
    document.querySelectorAll('.format-checkbox').forEach(el => {
        el.onchange = triggerFilterAction;
    });

    // Difficulty chips actions handlers
    document.querySelectorAll('.diff-chip').forEach(el => {
        el.onclick = () => {
            const difficulty = el.getAttribute('data-diff');
            const idx = selectedDiffFilters.indexOf(difficulty);

            if (idx > -1) {
                selectedDiffFilters.splice(idx, 1);
                // Restore visual inactive style
                el.classList.remove('bg-brand-500', 'text-white', 'border-brand-500');
                if (difficulty === 'Junior') el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400');
                if (difficulty === 'Middle') el.classList.add('bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400');
                if (difficulty === 'Senior') el.classList.add('bg-purple-500/10', 'text-purple-600', 'dark:text-purple-400');
            } else {
                selectedDiffFilters.push(difficulty);
                // Render active highlight styles depending on selection
                el.classList.remove('bg-emerald-500/10', 'bg-blue-500/10', 'bg-purple-500/10', 'text-emerald-600', 'text-blue-600', 'text-purple-600', 'dark:text-emerald-400', 'dark:text-blue-400', 'dark:text-purple-400');
                el.classList.add('bg-brand-500', 'text-white', 'border-brand-500');
            }
            triggerFilterAction();
        };
    });

    // Clear filter actions Link
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) clearFiltersBtn.addEventListener("click", clearAllFilters);

    // Blitz random questions selection
    const blitzBtn = document.getElementById('blitz-btn');
    if (blitzBtn) {
        blitzBtn.onclick = async () => {
            if (questionsList.length === 0) return;
            const randomIdx = Math.floor(Math.random() * questionsList.length);
            
            // Clear any filters that would hide our random blitz choice
            clearAllFilters();
            
            // Find matching active cursor index
            currentIndex = filteredQuestions.findIndex(q => q.id === questionsList[randomIdx].id);
            isAnswerVisible = false;
            
            await loadQuestion(currentIndex);
            buildSidebarList();
            showToast("Режим блиц: Выбран случайный вопрос!", "info");
        };
    }

    // Copy source code to clipboards
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
        copyCodeBtn.onclick = () => {
            const codeText = document.getElementById('code-content').textContent;
            // Workaround context boundary copy restriction fallback
            const textarea = document.createElement('textarea');
            textarea.value = codeText;
            document.body.appendChild(textarea);
            textarea.select();
            navigator.clipboard.writeText(codeText).then(() => {
                showToast("Код успешно скопирован!", "success");
            }).catch(err => {
                showToast("Не удалось скопировать код", "info");
            });
            document.body.removeChild(textarea);
        };
    }

    // Theme toggle triggers
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            const isDark = document.documentElement.classList.toggle('dark');
            
            // Toggle Highlight styles
            document.getElementById('hljs-dark-theme').disabled = !isDark;
            document.getElementById('hljs-light-theme').disabled = isDark;

            showToast(isDark ? "Темная тема включена" : "Светлая тема включена", "info");
        };
    }

    // Setup Stats Modal
    const statsBtn = document.getElementById('my-stats-btn');
    const statsModal = document.getElementById('stats-dashboard-modal');
    const closeStatsBtn = document.getElementById('close-stats-modal');

    if (statsBtn && statsModal) {
        statsBtn.onclick = () => {
            if (typeof updateStatsDashboard === 'function') {
                updateStatsDashboard();
            }
            statsModal.classList.remove('hidden');
            statsModal.style.display = 'flex';
            setTimeout(() => statsModal.classList.remove('opacity-0'), 10);
        };
    }

    if (closeStatsBtn && statsModal) {
        closeStatsBtn.onclick = () => {
            statsModal.classList.add('opacity-0');
            setTimeout(() => {
                statsModal.classList.add('hidden');
                statsModal.style.display = '';
            }, 300);
        };
    }

    // Hotkeys Feature
    document.addEventListener('keydown', async (e) => {
        // Do not trigger hotkeys if user is typing in the search input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Skip hotkeys if any modal is open
        if (!document.getElementById('adaptive-modal').classList.contains('hidden') ||
            !document.getElementById('adaptive-roadmap-modal').classList.contains('hidden') ||
            (statsModal && !statsModal.classList.contains('hidden')) ||
            !document.getElementById('mock-setup-modal').classList.contains('hidden') ||
            !document.getElementById('mock-results-modal').classList.contains('hidden')) {
            return;
        }

        switch (e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (btnNext && !btnNext.disabled) btnNext.onclick();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (btnPrev && !btnPrev.disabled) btnPrev.onclick();
                break;
            case ' ': // Spacebar
                e.preventDefault();
                if (btnAnswer) btnAnswer.onclick();
                break;
            case 'm':
            case 'M':
            case 'ь': // Russian layout 'M'
            case 'Ь':
                e.preventDefault();
                if (masteredBtn) masteredBtn.onclick();
                break;
            case 'f':
            case 'F':
            case 'а': // Russian layout 'F'
            case 'А':
                e.preventDefault();
                if (flagBtn) flagBtn.onclick();
                break;
        }
    });

});


