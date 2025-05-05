import React from 'react';
import './PiCoPilot.css';
import { useChat } from '../context/ChatContext';
import aiTechnology from '../assets/Pi-CoPilot_Beta.svg';
import searchIcon from '../assets/Search-Icon.png';
import LoadingSpinner from './LoadingSpinner';
import { FaUser } from 'react-icons/fa';

const PiCoPilotChat = ({ showHistory, setShowHistory, showToggleButton }) => {
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
      <div className="chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
          <h3 style={{ margin: 0, fontWeight: 600 }}>
            Policy Intelligence Co-Pilot
          </h3>
          <sub style={{ fontStyle: 'italic', fontSize: '0.7em', color: '#6096ba', marginLeft: 0, fontWeight: 550 }}>
            Beta
          </sub>
        </span>
        {showToggleButton && (
          <button
            style={{
              background: '#457B9D',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '2px 10px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
              outline: 'none',
              marginLeft: 12,
              whiteSpace: 'nowrap',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#274C77'}
            onMouseOut={e => e.currentTarget.style.background = '#457B9D'}
            onFocus={e => e.currentTarget.style.outline = 'none'}
            onClick={() => setShowHistory(true)}
          >
            Show History
          </button>
        )}
      </div>
      <div className="chat-messages">
        {error && (
          <div style={{ color: 'red', margin: '20px 0', padding: '10px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '120px' }}>
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && thread && (
          <>
            {/* User message */}
            <div className="message user" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div className="message-content" style={{ whiteSpace: 'pre-wrap', marginRight: '12px' }}>
                {thread.question}
              </div>
              {/* User avatar (FaUser icon) */}
              <span className="user-icon" style={{ marginLeft: 0 }}>
                <FaUser />
              </span>
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