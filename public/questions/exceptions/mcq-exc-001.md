---
id: mcq-exc-001
topic: Exceptions
difficulty: Junior
format: MCQ
tags: [exceptions, checked, unchecked]
---
Какой класс является базовым для всех проверяемых (checked) исключений?

A. Error
B. RuntimeException
C. Exception
D. Throwable

---ANSWER---
**Правильный ответ: C (Exception)**

### Key Points
- Все классы, наследующие `Exception` (кроме ветки `RuntimeException`), являются Checked (проверяемыми компилятором).
- `Error` и `RuntimeException` являются Unchecked.
