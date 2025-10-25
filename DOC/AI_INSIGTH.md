# 🧠 Детальне пояснення логіки AI Insights системи

## 🏗️ Архітектура системи

### **Три головних компоненти:**

1. **Генерація інсайтів** (`POST /generate-insight`)
2. **Отримання інсайтів** (`GET /insights_recent`) 
3. **Безпечна обробка** (Safety & Validation)

---

## 🔄 #1: Генерація інсайтів (`POST /generate-insight`)

### **Логіка потоку даних:**

```
User Input → Безпечна валідація → AI Обробка → Збереження → Відповідь
```

### **Покрокова логіка:**

```javascript
// Крок 1: Збір даних користувача
Query All Records From user_session_date → user_session_date

// Крок 2: Безпечна валідація
Lambda Function → health_metrics_sudit_id
- Перевірка на екстрені симптоми
- Валідація медичного контенту
- Фільтрація небезпечних запитів

// Крок 3: Логування дій
Add Record in mf_smdits_logs → sf_smdits_logs1
- Записуємо спробу генерації
- Зберігаємо метадані для аудиту

// Крок 4: AI Обробка
Lambda Function → response
- Аналіз даних користувача
- Генерація безпечної відповіді
- Додавання educational context

// Крок 5: Збереження результату
Add Record in health_metrics_sudit → health_metrics_sudit1
- Зберігаємо інсайт в базу
- Додаємо метадані (тип, дата, джерела)

// Крок 6: Повернення результату
Response: { success: true, result: response }
```

---

## 📊 #2: Отримання інсайтів (`GET /insights_recent`)

### **Логіка фільтрації:**

```javascript
// Вхідні параметри
const insights = $var.ai_insights_list;        // Всі інсайти користувача
const typeMetric = $input.type_metric;         // Тип метрики (наприклад, "heart_rate")

// Фільтрація за типом метрики
const filtered = insights.filter(insight =>
  insight.data_sources?.metrics?.some(m => m.metric_type === typeMetric)
);

// Пошук найновішого інсайту
const foundInsight = filtered.reduce((latest, current) => {
  return !latest || current.created_at > latest.created_at ? current : latest;
}, null);

// Повертаємо результат
return foundInsight;
```

### **Приклад роботи:**

**Якщо користувач шукає інсайти про пульс:**
```javascript
typeMetric = "heart_rate"

// Система шукає в data_sources.metrics:
[
  { metric_type: "heart_rate", value: 75 },
  { metric_type: "sleep", value: 7.5 }
]
// → Знаходить інсайти тільки з heart_rate
// → Повертає найсвіжіший
```

---

## 🛡️ #3: Система безпеки та валідації

### **Мульти-рівнева перевірка:**

```javascript
// Рівень 1: Екстрені симптоми
const EMERGENCY_KEYWORDS = [
  "severe chest pain", "can't breathe", 
  "suicidal", "overdose", "bleeding won't stop"
];

// Рівень 2: Обмежений контент  
const RESTRICTED_CONTENT = [
  "diagnosis", "prescription", "treatment",
  "you have", "you're suffering from"
];

// Рівень 3: Технічні помилки
const TECHNICAL_ERRORS = [
  "system error", "processing failed"
];
```

### **Логіка обробки екстрених випадків:**

```javascript
function checkEmergencyContent(userInput) {
  const emergencyPatterns = [
    /severe chest pain/i,
    /can'?t breathe/i,
    /suicid/i,
    /overdose/i,
    /bleeding that won'?t stop/i
  ];
  
  return emergencyPatterns.some(pattern => pattern.test(userInput));
}

// Якщо виявлено екстрений випадок:
if (checkEmergencyContent(userInput)) {
  return createFallbackResponse('EMERGENCY_FALLBACK', [
    'emergency_content_detected'
  ], ['life_threatening']);
}
```

### **Система fallback-відповідей:**

