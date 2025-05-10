import React, { useRef, useEffect, useState } from 'react';
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
    handleChatSubmit,
    chatHistory
  } = useChat();
  const messagesEndRef = useRef(null);
  const loadingQuestionRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // Only transition after actual submit
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Crossfade transition for input bar
  const isStartingState = !hasSubmitted && !answer && !error && !isLoading;
  const [inputBarTransition, setInputBarTransition] = useState(isStartingState ? 'centered' : 'bottom');
  const prevIsStartingState = useRef(isStartingState);

  useEffect(() => {
    if (prevIsStartingState.current && !isStartingState) {
      setInputBarTransition('fadingOut');
      setTimeout(() => {
        setInputBarTransition('fadingIn');
        setTimeout(() => {
          setInputBarTransition('bottom');
        }, 700);
      }, 700);
    }
    if (!prevIsStartingState.current && isStartingState) {
      setInputBarTransition('centered');
      setHasSubmitted(false);
    }
    prevIsStartingState.current = isStartingState;
  }, [isStartingState]);

  useEffect(() => {
    if (isLoading && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [chatHistory.length, isLoading, question]);

  const handleSend = async () => {
    if (!question.trim()) return;
    setHasSubmitted(true);
    handleChatSubmit(question);
  };

  return (
    <div className="mobile-chat">
      {!(inputBarTransition === 'centered' || inputBarTransition === 'fadingOut') && (
        <div className="chat-messages" ref={chatMessagesRef}>
          {/* Show the current question at the top while loading */}
          {isLoading && question.trim() && (
            <React.Fragment>
              <div
                className="message user"
                ref={loadingQuestionRef}
                style={{ width: 'auto', marginBottom: 0, alignSelf: 'flex-end', background: '#457b9d', color: 'white', borderRadius: 12, padding: '12px 16px', fontSize: 15, fontWeight: 500, maxWidth: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', wordBreak: 'break-word', display: 'inline-block' }}
              >
                {question}
              </div>
              <div className="message assistant" style={{ width: '100%' }}>
                <div className="typing-indicator" style={{ marginTop: 16 }}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </React.Fragment>
          )}
          {/* Render chat history below the current Q&A */}
          {chatHistory && chatHistory.length > 0 && [...chatHistory].reverse().map((entry, idx) => (
            <React.Fragment key={chatHistory.length - 1 - idx}>
              <div
                className="message user"
                ref={!isLoading && idx === 0 ? messagesEndRef : null}
                style={{ width: 'auto', marginBottom: 0, alignSelf: 'flex-end', background: '#457b9d', color: 'white', borderRadius: 12, padding: '12px 16px', fontSize: 15, fontWeight: 500, maxWidth: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', wordBreak: 'break-word', display: 'inline-block' }}
              >
                {entry.question}
              </div>
              <div className="message assistant" style={{ width: '100%' }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{entry.answer}</div>
                {entry.citations && entry.citations.length > 0 && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid #e0e0e0', paddingTop: '10px' }}>
                    <div style={{ fontWeight: 600, color: '#274C77', marginBottom: 6 }}>Sources:</div>
                    <ul style={{ paddingLeft: 16, margin: 0 }}>
                      {entry.citations.map((citation, cidx) => (
                        <li key={cidx} style={{ marginBottom: 8 }}>
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
              </div>
            </React.Fragment>
          ))}
          {/* Show error for the current message if present */}
          {error && (
            <div className="message assistant" style={{ width: '100%' }}>
              <div style={{ color: 'red', background: '#ffebee', padding: 8, borderRadius: 8, marginBottom: 12 }}>{error}</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      {/* Crossfade input bar: centered (fade-out) and bottom (fade-in) */}
      {(inputBarTransition === 'centered' || inputBarTransition === 'fadingOut') && (
        <>
          <div className={`chat-input centered crossfade${inputBarTransition === 'fadingOut' ? ' fade-out' : ''}`}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              maxWidth: 480,
              boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
              borderRadius: 18,
              zIndex: 200
            }}
          >
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
          {/* Cheat: cover the bottom with a box in the starting state of Co-Pilot */}
          <div style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: 64,
            background: '#f8f9fa',
            zIndex: 101
          }} />
        </>
      )}
      {(inputBarTransition === 'bottom' || inputBarTransition === 'fadingIn') && (
        <div className={`chat-input crossfade${inputBarTransition === 'fadingIn' ? ' fade-in' : ''}`}>
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
      )}
    </div>
  );
};

export default MobileChat; 