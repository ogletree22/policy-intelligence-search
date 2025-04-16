// SearchResults.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { useSearchPage } from '../context/SearchPageContext';
import './SearchResults.css';

const SearchResults = () => {
  const { workingFolderDocs, addToWorkingFolder, removeFromWorkingFolder } = useWorkingFolder();
  const { results, loading, error, usingMockData } = useSearchPage();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [documentStates, setDocumentStates] = useState({});

  // Reset document states when results or folder changes
  useEffect(() => {
    const newStates = {};
    results.forEach(result => {
      const docId = result.id;
      newStates[docId] = {
        inFolder: workingFolderDocs.some(doc => doc.id === docId)
      };
    });
    setDocumentStates(newStates);
  }, [results, workingFolderDocs]);

  const handleFolderAction = useCallback((document) => {
    const docId = document.id;
    const inFolder = workingFolderDocs.some(doc => doc.id === docId);
    
    if (inFolder) {
      removeFromWorkingFolder(docId);
      setDocumentStates(prev => ({
        ...prev,
        [docId]: { ...prev[docId], inFolder: false }
      }));
    } else {
      addToWorkingFolder({
        id: docId,
        title: document.title,
        url: document.url,
        description: document.description,
        jurisdiction: document.jurisdiction,
        type: document.type
      });
      setDocumentStates(prev => ({
        ...prev,
        [docId]: { ...prev[docId], inFolder: true }
      }));
    }
  }, [workingFolderDocs, addToWorkingFolder, removeFromWorkingFolder]);

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-container">
        <div className="error-message">
          Error loading results. Please try again.
        </div>
      </div>
    );
  }

  const renderResults = () => (
    <div className="results-scroll-area">
      {results.map((result, index) => {
        const docId = result.id;
        const inFolder = documentStates[docId]?.inFolder || false;
        
        return (
          <div key={index} className="result-card">
            <div className="result-header">
              <h3 className="result-title">
                <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
              </h3>
              <button 
                className={`add-to-folder-btn ${inFolder ? 'in-folder' : ''}`}
                onClick={() => handleFolderAction(result)}
              >
                {inFolder ? 'Remove' : 'Add to Folder'}
              </button>
            </div>
            <div className="description-container">
              <p 
                className={`result-description ${expandedDescriptions[index] ? 'expanded' : ''}`}
                onClick={() => toggleDescription(index)}
              >
                {result.description}
              </p>
            </div>
            <div className="result-footer">
              <div className="result-tags">
                <span className="tag">{result.jurisdiction}</span>
                <span className="tag">{result.type}</span>
              </div>
              {usingMockData && (
                <div className="mock-data-indicator">
                  Demo Data
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="results-container">
      <div className="results-content">
        <p className="doc-count">
          {results.length} of {results.length} documents
          {usingMockData && <span className="mock-data-text"> (Demo Data)</span>}
        </p>
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchResults;
