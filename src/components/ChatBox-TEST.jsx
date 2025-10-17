import React, { useState, useRef, useEffect } from 'react';
import useOpenAI from '../hooks/useOpenAI';
import "../routes/pages/InsightsPage-TEST-CSS.css";

const ChatComponent = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { loading, error, conversation, sendMessage, clearConversation } = useOpenAI();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Асистент</h2>
        <button onClick={clearConversation} className="clear-btn">
          Очистити чат
        </button>
      </div>

      {error && (
        <div className="error-message">
          Помилка: {error}
        </div>
      )}

      <div className="messages-container">
        {conversation.length === 0 ? (
          <div className="empty-state">
            <p>Задайте питання для початку розмови!</p>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введіть ваше повідомлення..."
            disabled={loading}
            rows={3}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={loading || !inputMessage.trim()}
            className="send-button"
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
