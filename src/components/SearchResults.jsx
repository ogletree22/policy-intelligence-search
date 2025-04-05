// SearchResults.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useFolderContext } from '../context/FolderContext';
import './SearchResults.css';

const SearchResults = ({ results }) => {
  const { addToFolder, removeFromFolder, currentFolder, currentFolderId } = useFolderContext();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [documentStates, setDocumentStates] = useState({});

  // Reset document states when results or folder changes
  useEffect(() => {
    const newStates = {};
    results.forEach(result => {
      const docId = Number(result.id);
      newStates[docId] = {
        inFolder: currentFolder?.documents?.some(doc => Number(doc.id) === docId) || false
      };
    });
    setDocumentStates(newStates);
  }, [results, currentFolder]);

  const isInFolder = useCallback((documentId) => {
    try {
      if (!documentId || !currentFolder?.documents) {
        return false;
      }
      
      const docId = Number(documentId);
      return currentFolder.documents.some(doc => Number(doc.id) === docId);
    } catch (error) {
      console.error('Error in isInFolder:', error);
      return false;
    }
  }, [currentFolder]);

  const handleFolderAction = useCallback((document) => {
    try {
      if (!document?.id || !currentFolder) {
        console.error('Invalid document or folder:', { document, currentFolder });
        return;
      }

      const docId = Number(document.id);
      const inFolder = isInFolder(docId);
      
      if (inFolder) {
        removeFromFolder(docId);
        setDocumentStates(prev => ({
          ...prev,
          [docId]: { ...prev[docId], inFolder: false }
        }));
      } else {
        const docToAdd = {
          id: docId,
          title: document.title,
          url: document.url,
          description: document.description
        };
        addToFolder(docToAdd);
        setDocumentStates(prev => ({
          ...prev,
          [docId]: { ...prev[docId], inFolder: true }
        }));
      }
    } catch (error) {
      console.error('Error in handleFolderAction:', error);
    }
  }, [isInFolder, addToFolder, removeFromFolder, currentFolder]);

  const toggleDescription = (index) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderResults = () => (
    <div className="results-scroll-area">
      {results.map((result, index) => {
        const docId = Number(result.id);
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
                disabled={!currentFolder}
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
        </p>
        {renderResults()}
      </div>
    </div>
  );
};

export default SearchResults;
