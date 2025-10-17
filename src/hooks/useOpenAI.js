// hooks/useOpenAI.js
import { useState, useCallback } from 'react';
import axios from 'axios';

const useOpenAI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState([]);

  const sendMessage = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        'https://your-xano-domain.xano.io/api/v1/chat',
        {
          message: message,
          conversation_history: conversation
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        const newConversation = [
          ...conversation,
          { role: 'user', content: message },
          { role: 'assistant', content: response.data.response }
        ];
        
        setConversation(newConversation);
        return response.data.response;
      } else {
        throw new Error(response.data.error);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [conversation]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    conversation,
    sendMessage,
    clearConversation
  };
};

export default useOpenAI;