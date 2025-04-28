import React from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';

const CitationsPanel = () => {
  const { citations } = useChat();

  return (
    <div className="citations-panel">
      <div className="citations-header">
        Citations
      </div>
      <div className="citations-list">
        {citations && citations.length > 0 ? (
          citations.map((citation, index) => (
            <div key={index} className="citation-item">
              <a
                href={citation.pi_url || citation.url || '#'}
                className="citation-title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {citation.title}
              </a>
              <div className="citation-text">
                {citation.jurisdiction && <div>Jurisdiction: {citation.jurisdiction}</div>}
                {citation.source && <div>Source: {citation.source}</div>}
                {citation.text && <div>{citation.text}</div>}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#888', fontStyle: 'italic', padding: '8px' }}>No citations for this answer.</div>
        )}
      </div>
    </div>
  );
};

export default CitationsPanel; 