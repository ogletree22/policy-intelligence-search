import React, { useState } from 'react';
import './PiCoPilot.css';
import aiAvatar from '../assets/ai-technology.png';

const ChatArea = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      console.log('Message submitted:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="breadcrumb">
          <span>Pi Co-Pilot</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span>HDV NOx research</span>
        </div>
      </div>

      <div className="chat-messages">
        {/* Example message */}
        <div className="message">
          <img 
            src={aiAvatar}
            alt="AI" 
            className="message-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIxNiIgZmlsbD0iIzQ1N2I5ZCIvPjx0ZXh0IHg9IjE2IiB5PSIyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+';
            }}
          />
          <div className="message-content">
            Compare the documents and identify a proposal for New Jersey to adopt rules for heavy duty vehicle NOx reduction requirements include off ramps for HDV below 2 tons. Also include provisions for low income communities.
          </div>
        </div>
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSubmit}>
          <div className="chat-input-wrapper">
            <textarea
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message PI Co-Pilot..."
              rows={1}
            />
            <button type="submit" className="send-button">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea; 