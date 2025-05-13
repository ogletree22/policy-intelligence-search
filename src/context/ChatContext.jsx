import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ChatContext = createContext();

const LOCAL_STORAGE_KEY = 'copilotChatHistory';
const THREAD_ID_KEY = 'copilotThreadId';
const SHOW_HISTORY_KEY = 'copilotShowHistory';

export const ChatProvider = ({ children }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeThreadIndex, setActiveThreadIndex] = useState(null);
  const [lastQuestion, setLastQuestion] = useState('');
  const [threadId, setThreadId] = useState('');
  const [showHistory, setShowHistory] = useState(() => {
    const stored = localStorage.getItem(SHOW_HISTORY_KEY);
    return stored === null ? false : stored === 'true';
  });

  // Load chat history and threadId from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setChatHistory(JSON.parse(stored));
    }
    
    // Initialize or load threadId
    const storedThreadId = localStorage.getItem(THREAD_ID_KEY);
    if (storedThreadId) {
      setThreadId(storedThreadId);
    } else {
      const newThreadId = uuidv4();
      setThreadId(newThreadId);
      localStorage.setItem(THREAD_ID_KEY, newThreadId);
    }
  }, []);

  // Persist chat history to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Persist threadId to localStorage
  useEffect(() => {
    if (threadId) {
      localStorage.setItem(THREAD_ID_KEY, threadId);
    }
  }, [threadId]);

  useEffect(() => {
    localStorage.setItem(SHOW_HISTORY_KEY, showHistory);
  }, [showHistory]);

  const handleChatSubmit = async (newQuestion) => {
    if (!newQuestion.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://gbgi989gbe.execute-api.us-west-2.amazonaws.com/sbx/kb-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          threadId: threadId,
          question: newQuestion,
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
          const uniqueId = citation.pi_url || citation.title;
          if (!seenUrls.has(uniqueId)) {
            seenUrls.add(uniqueId);
            uniqueCitations.push(citation);
          }
        });
      }
      
      setCitations(uniqueCitations);

      // Add to chat history
      setChatHistory(prev => {
        const newHistory = [...prev, {
          question: newQuestion,
          answer: data.answer,
          citations: uniqueCitations,
          timestamp: new Date().toISOString()
        }];
        setActiveThreadIndex(newHistory.length - 1);
        return newHistory;
      });

      // Clear the question input after successful submission
      setQuestion('');

    } catch (err) {
      setError(err.message || 'Failed to fetch response');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setQuestion('');
    setAnswer('');
    setCitations([]);
    setError(null);
    // Generate new threadId when clearing chat
    const newThreadId = uuidv4();
    setThreadId(newThreadId);
    localStorage.setItem(THREAD_ID_KEY, newThreadId);
  };

  return (
    <ChatContext.Provider value={{
      question,
      setQuestion,
      answer,
      setAnswer,
      citations,
      setCitations,
      isLoading,
      error,
      chatHistory,
      setChatHistory,
      activeThreadIndex,
      setActiveThreadIndex,
      handleChatSubmit,
      clearChat,
      lastQuestion,
      setLastQuestion,
      threadId,
      showHistory,
      setShowHistory
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 