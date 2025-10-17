import React, { useEffect, useState } from "react";
import { HealthApi } from "../../api/healthApi";
import { useAuth } from "../../api/AuthContext";
import MetricsTable from "../../components/MetricsTable-TEST";

const HealthDataPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState(new Set()); // Для відстеження збереження

  useEffect(() => {
    if (user?.id) fetchHealthData(user.id);
  }, [user]);

  const fetchHealthData = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await HealthApi.getById(userId);
      console.log("API Response:", res);
      
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res && res.data) {
        data = Array.isArray(res.data) ? res.data : [res.data];
      } else if (res) {
        data = [res];
      }
      
      // Сортуємо за датою (новіші першими)
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch health data", err);
      setError("Failed to load health data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, field, value) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m && (m.id === id || m.tempId === id)
          ? {
              ...m,
              [field]:
                field === "sleep_hours" || field === "activity_level" || 
                field === "heart_rate" || field === "blood_pressure_systolic" || 
                field === "blood_pressure_diastolic"
                  ? Number(value) || 0
                  : value,
            }
          : m
      )
    );
  };

  const addNewMetric = () => {
    const newMetric = {
      tempId: Date.now(),
      date: new Date().toISOString().split('T')[0],
      heart_rate: 70, // Реалістичні значення за замовчуванням
      blood_pressure_systolic: 120,
      blood_pressure_diastolic: 80,
      sleep_hours: 7.5,
      activity_level: 50,
      visibility_scope: "private",
    };
    setMetrics((prev) => [newMetric, ...prev]);
  };

  const saveMetric = async (metric) => {
    const metricId = metric.tempId || metric.id;
    
    try {
      setSavingIds(prev => new Set(prev).add(metricId));
      
      let savedMetric;
      
      if (metric.id) {
        // Оновлення існуючого запису - передаємо user.id замість metric.id
        const dataToUpdate = {
          ...metric,
          user_id: user.id // Додаємо user_id в тіло запиту
        };
        savedMetric = await HealthApi.update(user.id, dataToUpdate); // Виправлено тут
      } else {
        // Створення нового запису
        const metricWithUser = { 
          ...metric, 
          user_id: user.id 
        };
        const res = await HealthApi.create(metricWithUser);
        savedMetric = res?.data || res;
      }
      
      if (!savedMetric) {
        throw new Error("No data received from server");
      }
      
      // Оновлюємо стан з правильним ID
      setMetrics((prev) =>
        prev.map((m) => 
          (m.tempId === metric.tempId || m.id === metric.id)
            ? { ...savedMetric, tempId: undefined }
            : m
        ).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      
      alert("Metric saved successfully!");
    } catch (err) {
      console.error("Failed to save metric", err);
      
      let errorMessage = "Failed to save metric";
      if (err.message?.includes("Network error")) {
        errorMessage = "Network error: Please check your internet connection";
      } else if (err.message?.includes("Unable to connect")) {
        errorMessage = "Unable to connect to server. Please try again later.";
      }
      
      alert(errorMessage);
      
      // Відновлюємо оригінальні дані при помилці для нових записів
      if (!metric.id) {
        setMetrics(prev => prev.filter(m => m.tempId !== metric.tempId));
      }
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(metricId);
        return newSet;
      });
    }
  };

  const deleteMetric = async (metricId) => {
    if (!metricId || metricId.toString().includes('temp')) {
      // Видаляємо тимчасовий запис зі стану
      setMetrics(prev => prev.filter(m => m.tempId !== metricId && m.id !== metricId));
      return;
    }

    if (!confirm("Are you sure you want to delete this metric?")) {
      return;
    }

    try {
      // Видалення за user_id
      await HealthApi.delete(user.id);
      setMetrics(prev => prev.filter(m => m.id !== metricId));
      alert("Metric deleted successfully!");
    } catch (err) {
      console.error("Failed to delete metric", err);
      alert("Failed to delete metric");
    }
  };

  const handleRetry = () => {
    if (user?.id) {
      fetchHealthData(user.id);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "0 auto",
        color: "white",
      }}
    >
      <h1>Health Data</h1>
      
      {error && (
        <div style={{ 
          color: "#ff6b6b", 
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "rgba(255, 107, 107, 0.1)",
          borderRadius: "5px"
        }}>
          {error}
          <button 
            onClick={handleRetry} 
            style={{ 
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={addNewMetric}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Add New Metric
        </button>
        
        <button 
          onClick={handleRetry}
          style={{
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Refresh Data
        </button>
      </div>
      
      {loading ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          color: "#ccc"
        }}>
          Loading health data...
        </div>
      ) : metrics.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          color: "#ccc"
        }}>
          No health data found. Add your first metric!
        </div>
      ) : (
        <MetricsTable
          metrics={metrics}
          onChange={handleInputChange}
          onSave={saveMetric}
          onDelete={deleteMetric}
          savingIds={savingIds}
        />
      )}
    </div>
  );
};

export default HealthDataPage;