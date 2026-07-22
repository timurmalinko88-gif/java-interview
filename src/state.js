export const state = {
    questionsList: [], filteredQuestions: [], currentIndex: 0, isAnswerVisible: false,
    masteredIds: [], flaggedIds: [], selectedDiffFilters: [],
    isMockMode: false, mockQuestions: [], mockCurrentIdx: 0, mockTimerInterval: null,
    mockTimeRemaining: 0, mockScores: [], mockSelectedGrade: 'Junior', mockSelectedCompany: 'Any',
    fallbackDatabase: [], quizData: [], currentQuizIndex: 0, selectedLevel: 'Middle', failedTags: new Set(),
    isAdaptivePlanActive: false,
    srData: {}
};
// --- state.js ---
const fallbackDatabase = [{
  "id": "jvm-001",
  "topic": "JVM & Memory Management",
  "difficulty": "Junior",
  "format": "Open Answer",
  "question": "Что такое Garbage Collector (GC) в Java и как он работает в общих чертах?",
  "code": "",
  "answer": "**Garbage Collector (GC)** — это компонент виртуальной машины Java (JVM), предназначенный для автоматического управления памятью (Heap).\n\n**Ключевые этапы работы сборщика мусора:**\n1. **Mark (Пометка):** GC сканирует память, начиная с корневых ссылок (GC Roots: стек потоков, статические переменные, системные классы). Все достижимые объекты помечаются как живые.\n2. **Sweep (Удаление):** Все непомеченные объекты в куче считаются мусором и удаляются. Освободившаяся память регистрируется как доступная.\n3. **Compact (Уплотнение):** Чтобы избежать фрагментации памяти, выжившие объекты сдвигаются ближе друг к другу. Это обеспечивает непрерывные блоки для будущих крупных объектов.",
  "analogy": "Сборщик мусора похож на уборщика в роскошном отеле. Гости (объекты) заселяются в номера (выделение памяти в куче). Когда гости уезжают навсегда (все ссылки на объект стерты), уборщик замечает, что в номере никого нет, выносит старые вещи и заправляет постель заново, подготавливая номер для новых жильцов."
}, {
  "id": "jvm-002",
  "topic": "JVM & Memory Management",
  "difficulty": "Junior",
  "format": "Code Review",
  "question": "Где будут распределены переменные из следующего Java фрагмента в памяти (Stack vs Heap)? Вызовет ли данный бесконечный цикл критическую ошибку OutOfMemoryError?",
  "code": "public class MemoryDemo {\n    public static void main(String[] args) {\n        int localVal = 42;\n        String text = \"Hello JVM\";\n        \n        while (true) {\n            List<Integer> list = new ArrayList<>();\n            list.add(localVal);\n        }\n    }\n}",
  "answer": "### Распределение в памяти:\n- `localVal` является локальным примитивом типа `int` и сохраняется непосредственно в **Stack Frame** (стек-кадре) метода `main` текущего потока.\n- `text` — локальная ссылка. Сама ссылка лежит в **Stack**, а текстовый литерал `\"Hello JVM\"` хранится в специальном пуле строк (String Pool), расположенном внутри **Heap** (кучи).\n- `list` — ссылка на список, хранится в **Stack**, в то время как объект `new ArrayList<>()` и все добавляемые обертки `Integer` размещаются в **Heap**.\n\n### Поведение бесконечного цикла:\nЭтот код **НЕ вызовет OutOfMemoryError**.\nНа каждой итерации цикла создается локальный объект списка `list`. В конце каждой итерации область видимости текущей переменной `list` завершается. На следующей итерации ссылка переопределяется. Ссылка на предыдущий объект списка теряется, делая его недостижимым из GC Roots. Сборщик мусора будет беспрепятственно очищать кучу на фоне работы цикла, предотвращая переполнение памяти. Тем не менее, такой цикл создаст высокую нагрузку на CPU из-за постоянного выделения и очистки короткоживущих объектов.",
  "analogy": "Представьте себе конвейерную ленту, на которой вы берете пластиковый стаканчик (ArrayList), наливаете туда воду, а затем выбрасываете его в мусорный бак перед тем, как взять следующий. Бак никогда не переполнится, если мусорщик вовремя его освобождает, хотя вы и совершаете массу лишних действий."
}, {
  "id": "jvm-003",
  "topic": "JVM & Memory Management",
  "difficulty": "Middle",
  "format": "Open Answer",
  "question": "В чем ключевые отличия между Strong, Weak, Soft и Phantom ссылками в Java?",
  "code": "",
  "answer": "В Java существуют разные уровни силы ссылок, помогающие GC гибко управлять памятью:\n\n1. **Strong Reference (Сильные):** \n   Обычные ссылки по умолчанию (например, `Object obj = new Object()`). GC **никогда** не удалит объект, на который ведет хотя бы одна сильная ссылка, даже если памяти критически не хватает.\n\n2. **Soft Reference (Мягкие):**\n   Обертка `SoftReference<T>`. Объект удаляется GC **только при нехватке памяти** на куче (перед выбросом OOM). Идеально для построения простых кешей изображений или тяжелых данных.\n\n3. **Weak Reference (Слабые):**\n   Обертка `WeakReference<T>`. Объект удаляется GC при **ближайшей сборке мусора**, независимо от того, сколько свободной памяти есть вокруг. Полезно для ассоциативных маппингов (например, `WeakHashMap`).\n\n4. **Phantom Reference (Фантомные):**\n   Обертка `PhantomReference<T>`. Получить объект через метод `.get()` всегда возвращает `null`. Используется исключительно для отслеживания момента физического уничтожения объекта и тонкой очистки ресурсов вне кучи (вместо устаревшего `finalize()`).",
  "analogy": "Strong — железобетонный канат (держит намертво). Soft — прочная резиновая лента (держит, но растягивается и рвется, если тянуть слишком сильно из-за нехватки ресурсов). Weak — тонкая паутинка (рвется от легкого ветерка сборщика мусора). Phantom — тень покойного (объекта уже нет, но запись о том, что он ушел, осталась в системе регистрации)."
}, {
  "id": "multithreading-001",
  "topic": "Multithreading",
  "difficulty": "Junior",
  "format": "Open Answer",
  "question": "Зачем нужно ключевое слово volatile в Java и какие проблемы конкурентного доступа оно решает?",
  "code": "",
  "answer": "Ключевое слово `volatile` применяется к переменным и гарантирует:\n1. **Видимость (Visibility):** Чтение и запись переменной происходят непосредственно в основную оперативную память (RAM), минуя локальные кэши ядер процессоров (L1/L2/L3 cache). Изменение переменной одним потоком мгновенно отражается во всех остальных потоках.\n2. **Запрет переупорядочивания инструкций (Instruction Reordering Prevention):** Предотвращает оптимизационное перестроение инструкций компилятором JIT и процессором за счет расстановки специальных барьеров памяти (Memory Barriers).\n\n**Важное ограничение:**\n`volatile` **не гарантирует атомарность** сложных операций. Например, неатомарный инкремент `count++` (состоящий из 3-х шагов: чтение, модификация, запись) при многопоточном использовании приведет к состоянию гонки (Race Condition). Для атомарных операций используйте блокировки `synchronized` или классы семейства `Atomic*` (например, `AtomicInteger`).",
  "analogy": "volatile — это прозрачная маркерная доска в центре офиса. Любое изменение информации на ней мгновенно видят все сотрудники. Без нее каждый сотрудник записывает инструкции в личный бумажный блокнот (кэш процессора), который обновляется со значительной и непредсказуемой задержкой."
}, {
  "id": "multithreading-004",
  "topic": "Multithreading",
  "difficulty": "Middle",
  "format": "Code Review",
  "question": "Найдите уязвимость в данном синглтоне с двойной проверкой блокировки (Double-Checked Locking) и устраните её.",
  "code": "public class DatabaseConnection {\n    private static DatabaseConnection instance;\n\n    private DatabaseConnection() {}\n\n    public static DatabaseConnection getInstance() {\n        if (instance == null) { // Первая проверка\n            synchronized (DatabaseConnection.class) {\n                if (instance == null) { // Вторая проверка\n                    instance = new DatabaseConnection();\n                }\n            }\n        }\n        return instance;\n    }\n}",
  "answer": "### Ошибка в коде:\nПеременная `instance` не объявлена с ключевым словом **`volatile`**.\n\n### В чем опасность?\nОперация создания объекта `new DatabaseConnection()` не является атомарной. На низком уровне она компилируется в следующие три шага:\n1. Выделение памяти под объект.\n2. Вызов конструктора для инициализации полей.\n3. Присвоение адреса выделенной памяти в переменную `instance`.\n\nИз-за оптимизационного переупорядочивания инструкций процессор может поменять шаги 2 и 3 местами. В таком случае переменной `instance` присвоится адрес памяти до того, как завершится инициализация конструктором.\n\nЕсли в этот критический микросекундный момент другой поток вызовет `getInstance()`, первая проверка `if (instance == null)` вернет `false` (так как ссылка уже не null), и поток получит **частично инициализированный объект**, что приведет к непредсказуемым ошибкам в приложении (например, NullPointerException при вызовах методов).\n\n### Правильное решение:\nНеобходимо добавить модификатор `volatile` к объявлению переменной:\n```java\nprivate static volatile DatabaseConnection instance;\n```\nЭто запретит переупорядочивание инструкций инициализации объекта и гарантирует корректную работу в многопоточной среде.",
  "analogy": "Это как разрешить зайти покупателю в недостроенный магазин, в котором еще не повесили полки и не подключили электричество, только потому, что строители повесили красивую вывеску на входе."
}, {
  "id": "oop-001",
  "topic": "OOP",
  "difficulty": "Junior",
  "format": "Open Answer",
  "question": "Каковы ключевые различия между абстрактными классами и интерфейсами в современных версиях Java (Java 8+ и 17+)?",
  "code": "",
  "answer": "С развитием Java (особенно после добавления default-методов в Java 8 и sealed-классов в Java 17) границы размылись, но фундаментальные отличия остались:\n\n1. **Множественное наследование:** \n   Класс может наследоваться только от одного класса (включая абстрактные), но может имплементировать неограниченное количество интерфейсов.\n\n2. **Управление состоянием:** \n   Абстрактные классы могут иметь переменные состояния (instance fields), конструкторы и нестатические блоки инициализации. \n   Интерфейсы **не могут хранить состояние**; любые переменные в интерфейсе автоматически трактуются как `public static final` (константы).\n\n3. **Методы:**\n   - Абстрактные классы могут содержать методы с любыми модификаторами доступа (`private`, `protected`, `package-private`, `public`).\n   - В интерфейсах методы по умолчанию публичные (`public`). Начиная с Java 8 разрешены `default` и `static` методы с телом, с Java 9 — `private` методы для переиспользования кода внутри интерфейса.\n\n4. **Идеология применения:**\n   - **Абстрактный класс** используется при проектировании жесткой иерархии родственных сущностей, отвечающей на вопрос **«Кто я?» (IS-A)**.\n   - **Интерфейс** используется для декларирования независимых поведенческих контрактов, отвечающих на вопрос **«Что я умею делать?» (CAN-DO)**.",
  "analogy": "Абстрактный класс — это чертеж 'Смартфона'. Смартфон имеет физические компоненты: батарею, экран (переменные состояния). Интерфейс — это стандарт порта USB-C. Смартфон, плеер и лампа умеют заряжаться через этот порт, хотя они вообще не родственники по иерархии классов."
}, {
  "id": "oop-034",
  "topic": "OOP",
  "difficulty": "Middle",
  "format": "Code Review",
  "question": "Какие правила (контракты) будут нарушены, если переопределить метод equals(), но проигнорировать метод hashCode()?",
  "code": "public class Developer {\n    private String name;\n    private int age;\n\n    public Developer(String name, int age) {\n        this.name = name; \n        this.age = age;\n    }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Developer)) return false;\n        Developer dev = (Developer) o;\n        return age == dev.age && Objects.equals(name, dev.name);\n    }\n    // hashCode() НЕ переопределен!\n}",
  "answer": "### Последствия нарушения контракта:\nЕсли два объекта равны согласно методу `equals()`, у них **обязательно должны быть одинаковые значения `hashCode()`**.\n\nЕсли не переопределить `hashCode()`, будет использоваться стандартная реализация из класса `Object`, которая возвращает уникальный хэш-код, завязанный на внутренний адрес объекта в памяти.\n\n### К каким багам это приведет?\nТакой класс сломает работу всех хэш-коллекций (`HashMap`, `HashSet`, `Hashtable`):\n1. При добавлении дубликата в `HashSet<Developer>` будут сохранены оба объекта, так как хэш-коллекция сначала сравнивает хэш-коды объектов. У разных физических экземпляров хэш-коды будут разными, поэтому они попадут в разные бакеты.\n2. При поиске объекта в `HashMap` методом `.get(key)` вы получите `null`, даже если в мапе лежит абсолютно эквивалентный по значению `equals()` ключ.\n\n### Корректное решение:\nНеобходимо добавить генерацию согласованного хэш-кода:\n```java\n@Override\npublic int hashCode() {\n    return Objects.hash(name, age);\n}\n```",
  "analogy": "Вы расставили в архиве книги по жанрам (хэш-кодам), но две абсолютно одинаковые книги положили на разные полки (в разные бакеты). Читатель, пытаясь найти дубликат книги по ее содержанию (equals), заглянет на полку 'Фантастика' и уйдет ни с чем, потому что вторая книга по ошибке оказалась на полке 'Кулинария'."
}];

