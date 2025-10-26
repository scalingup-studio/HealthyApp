# 🔐 Детальне Пояснення Authentication System

## 🎯 **ЩО РЕАЛІЗОВАНО В АУТЕНТИФІКАЦІЇ**

### **📋 ОГЛЯД ENDPOINTS:**

| Метод | Endpoint | Призначення | Auth |
|-------|----------|-------------|------|
| 🔐 | `POST /auth/signup` | Реєстрація | ❌ 
| 🔐 | `POST /auth/login` | Вхід | ❌ |
| 🔐 | `POST /auth/logout` | Вихід | ❌  |
| 🔐 | `POST /auth/check-auth` | Перевирка токен | ✅ |
| 🔐 | `POST /auth/refresh` | Оновлення токена | ❌ |
| 🔐 | `POST /auth/forgot-password` | Запит скидання пароля | ❌ |
| 🔐 | `POST /auth/reset-password` | Скидання пароля | ❌ |
| 🔐 | `GET /auth/google` | Google OAuth | ❌ |
| 🔐 | `GET /auth/callback/google` | Google callback | ❌ |
| 🔐 | `GET /auth/callback/apple` | Apple callback | ❌ |

---

## 📝 **ДЕТАЛЬНИЙ ОПИС КОЖНОГО ENDPOINT**

### **1. 🔐 POST `/auth/signup` - Реєстрація**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (Success 200):**
```json
{
  "new_User": {
    "id": "uuid",
    "email": "user@example.com",
    "password_hash": "hashed_password",
    "role": "user",
    "company_id": null,
    "subscription_plan": "core",
    "subscription_status": "active",
    "last_active_at": null,
    "updated_at": "timestamp",
    "created_at": "timestamp",
    "auth_type": "email"
  },
  "new_profile": {
    "id": "uuid",
    "created_at": "timestamp",
    "user_id": "user_uuid",
    "first_name": "John",
    "last_name": "Doe",
    "dob": null,
    "gender": "other",
    "height_cm": 0,
    "weight_kg": 0,
    "zip_code": null,
    "phone_number": null,
    "sex_of_birth": null,
    "profile_photo": {
      "access": "public",
      "path": "",
      "name": "",
      "type": "",
      "size": 0,
      "mime": "",
      "meta": {},
      "url": null
    }
  }
}
```

### **2. 🔐 POST `/auth/login` - Вхід**

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success 200):**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "user_data_object"
}
```

### **3. 🔐 POST `/auth/logout` - Вихід**

**Request Body:** None

**Response (Success 200):**
```json
{
  "success": true, 
  "message": "Logged out successfully" 
}
```

### **4. 🔐 GET `/auth/check-auth` - Перевірка авторизації**

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Request Body:** None
**Response (Success 200):**
```json
{
  "respons": {
    "id": "user_uuid",
    "email": "user@example.com",
    "password_hash": "hashed_password",
    "role": "user",
    "company_id": null,
    "subscription_plan": "core",
    "subscription_status": "active",
    "last_active_at": null,
    "updated_at": "timestamp",
    "created_at": "timestamp",
    "auth_type": "email"
  }
}
```

### **5. 🔐 POST `/auth/refresh` - Оновлення токена**

**Request Body:**
```json
{
  "refresh_token": "refresh_token_value"
}
```

**Response (Success 200):**
```json
{
  "authToken": "new_access_token",
  "user": "user_data_object"
}
```

### **6. 🔐 POST `/auth/forgot-password` - Запит скидання пароля**

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success 200):**
```json
{
  "result": "Password reset email sent",
  "success": "true"
}
```

### **7. 🔐 POST `/auth/reset-password` - Скидання пароля**

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "newSecurePassword123"
}
```

**Response (Success 200):**
```json
{
  "response": "Password reset successful",
  "success": "true"
}
```

### **8. 🔐 GET `/auth/google` - Google OAuth ініціалізація**

**Request:** None (Redirect to Google)

**Response:** Redirect to Google OAuth

### **9. 🔐 GET `/auth/callback/google` - Google OAuth callback**

**Query Parameters:**
```
?code=authorization_code_from_google
```

**Response:** Redirect to app with tokens

### **10. 🔐 GET `/auth/callback/apple` - Apple OAuth callback**

**Request:** Apple OAuth callback

**Response:** Redirect to app with tokens

### **11. 🔐 GET `/auth/audit` - Логи активності**

**Request:** None

**Response:**
```json
{
  "audit_logs": [
    {
      "id": "log_uuid",
      "user_id": "user_uuid",
      "action": "login",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "timestamp"
    }
  ]
}
```

---

## 🏗️ **СТРУКТУРА БАЗИ ДАНИХ**