```javascript
function createFallbackResponse(fallbackType, validationErrors, triggeredCategories) {
  const fallbackMap = {
    'EMERGENCY_FALLBACK': EMERGENCY_FALLBACK_MESSAGES,
    'RESTRICTED_FALLBACK': RESTRICTED_FALLBACK_MESSAGES, 
    'GENERAL_FALLBACK': GENERAL_FALLBACK_MESSAGES
  };
  
  return {
    success: false,
    response: {
      type: fallbackType,
      message: getRandomMessage(fallbackMap[fallbackType])
    },
    validation_passed: false,
    validation_errors: validationErrors,
    triggered_categories: triggeredCategories
  };
}
```

---

## 🎯 **Бізнес-логіка AI відповідей**

### **Educational Framework (Освітній підхід):**

```javascript
function generateEducationalResponse(userInput, userData) {
  // 1. Аналіз контексту
  const context = analyzeHealthContext(userInput, userData);
  
  // 2. Пошук релевантних guideline'ів
  const guidelines = findRelevantGuidelines(context);
  
  // 3. Генерація безпечної відповіді
  return {
    educational_context: guidelines.publicHealthInfo,
    provider_questions: generateProviderQuestions(context),
    disclaimer: "This isn't medical advice. Consult a healthcare professional..."
  };
}
```

### **Приклад обробки симптомів:**

**Користувач:** "Я кашляю вже 4 дні і почуваюсь втомленим"

**AI Логіка обробки:**
```javascript
// Крок 1: Валідація (не екстрений випадок)
// Крок 2: Пошук educational context
- Common causes: viral infections, allergies, dry air
- Public guidelines: hydration, rest, monitoring

// Крок 3: Генерація provider questions
- "Could this be related to common causes like stress or mild infection?"
- "When would it make sense to have a checkup?"

// Крок 4: Додавання disclaimer
```

**Результат:**
```json
{
  "response": "A short-term cough lasting a few days can sometimes occur with common viral infections...",
  "provider_questions": [
    "Could this be related to a simple viral infection or allergies?",
    "What symptoms should I watch for?"
  ],
  "disclaimer": "This isn't medical advice..."
}
```

---

## 📈 **Система моніторингу та аудиту**

### **Логування всіх дій:**

```javascript
// Для кожного запиту зберігаємо:
Add Record in mf_smdits_logs {
  user_id: "uuid",
  input_text: "user query",
  validation_result: "passed/blocked",
  triggered_categories: ["emergency", "restricted"],
  response_type: "educational/fallback",
  timestamp: "2025-10-23T15:19:58.221Z"
}
```

### **Аналітика використання:**

- **Відстеження типів запитів**
- **Моніторинг тригеред категорій**  
- **Аудит безпекових спрацьовувань**
- **Якість AI відповідей**

---

## 🔄 **Інтеграція з фронтендом**

### **Flow взаємодії:**

```
Frontend → POST /generate-insight { user_input } → Backend
Backend → Валідація → AI Обробка → Збереження → Відповідь
Frontend → Відображення інсайту + progress tracking
```

### **Стандартизована відповідь:**

```json
{
  "success": true,
  "result": {
    "educational_insight": "Contextual health information...",
    "provider_questions": ["Question 1", "Question 2"],
    "data_sources": ["CDC", "AHA", "User metrics"],
    "disclaimer": "This isn't medical advice..."
  },
  "metadata": {
    "response_type": "educational",
    "generated_at": "2025-10-23T15:19:58.221Z",
    "data_used": ["sleep_data", "activity_metrics"]
  }
}
```

---

## 🎯 **Ключові переваги такої архітектури**

### **1. Безпека перш за все**
- Мульти-рівнева валідація
- Екстрені fallback-механізми
- Повний аудит дій

### **2. Масштабованість**  
- Модульна структура
- Легко додати нові типи метрик
- Гнучка система фільтрації

### **3. Юзер-френдлі**
- Освітній підхід (не медичний)
- Підготовка до візиту до лікаря
- Зрозуміла, доступна мова

### **4. Compliance**
- Відповідність медичним регуляціям
- Чіткі дисклеймери
- Контроль відповідальності

Ця система забезпечує безпечну, корисну та регуляторно-відповідну AI-підтримку для користувачів! 🚀

# 🚨 Детальне пояснення логіки перевірки метрик (`check_threshold`)

## 🎯 **Основна ціль функції**