// Global State variables
state.fallbackDatabase = fallbackDatabase;
export // Loading states from LocalStorage for persistence
function loadPersistence() {
  try {
    const storedMastered = localStorage.getItem('java_trainer_mastered');
    const storedFlagged = localStorage.getItem('java_trainer_flagged');
    const storedSr = localStorage.getItem('java_trainer_sr');
    state.masteredIds = storedMastered ? JSON.parse(storedMastered) : [];
    
    let parsedFlagged = storedFlagged ? JSON.parse(storedFlagged) : { "Favorites": [] };
    if (Array.isArray(parsedFlagged)) {
        // Migrate old array format to object format
        parsedFlagged = { "Favorites": parsedFlagged };
    }
    state.flaggedIds = parsedFlagged;
    
    state.srData = storedSr ? JSON.parse(storedSr) : {};
    if (typeof updateStatsUI === 'function') updateStatsUI();
    if (typeof updateStatsDashboard === 'function') updateStatsDashboard();
  } catch (err) {
    console.error("Failed to read localStorage persistence states", err);
  }
}
export function savePersistence() {
  try {
    localStorage.setItem('java_trainer_mastered', JSON.stringify(state.masteredIds));
    localStorage.setItem('java_trainer_flagged', JSON.stringify(state.flaggedIds));
    localStorage.setItem('java_trainer_sr', JSON.stringify(state.srData));
    if (typeof updateStatsUI === 'function') updateStatsUI();
    if (typeof updateStatsDashboard === 'function') updateStatsDashboard();
  } catch (err) {
    console.error("Failed to write to localStorage", err);
  }
}

// --- ui.js ---
// Build the left sidebar navigation items
