
## 📋 Загальна бізнес-логіка системи

### 🔐 Аутентифікація
- Більшість ендпоінтів використовують  bearer token
- Деякі ендпоінти завантаження/скачування файлів не вимагають аутентифікації, але мають перевірки власника

### 📊 Основні модулі
- **Health Data** - зберігання медичних показників
- **AI Insights** - генерація аналітики через OpenAI
- **Uploads** - управління файлами
- **Goals & Progress** - цілі та прогрес
- **Medical History** - медична історія

---

## 🧠 Ключові ендпоінти для Insights функціоналу

### 1. **POST /generate-insight**
**Призначення**: Генерація AI-інсайтів на основі запиту користувача

**Request Body**:
```json
{
  "query": "string (required)",
  "user_id": "uuid (required)", 
  "metrics": "object (required)"
}
```

**Business Logic**:
1. Перевірка існування користувача
2. Валідація запиту на безпеку
3. Відправка запиту до OpenAI API з контекстом користувача
4. Збереження інсайту в `al_insights`
5. Логування аудиту в `al_audits_logs`

**Response**:
```json
{
  "result": "AI generated insight text",
  "success": "true"
}
```

---

### 2. **POST /metrics/forecast** 
**Призначення**: Прогнозування трендів здоров'я

**Request Body**:
```json
{
  "type_metric": "string (required)"
}
```

**Business Logic**:
1. Запит історичних даних з `health_data`
2. Аналіз трендів через AI
3. Генерація прогнозу на найближчі дні
4. Форматування відповіді згідно вимог (1 речення)

**Response**:
```json
{
  "succes": "true",
  "result_message": "Прогнозоване зниження пульсу на 5-7 ударів протягом наступного тижня"
}
```

---

### 3. **POST /metrics/trends**
**Призначення**: Отримання історичних даних для графіків

**Request Body**:
```json
{
  "type_metric": "string (required)",
  "period": "string (required)", 
  "start_date": "string (required)",
  "end_date": "string (required)"
}
```

**Business Logic**:
1. Фільтрація даних за періодом
2. Групування метрик за типом
3. Додавання відсутніх днів
4. Форматування для фронтенд-графіків

**Response**:
```json
{
  "succes": "true",
  "health_data_list": [...],
  "filter_list_period": [...]
}
```

### 4. **POST /check_query**
**Призначення**: Система фільтрації та валідації користувацьких запитів в медичному чат-боті для запобігання надання небезпечних або непрофесійних медичних порад.
Багаторівнева валідація запитів
#### Рівень 1: Технічна валідація
Перевірка формату вхідних даних
Виявлення проблем кодування
Перевірка довжини тексту
#### Рівень 2: Екстрені стани (Найвищий пріоритет)
Суїцидальні думки
Серцеві напади, інсульти
Серйозні кровотечі
Проблеми з диханням
#### Рівень 3: Небезпечний контент
Нелегальні дії
Шкідливі поради
Заборонені теми
#### Рівень 4: Обмежені медичні теми
Онкологія (рак, пухлини)
Рецептурні ліки
Хірургічні втручання
Спеціалізовані діагностики (МРТ, скани)
#### Рівень 5: Загальні умови
Занадто короткі/довгі запити
Неясні формулювання
Не медичні запити
Бізнес-правила
Правило A.1: Emergency Protocol
text
IF запит містить: 'suicide', 'heart attack', 'chest pain', 'can't breathe'
THEN негайно → EMERGENCY_FALLBACK
ACTION: Направлення до екстрених служб
**Request Body**:
```json
{
  "query": "string (required)",  
}
```
**Response**:
```json
{
  type: RESTRICTED_FALLBACK,
  message: I can share general educational information, but I’m not able to interpret or provide medical guidance for this specific concern.},
  validation_passed: false,
  validation_errors: [
  restricted_medical_content],
  triggered_categories: [
    restricted],
  fallback_action: RESTRICTED_FALLBACK,
  response_type: fallback_response,
  validation_details: {
  content_category: prescription_related,
  detected_keywords: [
   chemotherapy],
  user_input_preview: Tell me How long should I sleep chemotherapy?...,
  rule_applied: A.2 Restricted Content Protocol}
}
```

