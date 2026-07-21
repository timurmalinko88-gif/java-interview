---
id: multithreading-004
topic: Multithreading
difficulty: Middle
format: Code Review
estimated_time_minutes: 10
frequency: High
related_questions: [Разница между HashMap и ConcurrentHashMap, Метод computeIfAbsent]
source: Custom
prerequisites: [ConcurrentHashMap, Race Condition]
---

Разработчик реализовал потокобезопасный кэш пользователей на основе `ConcurrentHashMap`. Посмотрите на код ниже (Java 17). Компиляция проходит успешно. Найдите баги и уязвимости при работе в многопоточной среде и предложите, как их исправить.

```java
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserCache {
    private final Map<String, User> cache = new ConcurrentHashMap<>();

    public User getUser(String userId) {
        User user = cache.get(userId);
        if (user == null) {
            user = loadUserFromDatabase(userId); // Метод занимает ~200мс
            cache.put(userId, user);
        }
        return user;
    }

    private User loadUserFromDatabase(String userId) {
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return new User(userId, "Name_" + userId);
    }

    public record User(String id, String name) {}
}
```

---ANSWER---

В коде присутствует классический **Race Condition (Состояние гонки) типа "Check-Then-Act" (Проверь-Затем-Действуй)**.

Несмотря на использование `ConcurrentHashMap`, методы `get` и `put` вызываются раздельно. Сама мапа защищает от повреждения своей внутренней структуры, но не гарантирует атомарность последовательности действий.

Если два потока одновременно запросят `getUser("id1")`, они оба получат `null` из `cache.get()`, оба пойдут в метод `loadUserFromDatabase()` и дважды выполнят "тяжелый" запрос к БД, а затем последовательно перезапишут значения в мапе. В условиях высокой нагрузки база данных ляжет от дублирующихся запросов (Cache Stampede).

**Как исправить:**

Нужно использовать атомарный метод `computeIfAbsent`, который блокирует сегмент мапы (или бакет) только для конкретного ключа на время вычисления.

**Исправленный код:**

```java
public User getUser(String userId) {
    // Выполнит загрузку из БД только один раз для одного ключа,
    // остальные потоки с тем же ключом будут ждать результата
    return cache.computeIfAbsent(userId, this::loadUserFromDatabase);
}
```

*Дополнительный нюанс:* Перехват `InterruptedException` с восстановлением флага прерывания `Thread.currentThread().interrupt()` сделан правильно, но в исходном коде после этого мы всё равно возвращаем фейкового пользователя, что может быть некорректно для бизнес-логики (лучше пробросить Exception или вернуть null/Optional).

### Ключевые моменты

* `ConcurrentHashMap` гарантирует потокобезопасность одиночных операций (put, get), но не их комбинаций.
* Паттерн `if (map.get(key) == null) { map.put(key, val); }` подвержен состоянию гонки (Check-Then-Act).
* Метод `computeIfAbsent` обеспечивает атомарную проверку и инициализацию ключа.
* `computeIfAbsent` блокирует только вычисление для конкретного ключа, не мешая параллельным потокам работать с другими ключами.

## Analogy

Вы с соседом по комнате (два потока) одновременно заглянули в холодильник (ConcurrentHashMap). Молока нет (вернулся null). Не договорившись, вы оба пошли в магазин и купили по пакету молока. Теперь у вас два пакета вместо одного (двойная нагрузка на БД). Использование `computeIfAbsent` — это повесить записку на холодильник "Я ушел за молоком", чтобы второй сосед просто подождал.