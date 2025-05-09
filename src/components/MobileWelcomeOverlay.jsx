import React from 'react';
import './MobileWelcomeOverlay.css';

const MobileWelcomeOverlay = ({ onClose }) => {
  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <h2>Welcome to Policy Intelligence!</h2>
        <p>Your AI-powered platform for analyzing and understanding policy documents.</p>
        
        <div className="feature-section">
          <h3>How to Use</h3>
          <div className="feature-items">
            <div className="feature-item">
              <div className="swipe-indicator right">→</div>
              <p>Swipe right to add documents to your mobile folder</p>
            </div>
            <div className="feature-item">
              <div className="swipe-indicator left">→</div>
              <p>Swipe left to remove documents from your mobile folder</p>
            </div>
          </div>
        </div>

        <div className="feature-section">
          <h3>Document Management</h3>
          <div className="feature-items">
            <div className="feature-item">
              <div className="swipe-indicator folder">
                <span className="folder-triangle"></span>
              </div>
              <p>Yellow triangle indicates a document is in your mobile folder</p>
            </div>
            <div className="feature-item info">
              <p>Your mobile folders persist across multiple searches and sync seamlessly with the web interface, letting you build and organize your document collection. Later, you can move saved items from your mobile folder into other folders using the web platform.</p>
            </div>
          </div>
        </div>

        <div className="feature-section">
          <h3>PI Co-Pilot</h3>
          <p>Co-Pilot allows for natural language questions and delivers precise, source-backed answers by drawing on the full PI database, with direct links to original policy documents.</p>
        </div>

        <button 
          className="got-it-button"
          onClick={onClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default MobileWelcomeOverlay; 