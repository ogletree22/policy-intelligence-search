import React from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';

const MessageHistory = () => {
  const { chatHistory, activeThreadIndex, setActiveThreadIndex } = useChat();

  return (
    <div className="message-history">
      <div className="history-header">
        <h3>Message History</h3>
      </div>
      <div className="history-list">
        {chatHistory.length === 0 ? (
          <div className="history-item">No chat history yet.</div>
        ) : (
          chatHistory.map((thread, idx) => (
            <div
              key={idx}
              className={`history-item${activeThreadIndex === idx ? ' active' : ''}`}
              onClick={() => setActiveThreadIndex(idx)}
              style={{ cursor: 'pointer' }}
            >
              {thread.question}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessageHistory; 