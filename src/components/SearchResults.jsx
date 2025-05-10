// SearchResults.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { useSearchPage } from '../context/SearchPageContext';
import './SearchResults.css';

const SearchResults = () => {
  const { 
    workingFolderDocs, 
    addToWorkingFolder, 
    removeFromWorkingFolder, 
    createFolderRemote, 
    addToFolder,
    addToFolderRemote, 
    folders,
    loadFolders 
  } = useWorkingFolder();
  const { results, loading, error, usingMockData } = useSearchPage();
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [documentStates, setDocumentStates] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipingStates, setSwipingStates] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Load folders when component mounts
  useEffect(() => {
    console.log("SearchResults component mounted - loading folders");
    loadFolders();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Test function to directly create a folder
  const testCreateFolder = async () => {
    console.log("Test creating folder directly");
    try {
      const newFolder = await createFolderRemote("Test Folder " + new Date().toISOString().substring(0, 19));
      console.log("Test folder created:", newFolder);
    } catch (error) {
      console.error("Error creating test folder:", error);
    }
  };

  // Test function to add a document to a folder
  const testAddDocToFolder = async () => {
    if (folders.length === 0 || results.length === 0) {
      console.error("Need folders and results to test adding documents");
      return;
    }

    const targetFolder = folders[0];
    const testDoc = results[0];
    
    console.log("✅✅✅ TEST: Adding document to folder ✅✅✅");
    console.log("Target folder:", targetFolder);
    console.log("Test document:", testDoc);
    
    try {
      const docToAdd = {
        id: testDoc.id,
        title: testDoc.title, 
        url: testDoc.url,
        description: testDoc.description,
        jurisdiction: testDoc.jurisdiction,
        type: testDoc.type
      };
      
      console.log("Document prepared:", docToAdd);
      const success = await addToFolderRemote(docToAdd, targetFolder.id);
      console.log("Add document result:", success ? "SUCCESS" : "FAILED");
    } catch (error) {
      console.error("Error in test add document:", error);
    }
  };

  const handleFolderAction = useCallback(async (document) => {
    const docId = document.id;
    const inFolder = workingFolderDocs.some(doc => doc.id === docId);
    
    console.log("✅✅✅ handleFolderAction called for document ✅✅✅", document);
    console.log("Document in folder:", inFolder);
    
    if (inFolder) {
      removeFromWorkingFolder(docId);
    } else {
      try {
        // Check if "My Session Folder" exists
        let sessionFolder = folders.find(folder => folder.name === "My Session Folder");
        console.log("✅✅✅ Current folders ✅✅✅", folders);
        console.log("✅✅✅ Session folder found ✅✅✅", sessionFolder);
        
        // If not, create it
        if (!sessionFolder) {
          console.log("✅✅✅ Creating 'My Session Folder' ✅✅✅");
          sessionFolder = await createFolderRemote("My Session Folder");
          console.log("✅✅✅ createFolderRemote returned ✅✅✅", sessionFolder);
          
          if (!sessionFolder) {
            console.error("✅✅✅ Failed to create session folder ✅✅✅");
            // Fallback to working folder if folder creation fails
            addToWorkingFolder({
              id: docId,
              title: document.title,
              url: document.url,
              description: document.description,
              jurisdiction: document.jurisdiction,
              type: document.type
            });
            return;
          }
        }
        
        // Add document to the folder
        const docToAdd = {
          id: docId,
          title: document.title,
          url: document.url,
          description: document.description,
          jurisdiction: document.jurisdiction,
          type: document.type
        };
        
        console.log("✅✅✅ Document to add ✅✅✅", docToAdd);
        console.log("✅✅✅ Target folder ✅✅✅", sessionFolder.id);
        
        // This will now call our updated implementation
        console.log("✅✅✅ Calling addToFolderRemote ✅✅✅");
        const result = await addToFolderRemote(docToAdd, sessionFolder.id);
        console.log("✅✅✅ addToFolderRemote result ✅✅✅", result);
        
      } catch (error) {
        console.error("✅✅✅ Error in handleFolderAction ✅✅✅", error);
        // On error, fall back to adding to working folder
        addToWorkingFolder({
          id: docId,
          title: document.title,
          url: document.url,
          description: document.description,
          jurisdiction: document.jurisdiction,
          type: document.type
        });
      }
    }
  }, [workingFolderDocs, removeFromWorkingFolder, folders, createFolderRemote, addToFolderRemote, addToWorkingFolder]);

  const handleTouchStart = (e, docId) => {
    if (!isMobile) return;
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
      docId
    });
    setTouchEnd(null);
  };

  const handleTouchMove = (e, docId) => {
    if (!isMobile || !touchStart) return;
    
    const xDiff = touchStart.x - e.targetTouches[0].clientX;
    const yDiff = touchStart.y - e.targetTouches[0].clientY;
    
    // If vertical scrolling is dominant, don't trigger swipe
    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      setSwipingStates({});
      return;
    }

    // Only trigger swipe if horizontal movement is significant
    if (Math.abs(xDiff) > 10) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        docId
      });

      setSwipingStates(prev => ({
        ...prev,
        [docId]: xDiff
      }));
    }
  };

  const handleTouchEnd = (doc) => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const swipeDistance = touchStart.x - touchEnd.x;
    const minSwipeDistance = 100; // minimum distance for swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      const isInFolder = workingFolderDocs.some(wDoc => wDoc.id === doc.id);
      
      if (swipeDistance > 0) { // Swipe left to remove
        if (isInFolder) {
          removeFromWorkingFolder(doc.id);
        }
      } else { // Swipe right to add
        if (!isInFolder) {
          // Use the same logic as handleFolderAction
          handleFolderAction(doc);
        }
      }
    }

    // Reset states
    setTouchStart(null);
    setTouchEnd(null);
    setSwipingStates(prev => ({
      ...prev,
      [doc.id]: 0
    }));
  };

  const getSwipeStyle = (docId) => {
    if (!isMobile || !touchStart || touchStart.docId !== docId || !swipingStates[docId]) return {};
    
    const swipeDistance = swipingStates[docId];
    const maxSwipe = 150;
    const limitedSwipe = Math.max(Math.min(swipeDistance, maxSwipe), -maxSwipe);
    const opacity = 1 - (Math.abs(limitedSwipe) / maxSwipe) * 0.3;
    
    return {
      transform: `translateX(${-limitedSwipe}px)`,
      opacity
    };
  };

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

  if (!results || results.length === 0) {
    return null;
  }

  const renderResults = () => (
    <div className="results-scroll-area">
      {results.map((result, index) => {
        const docId = result.id;
        const inFolder = documentStates[docId]?.inFolder || false;
        
        return (
          <div 
            key={index} 
            className={`result-card ${inFolder ? 'in-folder' : ''}`}
            onTouchStart={(e) => handleTouchStart(e, docId)}
            onTouchMove={(e) => handleTouchMove(e, docId)}
            onTouchEnd={() => handleTouchEnd(result)}
            style={getSwipeStyle(docId)}
          >
            {isMobile && <div className="folder-indicator" />}
            <div className="result-header">
              <h3 className="result-title">
                <a href={result.url} target="_blank" rel="noopener noreferrer">{result.title}</a>
              </h3>
              {!isMobile && (
                <button 
                  className={`add-to-folder-btn ${inFolder ? 'in-folder' : ''}`}
                  onClick={() => {
                    // DIRECT TEST: Skip handleFolderAction and test API directly
                    if (folders.length > 0) {
                      const targetFolder = folders[0]; // Use the first folder
                      const docToAdd = {
                        id: result.id,
                        title: result.title,
                        url: result.url,
                        description: result.description,
                        jurisdiction: result.jurisdiction,
                        type: result.type
                      };
                      
                      console.log("🔴🔴🔴 DIRECT TEST: Adding document to folder 🔴🔴🔴");
                      console.log("Document:", docToAdd);
                      console.log("Target folder:", targetFolder);
                      
                      // Call API directly
                      addToFolderRemote(docToAdd, targetFolder.id)
                        .then(success => {
                          console.log("🔴🔴🔴 Document add result:", success ? "SUCCESS" : "FAILED", "🔴🔴🔴");
                        })
                        .catch(error => {
                          console.error("🔴🔴🔴 Error adding document:", error, "🔴🔴🔴");
                        });
                    } else {
                      console.error("🔴🔴🔴 No folders available for testing 🔴🔴🔴");
                    }
                  }}
                >
                  {inFolder ? 'Remove' : 'Add to Folder (DIRECT TEST)'}
                </button>
              )}
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
            {isMobile && (
              <div className="swipe-hint">
                {inFolder ? '← Swipe left to remove' : '→ Swipe right to add'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="results-container">
      <div className="results-content">
        {/* Debug button - placed before everything else */}
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#e0f7fa', 
          border: '2px solid #4fc3f7',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <button 
            onClick={testCreateFolder} 
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#2196f3', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Test Create Folder
          </button>
          <button 
            onClick={testAddDocToFolder} 
            style={{ 
              padding: '8px 15px', 
              backgroundColor: '#f44336', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Test Add Doc to Folder
          </button>
          <p style={{ marginTop: '5px', fontSize: '12px', color: '#444' }}>
            Debug buttons for testing folder operations
          </p>
        </div>
        
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