---

## 📁 Ендпоінти для Uploads (нова вкладка в Insights)

### 4. **POST /upload/attachment_file**
**Призначення**: Завантаження медичних файлів

**Multipart Form Data**:
```
file: binary (required)
user_id: uuid (required)
category: enum ["Labs","Radiology","Notes","Medical"] (required)
file_type: enum ["pdf"] (required) 
file_name: string (required)
```

**Business Logic**:
1. Створення запису в `uploads`
2. Збереження файлу в сховищі
3. Встановлення метаданих (категорія, тип)
4. Генерація публічного/приватного URL

**Response**:
```json
{
  "saved_upload": {
    "id": 123,
    "user_id": "uuid",
    "filename": "lab_results.pdf",
    "file_type": "pdf",
    "category": "Labs",
    "path": "https://storage/url/file.pdf",
    "file": {...}
  }
}
```

---

### 5. **GET /upload/download_file**
**Призначення**: Скачування файлів з перевіркою доступу

**Query Parameters**:
```
file_id: string (required)
user_id: uuid (required)
```

**Business Logic**:
1. Пошук файлу в `uploads` за `file_id`
2. Перевірка що `user_upload_file != null`
3. Перевірка приватності: `user_upload_file.private_file != null`
4. Перевірка власника: `user_upload_file.user_id == input.user_id`
5. Якщо всі перевірки пройдені - повернення `file_url`

**Response**:
```json
{
  "file_url": "https://storage/secure-url/document.pdf"
}
```

---

### 6. **GET /upload/get_files**
**Призначення**: Отримання списку всіх файлів користувача

**Query Parameters**:
```
user_id: uuid (required)
```

**Business Logic**:
1. Запит всіх записів з `uploads` для `user_id`
2. Фільтрація не видалених файлів (`deleted = false`)
3. Повернення структурованого списку з метаданими

**Response**:
```json
{
  "result": [
    {
      "id": 123,
      "filename": "blood_test.pdf",
      "file_type": "pdf", 
      "category": "Labs",
      "uploaded_at": "2024-01-15T10:30:00Z",
      "path": "https://storage/url/file.pdf",
      "notes": "January blood work"
    }
  ]
}
```

---

## 🚨 Ендпоінти для Early Alerts

### 7. **POST /check-threshold**
**Призначення**: Перевірка порогових значень та генерація алертів

**Request Body**:
```json
{
  "metrics": "object"
}
```

**Business Logic**:
1. Аналіз поточних метрик користувача
2. Порівняння з нормативними значеннями
3. Створення алертів при порушенні порогів
4. Визначення серйозності та категорії

### 8. **GET /get-comprehensive-alerts**
**Призначення**: Отримання всіх активних алертів

```
**Query Parameters**:
```
```

**Response**:
```json
{
  "result": [
    {
      "metric_name": "Heart Rate",
      "alert_type": "threshold", 
      "description": "Resting heart rate consistently above 100 bpm",
      "severity": "high",
      "triggered_at": "2024-01-15T08:00:00Z"
    }
  ]
}
```

---

## 🔧 Технічні деталі реалізації

### Безпека даних:
- Приватні файли мають `private_file` поле
- Перевірка `user_id` для всіх операцій з даними


### Обробка помилок:
- 400 - невірні параметри
- 401 - неавторизований доступ  
- 403 - доступ заборонений
- 404 - ресурс не знайдено
- 429 - забагато запитів

### Продуктивність:
- Пагінація для великих наборів даних
- Кешування частых запитів
- Оптимізація запитів до бази даних

Ця структура забезпечує повний функціонал для реалізації Insights розділу з AI-аналітикою, трендами, алертами та управлінням файлами відповідно до ваших вимог MVP.
