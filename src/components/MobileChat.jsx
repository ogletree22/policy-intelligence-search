import React, { useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import piAILogo from '../assets/PI AI logo.svg';
import './MobileChat.css';

const MobileChat = () => {
  const {
    question,
    setQuestion,
    answer,
    citations,
    isLoading,
    error,
    handleChatSubmit
  } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [answer, error, isLoading, citations]);

  const handleSend = async () => {
    if (!question.trim()) return;
    handleChatSubmit(question);
  };

  return (
    <div className="mobile-chat">
      <div className="chat-messages">
        <div className="message assistant" style={{ width: '100%' }}>
          {error && (
            <div style={{ color: 'red', background: '#ffebee', padding: 8, borderRadius: 8, marginBottom: 12 }}>{error}</div>
          )}
          {answer && (
            <div style={{ whiteSpace: 'pre-wrap' }}>{answer}</div>
          )}
          {citations && citations.length > 0 && (
            <div style={{ marginTop: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
              <div style={{ fontWeight: 600, color: '#274C77', marginBottom: 6 }}>Sources:</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {citations.map((citation, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <a href={citation.pi_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0073bb', textDecoration: 'none', fontWeight: 500 }}>
                      {citation.title}
                    </a>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                      {citation.jurisdiction && `Jurisdiction: ${citation.jurisdiction}`}
                      {citation.source && <div>Source: {citation.source}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isLoading && (
            <div className="typing-indicator" style={{ marginTop: 16 }}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your documents..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !question.trim()}
          aria-label="Send message"
        >
          <img src={piAILogo} alt="Send" className="send-icon" />
        </button>
      </div>
    </div>
  );
};

export default MobileChat; 