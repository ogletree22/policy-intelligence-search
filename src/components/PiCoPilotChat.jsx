import React, { useState } from 'react';
import './PiCoPilot.css';

const PiCoPilotChat = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://gbgi989gbe.execute-api.us-west-2.amazonaws.com/sbx/kb-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          contextPrompt: "Answer the question as completely as possible by using content retrieved from diverse sources (at least 4 distinct documents) and diverse document types rather than repeating a single document, unless otherwise instructed"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
      
      // Deduplicate citations by pi_url or title
      const uniqueCitations = [];
      const seenUrls = new Set();
      
      if (data.citations && data.citations.length > 0) {
        data.citations.forEach(citation => {
          // Use pi_url as unique identifier, or title if pi_url is not available
          const uniqueId = citation.pi_url || citation.title;
          if (!seenUrls.has(uniqueId)) {
            seenUrls.add(uniqueId);
            uniqueCitations.push(citation);
          }
        });
      }
      
      setCitations(uniqueCitations);
    } catch (err) {
      setError(err.message || 'Failed to fetch response');
    } finally {
      setIsLoading(false);
    }
  };

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

        {answer && (
          <div className="message">
            <img src="/ai-avatar.png" alt="AI" className="message-avatar" />
            <div className="message-content" style={{ whiteSpace: 'pre-wrap' }}>
              {answer}
              
              {citations && citations.length > 0 && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '16px', marginBottom: '10px', color: '#274C77' }}>Sources:</h4>
                  <ul style={{ paddingLeft: '20px' }}>
                    {citations.map((citation, index) => (
                      <li key={index} style={{ marginBottom: '10px' }}>
                        <a 
                          href={citation.pi_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#0073bb', textDecoration: 'none', fontWeight: '500' }}
                        >
                          {citation.title}
                        </a>
                        <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>
                          {citation.jurisdiction && `Jurisdiction: ${citation.jurisdiction}`}
                          {citation.source && (
                            <div>Source: {citation.source}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input-container" style={{ position: 'relative', zIndex: 20 }}>
        <form onSubmit={handleSubmit} className="chat-input-wrapper" style={{ position: 'relative', zIndex: 30 }}>
          <textarea
            className="chat-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            rows="1"
            style={{ position: 'relative', zIndex: 40, pointerEvents: 'auto' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button 
            type="submit" 
            className="send-button"
            style={{ position: 'relative', zIndex: 40, pointerEvents: 'auto' }}
            disabled={isLoading || !question.trim()}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PiCoPilotChat; 