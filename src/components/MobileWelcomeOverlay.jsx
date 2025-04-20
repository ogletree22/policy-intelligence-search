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
              <p>Swipe right to add documents to your working folder</p>
            </div>
            <div className="feature-item">
              <div className="swipe-indicator left">→</div>
              <p>Swipe left to remove documents from your working folder</p>
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
              <p>Yellow triangle indicates a document is in your working folder</p>
            </div>
            <div className="feature-item info">
              <p>Your working folder contents are preserved across multiple searches, allowing you to build your document collection</p>
            </div>
          </div>
        </div>

        <div className="feature-section">
          <h3>Working Folder & Co-Pilot</h3>
          <p>Once you've added documents to your working folder, you can chat with them in the Co-Pilot tab. Ask questions, get summaries, and analyze the content with AI assistance.</p>
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