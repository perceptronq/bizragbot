import { useState, useEffect } from 'react';
import { saveChatMessage, fetchChatHistory } from '../lib/chat';
import { ChatMessage } from '../lib/types';

export const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async () => {
    const { data, error } = await saveChatMessage(message);
    if (error) {
      setError(error);
    } else {
      setMessage(''); // Clear input field on successful send
      setError(null); // Clear error
      setChatHistory([data as ChatMessage, ...chatHistory]); // Update chat history
    }
  };

  useEffect(() => {
    const loadChatHistory = async () => {
      const { data, error } = await fetchChatHistory();
      if (!error) {
        setChatHistory(data ?? []);
      }
    };

    loadChatHistory();
  }, []);

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {chatHistory.map((chat) => (
          <p key={chat.id}>
            <strong>{chat.created_at}</strong>: {chat.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
      {error && <p>{error}</p>}
    </div>
  );
};

