На основі наданих ендпоінтів для модуля Health History та Profile, ось детальна бізнес-логіка та специфікація для кожного ендпоінта:

## 🏥 **Health History Summary Endpoints**

### **POST /health_history_summary**
**Призначення**: Отримання всіх медичних записів користувача з усіх таблиць

**Request Body**:
```json
{
  "user_id": "uuid (required)"
}
```

**Business Logic**:
1. Паралельні запити до 8 таблиць медичної історії
2. Агрегація даних в єдину структуру
3. Повернення повного профілю здоров'я

**Response**:
```json
{
  "user_medical_condition": {...},
  "user_allergies": {...},
  "user_family_history": {...},
  "user_medications": {...},
  "user_sensitivities": {...},
  "user_surgical_history": {...},
  "user_vaccinations": {...},
  "success": "true"
}
```

---

## 🩺 **Medical Conditions Endpoints**

### **POST /medical_conditions**
**Додавання медичного стану**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "condition_name": "Hypertension",
  "diagnosis_date": "2023-05-15",
  "status": "active",
  "severity": "moderate",
  "notes": "Controlled with medication",
  "treatment_plan": "Lifestyle changes + medication"
}
```

### **GET /medical_conditions/{user_id}**
**Отримання медичних станів користувача**

**Response**:
```json
{
  "result": {
    "id": 123,
    "condition_name": "Hypertension",
    "diagnosis_date": "2023-05-15",
    "status": "active",
    "severity": "moderate"
  },
  "success": "true"
}
```

### **PATCH /medical_conditions/{user_id}**
**Оновлення медичного стану**

**Request Body**:
```json
{
  "medical_conditions_id": 123,
  "status": "chronic",
  "severity": "mild",
  "notes": "Well controlled"
}
```

---

## 💊 **Medications Endpoints**

### **POST /medications**
**Додавання лікарського засобу**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "name": "Lisinopril",
  "dosage": "10mg",
  "frequency": "Once daily",
  "start_date": "2023-05-20",
  "end_date": null
}
```

### **DELETE /medications/{user_id}**
**Видалення лікарського засобу**

**Request Body**:
```json
{
  "medications_id": 456
}
```

---

## 🌸 **Allergies Endpoints**

### **POST /allergies**
**Додавання алергії**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "allergy_name": "Penicillin",
  "severity": "severe",
  "notes": "Anaphylactic reaction"
}
```

### **GET /allergies/{user_id}**
**Отримання алергій користувача**

**Response**:
```json
{
  "result": [
    {
      "id": 789,
      "allergy_name": "Penicillin",
      "severity": "severe",
      "notes": "Anaphylactic reaction"
    }
  ],
  "success": "true"
}
```

---

## 👨‍👩‍👧‍👦 **Family History Endpoints**

### **POST /family_history**
**Додавання сімейного анамнезу**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "family_member": "mother",
  "condition_name": "Breast Cancer",
  "age_at_diagnosis": 45,
  "is_genetic": true
}
```

### **GET /family_history/{user_id}**
**Отримання сімейного анамнезу**

**Response**:
```json
{
  "result": [
    {
      "family_member": "mother",
      "condition_name": "Breast Cancer",
      "age_at_diagnosis": 45
    }
  ],
  "success": "true"
}
```

---

## 🏥 **Surgical History Endpoints**

### **POST /surgical_history**
**Додавання хірургічного втручання**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "procedure_name": "Appendectomy",
  "surgery_date": "2018-03-10",
  "surgeon": "Dr. Smith",
  "hospital": "City General Hospital"
}
```

### **GET /surgical_history/{user_id}**
**Отримання хірургічного анамнезу**

**Response**:
```json
{
  "result": [
    {
      "procedure_name": "Appendectomy",
      "surgery_date": "2018-03-10",
      "surgeon": "Dr. Smith"
    }
  ],
  "success": "true"
}
```

---

## 💉 **Vaccinations Endpoints**

### **POST /vaccinations**
**Додавання вакцинації**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "vaccine_name": "COVID-19 Booster",
  "vaccination_date": "2023-10-15",
  "lot_number": "AB12345",
  "next_due_date": "2024-10-15"
}
```

### **GET /vaccinations/{user_id}**
**Отримання історії вакцинацій**

**Response**:
```json
{
  "result": [
    {
      "vaccine_name": "COVID-19 Booster",
      "vaccination_date": "2023-10-15",
      "next_due_date": "2024-10-15"
    }
  ],
  "success": "true"
}
```

---

## 🌿 **Sensitivities Endpoints**

