import { request as baseRequest } from "./apiClient";
import { useAuth } from "./AuthContext";

// Глобальна змінна для запобігання паралельним refresh в хуку
let isRefreshing = false;
let refreshSubscribers = [];

// Функція для додавання запитів в чергу очікування
function addRefreshSubscriber(callback) {
  refreshSubscribers.push(callback);
}

// Функція для виконання всіх запитів з черги після refresh
function onRefreshed(authToken, user) {
  refreshSubscribers.forEach(callback => callback(authToken, user));
  refreshSubscribers = [];
}

/**
 * Хук для отримання функції request, яка автоматично підставляє authToken
 * та обробляє refresh token з синхронізацією контексту
 */
export function useAuthRequest() {
  const { authToken, setAuthToken, setUser, refreshAuth } = useAuth();

  const authRequest = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    };

    // ✅ Використовуємо authToken замість accessToken
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    try {
      const response = await baseRequest(url, { ...options, headers });
      return response;
    } catch (err) {
      // Якщо 401 — спробуємо refresh
      if (err.status === 401) {
        // Якщо вже йде процес refresh - додаємо запит в чергу
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            addRefreshSubscriber((newAuthToken, newUser) => {
              // Повторюємо запит з новим токеном
              const retryHeaders = {
                ...headers,
                "Authorization": `Bearer ${newAuthToken}`
              };
              baseRequest(url, { ...options, headers: retryHeaders })
                .then(resolve)
                .catch(reject);
            });
          });
        }

        isRefreshing = true;

        try {
          console.log("🔄 useAuthRequest: Token expired, attempting refresh...");
          
          // Використовуємо refreshAuth з контексту замість прямого виклику AuthApi
          const newAuthToken = await refreshAuth();
          
          if (newAuthToken) {
            console.log("✅ useAuthRequest: Token refresh successful");
            
            // Оновлюємо контекст (вже зроблено в refreshAuth, але для безпеки)
            // Сповіщаємо всі очікуючі запити
            onRefreshed(newAuthToken, null);
            
            // Повторюємо поточний запит з новим токеном
            headers["Authorization"] = `Bearer ${newAuthToken}`;
            return await baseRequest(url, { ...options, headers });
          } else {
            throw new Error("No authToken received from refresh");
          }
        } catch (refreshError) {
          console.error("❌ useAuthRequest: Token refresh failed:", refreshError);
          
          // Сповіщаємо всі очікуючі запити про помилку
          refreshSubscribers.forEach(callback => callback(null, null));
          refreshSubscribers = [];
          
          throw new Error("Session expired. Please login again.");
        } finally {
          isRefreshing = false;
        }
      }
      throw err;
    }
  };

  return authRequest;
}

/**
 * Хук для отримання готових методів API з авторизацією
 */
export function useAuthApi() {
  const authRequest = useAuthRequest();

  return {
    // Основний метод
    request: authRequest,
    
    // GET запит
    get: (url, options = {}) => authRequest(url, { ...options, method: 'GET' }),
    
    // POST запит
    post: (url, data, options = {}) => authRequest(url, { 
      ...options, 
      method: 'POST', 
      body: data 
    }),
    
    // PUT запит
    put: (url, data, options = {}) => authRequest(url, { 
      ...options, 
      method: 'PUT', 
      body: data 
    }),
    
    // DELETE запит
    delete: (url, options = {}) => authRequest(url, { ...options, method: 'DELETE' }),
    
    // PATCH запит
    patch: (url, data, options = {}) => authRequest(url, { 
      ...options, 
      method: 'PATCH', 
      body: data 
    }),

    // Спеціальні методи для роботи з даними
    upload: (url, formData, options = {}) => authRequest(url, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        ...options.headers,
        // Не встановлюємо Content-Type для FormData - браузер зробить це сам
      },
    }),
  };
}

/**
 * Хук для перевірки авторизації перед запитом
 */
export function useProtectedRequest() {
  const { isAuthenticated } = useAuth();
  const authRequest = useAuthRequest();

  const protectedRequest = async (url, options = {}) => {
    if (!isAuthenticated()) {
      throw new Error("Authentication required");
    }
    return authRequest(url, options);
  };

  return protectedRequest;
}

/**
 * Хук для роботи з API, який автоматично перенаправляє на логін при 401
 */
export function useAuthRequestWithRedirect() {
  const { logout } = useAuth();
  const authRequest = useAuthRequest();

  const authRequestWithRedirect = async (url, options = {}) => {
    try {
      return await authRequest(url, options);
    } catch (err) {
      if (err.status === 401) {
        console.log("Redirecting to login due to authentication error");
        // Можна додати перенаправлення на логін сторінку
        // navigate('/login');
        await logout();
      }
      throw err;
    }
  };

  return authRequestWithRedirect;
}