### **👤 Таблиця `users`:**
```sql
{
  "id": "uuid",                    // Унікальний ID
  "email": "string",              // Email (унікальний)
  "password_hash": "string",      // Хеш пароля
  "role": "enum",                 // "user" або "admin"
  "company_id": "integer",        // ID компанії (опціонально)
  "subscription_plan": "enum",    // "core", "family", "complete"
  "subscription_status": "enum",  // "active", "expired", "canceled"
  "last_active_at": "timestamp",  // Остання активність
  "updated_at": "timestamp",      // Оновлено
  "created_at": "timestamp",      // Створено
  "auth_type": "enum"             // "google", "email", "facebook"
}
```

### **📋 Таблиця `profiles`:**
```sql
{
  "id": "uuid",
  "created_at": "timestamp",
  "user_id": "uuid",              // Зв'язок з users.id
  "first_name": "string",         // Ім'я
  "last_name": "string",          // Прізвище
  "dob": "date",                  // Дата народження
  "gender": "enum",               // "male", "female", "other"
  "height_cm": "integer",         // Зріст в см
  "weight_kg": "integer",         // Вага в кг
  "zip_code": "string",           // Поштовий індекс
  "phone_number": "string",       // Телефон
  "sex_of_birth": "string",       // Стать при народженні
  "profile_photo": "json"         // Фото профілю
}
```

### **🔐 Таблиця `refresh_tokens`:**
```sql
{
  "id": "uuid",
  "created_at": "timestamp",
  "user_id": "uuid",              // Зв'язок з users.id
  "token_hash": "string",         // Хеш refresh token
  "issued_at": "timestamp",       // Коли видано
  "expires_at": "timestamp",      // Термін дії
  "revoked": "boolean",           // Чи відкликано
  "ip": "string",                 // IP адреса
  "user_agent": "string",         // User agent
  "revoked_at": "timestamp"       // Коли відкликано
}
```

---

## 🔄 **FLOW АУТЕНТИФІКАЦІЇ**

### **📱 Стандартна реєстрація/вхід:**
```
1. POST /auth/signup {email, password, firstName, lastName}
   ↓
2. Створюється user + profile + user_setting
   ↓  
3. Повертається authToken
   ↓
4. Використовуємо authToken в headers
```

### **🔄 Оновлення токена:**
```
1. Токен протухає (401)
   ↓
2. POST /auth/refresh {refresh_token}
   ↓
3. Отримуємо новий authToken
   ↓
4. Продовжуємо роботу
```

### **🔐 OAuth Flow (Google):**
```
1. GET /auth/google → Redirect to Google
   ↓
2. Користувач авторизується в Google
   ↓
3. Google redirect до /auth/callback/google?code=...
   ↓
4. Система обмінює code на tokens
   ↓
5. Redirect до додатку з токенами
```

---

## 🛡️ **СИСТЕМА БЕЗПЕКИ**

### **Token Management:**
- **Access Token** - короткоживучий (години)
- **Refresh Token** - довгоживучий (дні/тижні)
- **Token Rotation** - при оновленні видається новий refresh token

### **Password Security:**
- Паролі хешуються перед збереженням
- Скидання пароля через email з токеном
- Токен скидання має обмежений термін дії

### **OAuth Integration:**
- Підтримка Google & Apple OAuth
- Безпечний callback flow
- Обробка authorization codes

---

## 🎯 **ВИКОРИСТАННЯ НА ФРОНТЕНДІ**

### **Реєстрація:**
```javascript
const signUp = async (userData) => {
  const response = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.authToken);
  return data;
};
```

### **Вхід:**
```javascript
const login = async (email, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.authToken);
  return data;
};
```

### **Перевірка авторизації:**
```javascript
const checkAuth = async () => {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('/auth/check-auth', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (response.status === 401) {
    // Token expired - try refresh
    await refreshToken();
  }
  
  return await response.json();
};
```

### **Оновлення токена:**
```javascript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  
  const data = await response.json();
  localStorage.setItem('authToken', data.authToken);
  return data;
};
```

---

## 💡 **ПЕРЕВАГИ СИСТЕМИ**

### **✅ Безпека:**
- Хешування паролів
- Token rotation
- OAuth integration
- Audit logs

### **✅ Зручність:**
- Multiple auth methods (email, Google, Apple)
- Automatic token refresh
- Profile management
- Password recovery

### **✅ Масштабованість:**
- Ролі користувачів (user/admin)
- Підписки (core/family/complete)
- Компанії (organization support)
- Audit trail

---

## 🚀 **ВИСНОВОК**

**Аутентифікаційна система повністю готова до використання** з:

- 🔐 **Повним циклом** реєстрації/входу/виходу
- 🔄 **Token management** з оновленням
- 🌐 **OAuth integration** (Google, Apple)
- 📧 **Password recovery** 
- 📊 **Audit logging**
- 👥 **User profiles** та ролі
- 💎 **Підписки** та компанії

**Система забезпечує безпечну та зручну авторизацію для всіх типів користувачів!** 🎯
