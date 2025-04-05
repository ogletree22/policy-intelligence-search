import React from 'react';
import './PiCoPilot.css';

const MessageHistory = () => {
  // Example history items
  const historyItems = [
    'Tell me about PM2.5 regulations in...',
    'How does California\'s oil and gas e...',
    'Tell me about PM2.5 regulations in...',
    'What bills related to electric vehicl...',
    'How have states implemented co...',
    'What state-level policies incentiv...',
    'Which cities have adopted congest...',
  ];

  return (
    <div className="message-history">
      <div className="history-header">
        <h3>Message History</h3>
      </div>
      <div className="history-list">
        {historyItems.map((item, index) => (
          <div key={index} className="history-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory; 