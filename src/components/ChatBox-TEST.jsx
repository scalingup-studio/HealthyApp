import React, { useState, useRef, useEffect } from 'react';
import useOpenAI from '../hooks/useOpenAI';
import "../routes/pages/InsightsPage-TEST-CSS.css";

const ChatComponent = () => {
  const [inputMessage, setInputMessage] = useState('');
  const { loading, error, conversation, sendMessage, clearConversation } = useOpenAI();
  const messagesEndRef = useRef(null);
  const [showDisclaimer] = useState(true);

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
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>AI Health Assistant</h2>
        <button onClick={clearConversation} className="clear-btn">
          Clear Chat
        </button>
      </div>

      {showDisclaimer && conversation.length === 0 && (
        <div style={{
          background: "rgba(0, 186, 206, 0.1)",
          border: "1px solid rgba(0, 186, 206, 0.3)",
          borderRadius: 8,
          padding: 12,
          margin: 12,
          fontSize: 12,
          color: "var(--muted)"
        }}>
          <strong>Important:</strong> This AI assistant provides general health information and educational content only. 
          It is not a substitute for professional medical advice. For specific health concerns, please consult with a healthcare professional.
        </div>
      )}

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      <div className="messages-container">
        {conversation.length === 0 ? (
          <div className="empty-state">
            <p>Ask a question to start the conversation!</p>
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
            placeholder="Type your message here..."
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
