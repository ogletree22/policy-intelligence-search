import React from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';
import aiTechnology from '../assets/AI-technology.png';
import searchIcon from '../assets/Search-Icon.png';

const PiCoPilotChat = () => {
  const {
    question,
    setQuestion,
    answer,
    citations,
    isLoading,
    error,
    handleChatSubmit,
    chatHistory,
    activeThreadIndex
  } = useChat();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    handleChatSubmit(question);
  };

  // Determine which thread to display
  const thread =
    typeof activeThreadIndex === 'number' && chatHistory[activeThreadIndex]
      ? chatHistory[activeThreadIndex]
      : null;

  return (
    <div className="chat-container" style={{ position: 'relative', zIndex: 10 }}>
      <div className="chat-header">
        <h3>Policy Intelligence CoPilot</h3>
      </div>
      <div className="chat-messages">
        {error && (
          <div style={{ color: 'red', margin: '20px 0', padding: '10px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {thread && (
          <>
            {/* User message */}
            <div className="message user">
              <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
                {thread.question}
              </div>
            </div>
            {/* Co-pilot (AI) message */}
            <div className="message">
              <img src={aiTechnology} alt="AI" className="message-avatar" />
              <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
                {thread.answer}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="search-input-container" style={{ position: 'relative', zIndex: 20 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', position: 'relative' }}>
          <img src={searchIcon} alt="Search" className="search-input-icon" />
          <input
            type="text"
            className="dynamic-search-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            style={{ width: '100%' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit" 
            className="dynamic-search-button"
            disabled={isLoading || !question.trim()}
            style={{ marginLeft: 0 }}
          >
            {isLoading ? 'Loading...' : 'Ask'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PiCoPilotChat; 