**Моніторинг показників здоров'я користувача** та автоматичне виявлення:
- ✅ **Нормальних значень** - все в порядку
- ⚠️ **Попереджувальних значень** - потрібна увага  
- 🚨 **Критичних значень** - негайна дія

---

## 🏗️ **Архітектура системи**

### **Три рівні порогових значень:**

```javascript
const thresholds = {
  // 🟢 Нормальний діапазон
  min_value: 60,    // нижня межа норми
  max_value: 100,   // верхня межа норми
  
  // 🚨 Критичні межі (небезпечні значення)
  critical_low: 50,  // критично низьке
  critical_high: 120 // критично високе
}
```

### **Візуалізація діапазонів:**
```
CRITICAL_LOW     MIN_VALUE      MAX_VALUE     CRITICAL_HIGH
     ↓               ↓              ↓               ↓
     |🚨 НЕБЕЗПЕКА|🟢 НОРМА|⚠️ УВАГА|🚨 НЕБЕЗПЕКА|
     40-50         60-100       100-120        120-130
```

---

## 🔍 **Детальний розбір логіки категоризації**

### **Крок 1: Підготовка даних**

```javascript
// Отримуємо метрики від користувача
let metricsArray = JSON.parse($input.metrics);

// Отримуємо порогові значення з бази
const thresholds = $var.thresholds; // [{metric_type: "heart_rate", min_value: 60, ...}]
```

### **Крок 2: Процес категоризації для кожної метрики**

```javascript
metricsArray.forEach(metric => {
  // Знаходимо пороги для цієї метрики
  const th = thresholds.find(t => 
    t.metric_type.toLowerCase() === metric.metric_type.toLowerCase()
  );
  
  if (!th) return; // Якщо немає порогів - пропускаємо
  
  // Конвертуємо значення в число
  const numericValue = parseFloat(metric.value);
  if (isNaN(numericValue)) return;
});
```

### **Крок 3: Визначення категорії**

```javascript
// Створюємо базовий об'єкт статусу
const statusObj = {
  metric_name: metric.metric_type,  // "heart_rate"
  value: numericValue,              // 75
  message: th.response,             // "Пульс в нормі"
  metric_type: metric.metric_type,
  last_metric_date: metric.last_metric_date,
  alert_category: metric.alert_category
};
```

### **Крок 4: Логіка перевірки діапазонів**

```javascript
// 🚨 КРИТИЧНИЙ СТАТУС
if (numericValue <= criticalLow || numericValue >= criticalHigh) {
  emergencyResults.push({ 
    ...statusObj, 
    status: 'emergency', 
    severity: 'critical',
    critical_threshold: numericValue <= criticalLow ? criticalLow : criticalHigh
  });
}

// ⚠️ ПОПЕРЕДЖЕННЯ  
else if (numericValue < minVal || numericValue > maxVal) {
  alertResults.push({ 
    ...statusObj, 
    status: 'alert', 
    severity: 'high' 
  });
}

// ✅ НОРМА
else {
  okResults.push({ 
    ...statusObj, 
    status: 'ok' 
  });
}
```

---

## 📊 **Приклади роботи системи**

### **Приклад 1: Пульс (heart_rate)**

```javascript
// Порогові значення:
const heartThreshold = {
  metric_type: "heart_rate",
  min_value: 60,      // норма від
  max_value: 100,     // норма до  
  critical_low: 50,   // критично низький
  critical_high: 120, // критично високий
  response: "Пульс виходить за межі норми"
};

// Тестування різних значень:
checkMetric(45)  // → 🚨 EMERGENCY (нижче critical_low)
checkMetric(55)  // → ⚠️ ALERT (нижче min_value)  
checkMetric(75)  // → ✅ OK (в нормі)
checkMetric(105) // → ⚠️ ALERT (вище max_value)
checkMetric(125) // → 🚨 EMERGENCY (вище critical_high)
```

### **Приклад 2: Тиск (blood_pressure)**

```javascript
const bpThreshold = {
  metric_type: "systolic_bp",
  min_value: 90,    // норма від
  max_value: 120,   // норма до
  critical_low: 80, // критично низький
  critical_high: 180 // критично високий
};

checkMetric(185) // → 🚨 EMERGENCY (гіпертонічний криз)
checkMetric(130) // → ⚠️ ALERT (підвищений)
checkMetric(110) // → ✅ OK (норма)
checkMetric(75)  // → 🚨 EMERGENCY (гіпотонія)
```