### **POST /sensitivities**
**Додавання чутливості**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "sensitivity_name": "Pollen",
  "type": "environmental",
  "symptoms": "Sneezing, itchy eyes",
  "severity": "moderate"
}
```
### **POST /user-health-summary**
**Додавати все health_history, medical_condition, allergies, family_history, medications, sensitivities, surgical_history, vaccinations одну таблицю 
**Request Body**:
```json
{
  "sections": "medications",
  "medical_condition": {},
  "allergies": {"0":"ggggg", "1":"bhhhhhh"},
  "family_history": {},
  "medications": {"0": "65656"},
  "sensitivities": {},
  "surgical_history": {},
  "vaccinations": {}
}
```
*** Result {
     result: {
         id: 1,
         created_at: 1761643550648,
         user_id: ece5adbb-317d-42a4-96a8-2e75c3f1ff92,
         medical_conditions: {},
         medications: [65656],
         allergies: [ggggg, bhhhhhh],
         family_history: {},
         surgical_history: {},
         vaccinations: {},
        sensitivities: {}
        },
      success: true    
---

## 👤 **User Profile Endpoints**

### **POST /profiles**
**Створення профілю користувача**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "first_name": "John",
  "last_name": "Doe",
  "dob": "1985-05-15",
  "gender": "male",
  "height_cm": 180,
  "weight_kg": 75,
  "phone_number": "+1234567890"
}
```

### **GET /profiles/{user_id}**
**Отримання профілю користувача**

**Response**:
```json
{
  "result": {
    "first_name": "John",
    "last_name": "Doe",
    "dob": "1985-05-15",
    "gender": "male",
    "height_cm": 180,
    "weight_kg": 75,
    "profile_photo": {
      "url": "https://storage/avatar.jpg"
    }
  },
  "success": "true"
}
```

### **PATCH /profiles/{user_id}**
**Оновлення профілю**

**Request Body**:
```json
{
  "profiles_id": "uuid",
  "first_name": "John",
  "last_name": "Smith",
  "weight_kg": 72
}
```

---

## ⚙️ **User Settings Endpoints**

### **POST /user_settings**
**Створення налаштувань користувача**

**Request Body**:
```json
{
  "user_id": "uuid (required)",
  "health_snapshot": {
    "blood_type": "A+",
    "emergency_contact": "..."
  },
  "privacy": {
    "share_health_data": false,
    "data_retention": "1year"
  },
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### **GET /user_settings/{user_id}**
**Отримання налаштувань**

**Response**:
```json
{
  "result": {
    "health_snapshot": {...},
    "privacy": {...},
    "onboarding": {...}
  },
  "success": "true"
}
```

---

## 🔐 **Authentication & Users Endpoints**

### **POST /users**
**Реєстрація користувача**

**Request Body**:
```json
{
  "email": "user@example.com (required)",
  "password_hash": "hashed_password",
  "role": "user",
  "subscription_plan": "core",
  "auth_type": "email"
}
```

### **GET /users/{user_id}**
**Отримання даних користувача**

**Response**:
```json
{
  "result": {
    "email": "user@example.com",
    "role": "user",
    "subscription_plan": "core",
    "subscription_status": "active"
  },
  "success": "true"
}
```

---

## 🖼️ **Avatar Upload Endpoint**

### **POST /upload/avatar**
**Завантаження аватара профілю**

**Multipart Form Data**:
```
image: binary file (required)
category: "profile"
file_type: "jpeg" | "png" | "gif" | "webp"
```

**Business Logic**:
1. Валідація зображення
2. Оновлення `profile_photo` в записі профілю
3. Повернення URL завантаженого зображення

**Response**:
```json
{
  "result": "Avatar updated successfully",
  "success": "true"
}
```

---

## 🎯 **Onboarding Endpoint**

### **POST /onboarding/{step}**
**Збереження прогресу онбордингу**

**Request Body**:
```json
{
  "user_id": "uuid",
  "data_json": {
    "step1_completed": true,
    "health_goals": ["fitness", "sleep"],
    "medical_conditions_added": true
  }
}
```

---

## 🔧 **Загальна бізнес-логіка**

### **Перевірки безпеки**:
- Валідація `user_id` для всіх операцій
- Перевірка прав доступу до даних
- Валідація медичних даних (дати, значення)

### **Обробка помилок**:
- 400 - невірні медичні дані
- 403 - доступ до чужих медичних записів
- 404 - запис не знайдений

### **Оптимізація**:
- Пагінація для великих списків
- Кешування частозапитуваних даних
- Оптимізовані JOIN запити для summary

Ця структура забезпечує повний функціонал для управління медичною історією та профілем користувача відповідно до вимог MVP.
