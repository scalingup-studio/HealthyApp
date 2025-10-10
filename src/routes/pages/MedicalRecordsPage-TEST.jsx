import React, { useState, useEffect } from 'react';
import { useAuth } from "../../api/AuthContext";
import api from "../../api/uploadFileApi";

const MedicalRecordsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  // Обробник вибору файлу
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  // Завантаження файлу
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('❌ Будь ласка, виберіть файл');
      return;
    }

    if (!user?.id) {
      setUploadStatus('❌ Користувач не авторизований');
      return;
    }

    try {
      setUploadStatus('⏳ Завантаження...');
      setLoading(true);
      
      // Правильний виклик API
      const response = await api.uploadFileApi(
        selectedFile,
        user.id,
        "Labs",
        selectedFile.type || "application/octet-stream",
        selectedFile.name
      );
      
      console.log("✅ File uploaded successfully:", response);
      setUploadStatus('✅ Файл успішно завантажено!');
      setSelectedFile(null);
      
      // Скидання input файлу
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      // Оновлення списку файлів
      fetchUploadedFiles();
      
    } catch (err) {
      console.error("❌ Upload failed:", err);
      setUploadStatus('❌ Помилка завантаження: ' + (err.message || 'Невідома помилка'));
    } finally {
      setLoading(false);
    }
  };

  // Отримання завантажених файлів
  const fetchUploadedFiles = async () => {
    if (!user?.id) return;
    
    try {
      // Правильний виклик API
      const files = await api.getUserFilesApi(user.id);
      setUploadedFiles(files || []);
    } catch (err) {
      console.error("❌ Failed to fetch files:", err);
      setUploadStatus('❌ Помилка завантаження списку файлів');
    }
  };

  // Завантаження файлу
  const handleDownloadFile = (file) => {
    if (file.file_url) {
      window.open(file.file_url, '_blank');
    } else if (file.url) {
      window.open(file.url, '_blank');
    } else {
      // Якщо немає прямого посилання, використовуємо API endpoint
      const downloadUrl = `${CUSTOM_ENDPOINTS.uploudFile.getUserUploudFile}?file_id=${file.id}`;
      window.open(downloadUrl, '_blank');
    }
  };

  // Завантаження даних при монтуванні
  useEffect(() => {
    if (user?.id) {
      fetchUploadedFiles();
    }
  }, [user]);

  return (
    <div className="medical-records-page">
      {/* Блок завантаження файлів */}
      <section className="upload-section">
        <h2>Завантажити файл</h2>
        <div className="upload-controls">
          <input
            id="file-input"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
            onChange={handleFileSelect}
            className="file-input"
            disabled={!user?.id || loading}
          />
          <button 
            onClick={handleUpload}
            disabled={!selectedFile || !user?.id || loading}
            className="upload-button"
          >
            {loading ? '⏳ Завантаження...' : '📎 Завантажити'}
          </button>
        </div>
        
        {!user?.id && (
          <p className="warning">⚠️ Для завантаження файлів необхідно авторизуватися</p>
        )}
        
        {selectedFile && (
          <p className="file-info">📄 Обраний файл: {selectedFile.name}</p>
        )}
        
        {uploadStatus && (
          <p className={`upload-status ${uploadStatus.includes('✅') ? 'success' : 'error'}`}>
            {uploadStatus}
          </p>
        )}
      </section>

      {/* Блок завантажених файлів */}
      <section className="uploaded-files">
        <h2>Завантажені файли</h2>
        
        {uploadedFiles.length > 0 ? (
          <div className="uploaded-files-list">
            {uploadedFiles.map((file) => (
              <div key={file.id || file.file_id} className="uploaded-file-item">
                <div className="file-info">
                  <span className="file-name">📄 {file.file_name || file.name}</span>
                  <span className="file-category">{file.category || 'Загальний'}</span>
                  {file.uploaded_at && (
                    <span className="file-date">
                      {new Date(file.uploaded_at).toLocaleDateString()}
                    </span>
                  )}
                  {file.created_at && (
                    <span className="file-date">
                      {new Date(file.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDownloadFile(file)}
                  className="download-link"
                  title="Завантажити файл"
                >
                  📥 Завантажити
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">📁 Немає завантажених файлів</p>
        )}
      </section>

      <style>{`
        .medical-records-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Arial, sans-serif;
        }

        .upload-section,
        .uploaded-files {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 24px;
          border: 1px solid #e9ecef;
        }

        h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .upload-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .file-input {
          padding: 10px 12px;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          background: #f8f9fa;
          flex: 1;
          min-width: 250px;
        }

        .upload-button {
          background: #007acc;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .upload-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .file-info {
          color: #495057;
          padding: 8px 12px;
          background: #e8f5e8;
          border-radius: 6px;
        }

        .warning {
          color: #856404;
          background: #fff3cd;
          padding: 12px;
          border-radius: 6px;
        }

        .upload-status {
          padding: 12px;
          border-radius: 6px;
          font-weight: 500;
          margin-top: 12px;
        }

        .upload-status.success {
          background: #d4edda;
          color: #155724;
        }

        .upload-status.error {
          background: #f8d7da;
          color: #721c24;
        }

        .uploaded-files-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .uploaded-file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .file-category {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .file-date {
          color: #6c757d;
          font-size: 0.8rem;
        }

        .download-link {
          background: #28a745;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
        }

        .download-link:hover {
          background: #218838;
        }

        .no-data {
          text-align: center;
          color: #6c757d;
          padding: 40px 20px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default MedicalRecordsPage;