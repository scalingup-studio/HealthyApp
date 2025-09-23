// apiConfig.js
// Автоматически сгенерированные CRUD и кастомные endpoints с комментариями

const API_BASE = "https://xu6p-ejbd-2ew4.n7e.xano.io/api:5PA_dIPO";

// Таблицы и краткое описание бизнес-логики
const TABLES_INFO = [
  {
    name: "users",
    description: "Stores user credentials, roles, subscription plan. Created at registration."
  },
  {
    name: "company",
    description: "Stores companies for corporate accounts. Can have many users."
  },
  {
    name: "profiles",
    description: "User personal data. Created at registration, updated during onboarding."
  },
  {
    name: "user_settings",
    description: "User settings, onboarding progress, privacy data. Created at registration."
  },
  {
    name: "health_data",
    description: "Daily or periodic user health metrics. Access controlled via visibility_scope."
  },
  {
    name: "goals",
    description: "User goals. Visibility controlled via visibility_scope."
  },
  {
    name: "action_plans",
    description: "User tasks and action plans."
  },
  {
    name: "insights",
    description: "AI/system recommendations for users."
  },
  {
    name: "reports",
    description: "Files or analysis results. Access controlled via visibility_scope."
  },
  {
    name: "activity_log",
    description: "Tracks user actions in the system."
  },
  {
    name: "plans",
    description: "Subscription plans: core, family, complete."
  },
  {
    name: "plan_features",
    description: "Features associated with subscription plans."
  },
  {
    name: "subscriptions",
    description: "User, family, company subscriptions."
  },
  {
    name: "family",
    description: "Family accounts for family subscription plans."
  },
  {
    name: "family_members",
    description: "Members of a family account."
  }
  // Добавляй остальные таблицы по необходимости
];

// Генерация CRUD endpoints с комментариями
export const ENDPOINTS = {};

TABLES_INFO.forEach((table) => {
  ENDPOINTS[table.name] = {
    // Получить все записи таблицы
    getAll: `${API_BASE}/${table.name}`, // ${table.description}

    // Получить запись по ID
    getById: (id) => `${API_BASE}/${table.name}/${id}`,

    // Создать новую запись
    add: `${API_BASE}/${table.name}`,

    // Обновить запись по ID
    update: (id) => `${API_BASE}/${table.name}/${id}`,

    // Удалить запись по ID
    delete: (id) => `${API_BASE}/${table.name}/${id}`
  };
});

// Кастомные endpoints, отдельно от стандартного CRUD
export const CUSTOM_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`, // User login
    logout: `${API_BASE}/auth/logout`, // User logout
    refreshToken: `${API_BASE}/auth/refresh` // Refresh JWT token
  },
  reports: {
    generateMonthly: `${API_BASE}/reports/monthly-generate`, // Generate monthly report
    download: (reportId) => `${API_BASE}/reports/${reportId}/download` // Download report by ID
  },
  notifications: {
    sendPush: `${API_BASE}/notifications/send`, // Send push notification
    getHistory: `${API_BASE}/notifications/history` // Get notification history
  },
  dashboard: {
    getSummary: `${API_BASE}/dashboard/summary`, // Aggregated metrics summary
    getMetrics: `${API_BASE}/dashboard/metrics` // Detailed metrics
  }
  // Добавляй остальные кастомные endpoints здесь
};

