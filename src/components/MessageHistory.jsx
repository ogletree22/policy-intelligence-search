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
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#274C77',
              fontSize: 14,
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              marginLeft: 8,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#e7ecef'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
            onFocus={e => e.currentTarget.style.outline = 'none'}
            aria-label="Hide message history"
          >
            <FaTimes />
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