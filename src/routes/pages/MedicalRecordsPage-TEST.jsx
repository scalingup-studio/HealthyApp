import React, { useState, useEffect } from 'react';
import { useAuth } from "../../api/AuthContext";
import { UploadFileApi } from "../../api/uploadFileApi";

const MedicalRecordsPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});

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
      
      const response = await UploadFileApi.uploadFile(
        selectedFile,
        user.id,
        "Labs"
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
      const files = await UploadFileApi.getUserFiles(user.id);
      setUploadedFiles(files || []);
    } catch (err) {
      console.error("❌ Failed to fetch files:", err);
      setUploadStatus('❌ Помилка завантаження списку файлів');
    }
  };

  const handleDownloadFile = (file, action = 'view') => {
    const fileUrl = file.signedUrl || file.file?.url; // бек вже дає правильний URL
    const fileName = file.filename;
  
    if (!fileUrl) {
      alert('URL файлу не знайдено');
      return;
    }
  
    try {
      if (action === 'download') {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.click();
      } else {
        // Перегляд у новій вкладці
        window.open(fileUrl, '_blank');
      }
    } catch (err) {
      console.error("❌ File action failed:", err);
      alert('Помилка при роботі з файлом: ' + err.message);
    }
  };
  
  
  // Функція видалення файлу
  const handleDeleteFile = async (file) => {
    const fileId = file.id || file.file_id;
    const fileName = file.file_name || file.name;
    
    if (!fileId) {
      alert('ID файлу не знайдено');
      return;
    }

    // Підтвердження видалення
    if (!window.confirm(`Ви впевнені, що хочете видалити файл "${fileName}"?`)) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [fileId]: true }));

    try {
      await UploadFileApi.deleteFile(fileId, user?.id);
      
      // Оновлюємо список файлів
      setUploadedFiles(prev => prev.filter(f => (f.id || f.file_id) !== fileId));
      setUploadStatus('✅ Файл успішно видалено!');
      
    } catch (err) {
      console.error("❌ Delete failed:", err);
      setUploadStatus('❌ Помилка видалення файлу: ' + err.message);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [fileId]: false }));
    }
  };

  // Форматування розміру файлу
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Невідомо';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
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
        <h2>Завантажені файли ({uploadedFiles.length})</h2>
        
        {uploadedFiles.length > 0 ? (
          <div className="uploaded-files-list">
            {uploadedFiles.map((file) => {
              const fileId = file.id || file.file_id;
              const isDownloading = downloadLoading[fileId];
              const isDeleting = deleteLoading[fileId];
              
              return (
                <div key={fileId} className="uploaded-file-item">
                  <div className="file-info">
                    <div className="file-header">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{file.file_name || file.name}</span>
                    </div>
                    <div className="file-meta">
                      <span className="file-category">{file.category || 'Загальний'}</span>
                      {file.file_size && (
                        <span className="file-size">{formatFileSize(file.file_size)}</span>
                      )}
                      {file.uploaded_at && (
                        <span className="file-date">
                          {new Date(file.uploaded_at).toLocaleDateString('uk-UA')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="file-actions">
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="download-btn"
                      title="Завантажити файл"
                      disabled={isDownloading || isDeleting}
                    >
                      {isDownloading ? '⏳' : '📥'}
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file)}
                      className="delete-btn"
                      title="Видалити файл"
                      disabled={isDownloading || isDeleting}
                    >
                      {isDeleting ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              );
            })}
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
          margin: 8px 0;
        }

        .warning {
          color: #856404;
          background: #fff3cd;
          padding: 12px;
          border-radius: 6px;
          margin: 8px 0;
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

        .file-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .file-name {
          font-weight: 600;
          color: #2c3e50;
        }

        .file-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .file-category,
        .file-size,
        .file-date {
          color: #6c757d;
          font-size: 0.8rem;
          background: white;
          padding: 2px 8px;
          border-radius: 10px;
          border: 1px solid #dee2e6;
        }

        .file-actions {
          display: flex;
          gap: 8px;
        }

        .download-btn,
        .delete-btn {
          background: none;
          border: none;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }

        .download-btn {
          color: #28a745;
          border: 1px solid #28a745;
        }

        .download-btn:hover:not(:disabled) {
          background: #28a745;
          color: white;
        }

        .download-btn:disabled {
          color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
        }

        .delete-btn {
          color: #dc3545;
          border: 1px solid #dc3545;
        }

        .delete-btn:hover:not(:disabled) {
          background: #dc3545;
          color: white;
        }

        .delete-btn:disabled {
          color: #6c757d;
          border-color: #6c757d;
          cursor: not-allowed;
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