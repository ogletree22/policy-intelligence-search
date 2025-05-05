import React from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';
import { FaTimes } from 'react-icons/fa';

const MessageHistory = ({ onClose }) => {
  const { chatHistory, activeThreadIndex, setActiveThreadIndex } = useChat();

  return (
    <div className="message-history">
      <div className="history-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Message History</h3>
        {onClose && (
          <button
            className="history-btn"
            onClick={onClose}
            style={{ marginLeft: 8 }}
            aria-label="Hide message history"
          >
            Hide
          </button>
        )}
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