---

## 🎪 **Типи метрик та їх пороги**

### **Життєво важливі метрики:**
```javascript
// Пульс
{ metric_type: "heart_rate", min: 60, max: 100, critical_low: 50, critical_high: 120 }

// Тиск
{ metric_type: "systolic_bp", min: 90, max: 120, critical_low: 80, critical_high: 180 }
{ metric_type: "diastolic_bp", min: 60, max: 80, critical_low: 50, critical_high: 120 }

// Сатурація кисню  
{ metric_type: "blood_oxygen", min: 95, max: 100, critical_low: 90, critical_high: 100 }

// Температура
{ metric_type: "body_temp", min: 36.1, max: 37.2, critical_low: 35.0, critical_high: 39.0 }
```

### **Метрики способу життя:**
```javascript
// Сон
{ metric_type: "sleep_duration", min: 7, max: 9, critical_low: 4, critical_high: 12 }

// Активність
{ metric_type: "steps_count", min: 5000, max: 15000, critical_low: 1000, critical_high: 30000 }

// Гідратація
{ metric_type: "water_intake", min: 1500, max: 3000, critical_low: 500, critical_high: 5000 }
```

---

## 🔄 **Повний цикл обробки**

### **Вхідні дані:**
```json
{
  "user_id": "user123",
  "metrics": [
    {
      "metric_type": "heart_rate",
      "value": "125",
      "last_metric_date": "2025-10-23T15:19:58.221Z",
      "alert_category": "vitals"
    },
    {
      "metric_type": "sleep_duration", 
      "value": "6.5",
      "last_metric_date": "2025-10-23T15:19:58.221Z",
      "alert_category": "lifestyle"
    }
  ]
}
```

### **Процес обробки:**
1. **Парсинг JSON** → масив метрик
2. **Пошук порогів** для кожної метрики
3. **Категоризація** за діапазонами
4. **Формування результатів**

### **Вихідні дані:**
```json
{
  "all_results": [
    {
      "metric_name": "sleep_duration",
      "value": 6.5,
      "message": "Тривалість сну нижче норми",
      "status": "alert",
      "severity": "high"
    }
  ],
  "emergency_results": [
    {
      "metric_name": "heart_rate", 
      "value": 125,
      "message": "Критично високий пульс",
      "status": "emergency",
      "severity": "critical",
      "critical_threshold": 120
    }
  ],
  "ok_results": [],
  "alerts_to_save": [...],
  "has_emergency": true
}
```

---

## 🛡️ **Система безпеки та обробки помилок**

### **Валідація даних:**
```javascript
try {
  metricsArray = typeof $input.metrics === 'string' 
    ? JSON.parse($input.metrics) 
    : $input.metrics;
} catch (err) {
  return { 
    success: false, 
    error: 'Invalid metrics JSON', 
    details: err 
  };
}
```

### **Обробка відсутніх даних:**
- Якщо метрика не знайдена в порогах → **ігнорується**
- Якщо значення не число → **ігнорується**  
- Якщо пороги не визначені → **використовуються безпечні значення**

---

## 🎯 **Практичне застосування**

### **Для користувача:**
- **Миттєві сповіщення** про проблеми
- **Рекомендації** що робити далі
- **Історія тригерів** для аналізу тенденцій

### **Для лікаря:**
- **Пріоритизація** пацієнтів за критичністю
- **Об'єктивні дані** для діагностики
- **Тенденції** за довгий період

### **Для системи:**
- **Автоматичний моніторинг** 24/7
- **Інтеграція з AI** для прогнозування
- **Аналітика ефективності** лікування

---

## 💡 **Ключові переваги**

1. **Автоматизація** - постійний моніторинг без участі людини
2. **Швидкість** - миттєве виявлення проблем
3. **Точність** - об'єктивні критерії на основі медичних стандартів  
4. **Масштабованість** - легко додати нові типи метрик
5. **Безпека** - обробка помилок та валідація даних

Ця система забезпечує **проактивний підхід до здоров'я** - виявлення проблем ДО того, як вони стануть критичними! 🚀