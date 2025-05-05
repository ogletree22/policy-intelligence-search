import React, { useState, useEffect } from 'react';
import { useSearchPage } from '../context/SearchPageContext';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { FaFolderPlus, FaFolderMinus, FaThLarge, FaList, FaGlobe, FaChevronDown, FaChevronLeft, FaChevronRight, FaChevronUp } from 'react-icons/fa';
import dynamicSearchIcon from '../assets/dynamic_search_ii.svg';
import './DynamicSearch.css';

const DynamicSearch = () => {
  const { handleSearch, results, loading, error, searchQuery, setSearchQuery } = useSearchPage();
  const { workingFolderDocs, addToWorkingFolder, removeFromWorkingFolder } = useWorkingFolder();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'folder' or 'jurisdiction'
  const [searchInitiated, setSearchInitiated] = useState(false);
  const [expandedJurisdictions, setExpandedJurisdictions] = useState(new Set());
  const resultsPerPage = 25; // Show 25 results per page, for a smoother experience
  const maxResults = 100; // Maximum results to display
  
  const suggestedSearches = [
    'NOx reduction',
    'HDV regulations',
    'Landfills',
    'Refinery'
  ];
  
  // Reset pagination when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchInitiated(true);
    handleSearch(searchQuery);
  };
  
  // Add effect to handle loading state
  useEffect(() => {
    if (loading) {
      setSearchInitiated(true);
    }
  }, [loading]);

  // Add effect to handle results
  useEffect(() => {
    if (results.length > 0) {
      setSearchInitiated(true);
    }
  }, [results]);
  
  const handleSuggestedSearch = (suggestion) => {
    setSearchQuery(suggestion);
    setSearchInitiated(true);
    handleSearch(suggestion);
  };
  
  // Calculate current results for pagination
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(0, maxResults).slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(Math.min(results.length, maxResults) / resultsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Create an array of available page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Handle next and previous page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Helper function to get document type safely - handles different property names
  const getDocumentType = (result) => {
    // Try different possible property names for document type
    return result.type || result.documentType || result.DocumentType || 'Unknown';
  };

  // Check if a document is in the working folder
  const isInWorkingFolder = (doc) => {
    return workingFolderDocs.some(workingDoc => 
      workingDoc.id === doc.id ||
      workingDoc.url === doc.url || 
      workingDoc.title === doc.title
    );
  };
  
  // Group results by jurisdiction
  const groupedResults = currentResults.reduce((acc, result) => {
    const jurisdiction = result.jurisdiction || 'Other';
    if (!acc[jurisdiction]) {
      acc[jurisdiction] = [];
    }
    acc[jurisdiction].push(result);
    return acc;
  }, {});

  // Sort jurisdictions alphabetically
  const sortedJurisdictions = Object.keys(groupedResults).sort();
  
  const toggleJurisdiction = (jurisdiction) => {
    setExpandedJurisdictions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jurisdiction)) {
        newSet.delete(jurisdiction);
      } else {
        newSet.add(jurisdiction);
      }
      return newSet;
    });
  };

  // Add state for jurisdiction pagination
  const [jurisdictionPages, setJurisdictionPages] = useState({});
  const PREVIEW_COUNT = 3;
  const DOCS_PER_PAGE = 10;

  // Initialize or update jurisdiction pages when results change
  useEffect(() => {
    const newPages = {};
    Object.keys(groupedResults).forEach(jurisdiction => {
      newPages[jurisdiction] = 1;
    });
    setJurisdictionPages(newPages);
  }, [results]);

  const handleJurisdictionPage = (jurisdiction, direction) => {
    setJurisdictionPages(prev => {
      const totalPages = Math.ceil(groupedResults[jurisdiction].length / DOCS_PER_PAGE);
      const currentPage = prev[jurisdiction] || 1;
      const newPage = direction === 'next' 
        ? Math.min(currentPage + 1, totalPages)
        : Math.max(currentPage - 1, 1);
      return { ...prev, [jurisdiction]: newPage };
    });
  };

  const getJurisdictionDocs = (jurisdiction, preview = false) => {
    const docs = groupedResults[jurisdiction];
    if (preview) {
      return docs.slice(0, PREVIEW_COUNT);
    }
    const page = jurisdictionPages[jurisdiction] || 1;
    const start = (page - 1) * DOCS_PER_PAGE;
    return docs.slice(start, start + DOCS_PER_PAGE);
  };

  const renderResultCard = (result, index) => (
    <div key={`${result.id || index}`} className="result-card">
      <div className="result-card-header">
        <h3>
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            {result.title}
          </a>
        </h3>
        <button
          className={`folder-button ${isInWorkingFolder(result) ? 'in-folder' : ''}`}
          onClick={() => {
            if (isInWorkingFolder(result)) {
              removeFromWorkingFolder(result.id);
            } else {
              addToWorkingFolder(result);
            }
          }}
          title={isInWorkingFolder(result) ? "Remove from working folder" : "Add to working folder"}
        >
          {isInWorkingFolder(result) ? <FaFolderMinus /> : <FaFolderPlus />}
        </button>
      </div>
      <p className="result-description">{result.description}</p>
      <div className="result-meta">
        <span className="result-jurisdiction">{result.jurisdiction}</span>
        <span className="result-type">{getDocumentType(result)}</span>
      </div>
    </div>
  );
  
  return (
    <div className={`dynamic-search-container ${!results.length && !loading ? 'empty-state' : ''}`}>
      {(!results.length && !loading) && (
        <div className="dynamic-search-header">
          <h1>Dynamic Search</h1>
          <p>An advanced search experience with real-time filtering and visualization</p>
        </div>
      )}
      
      <div className="search-input-container">
        <form onSubmit={handleSubmit}>
          <img src={dynamicSearchIcon} alt="Dynamic Search" className="search-input-icon" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="dynamic-search-input"
          />
          <button type="submit" className="dynamic-search-button">
            Search
          </button>
        </form>
        <div className="layout-toggle">
          <button 
            className={viewMode === 'grid' ? 'active' : ''} 
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <FaThLarge />
          </button>
          <button 
            className={viewMode === 'folder' ? 'active' : ''} 
            onClick={() => setViewMode('folder')}
            title="List View"
          >
            <FaList />
          </button>
          <button 
            className={viewMode === 'jurisdiction' ? 'active' : ''} 
            onClick={() => setViewMode('jurisdiction')}
            title="Jurisdiction View"
          >
            <FaGlobe />
          </button>
        </div>
      </div>
      
      {!searchInitiated && !loading && (
        <div className="suggested-searches">
          {suggestedSearches.map((suggestion, index) => (
            <button
              key={index}
              className="suggested-search-item"
              onClick={() => handleSuggestedSearch(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      
      {loading && (
        <div className="dynamic-search-loading">
          <div className="spinner" />
          <p>Loading results...</p>
        </div>
      )}
      
      {error && (
        <div className="dynamic-search-error">
          <p>Error: {error.message}</p>
        </div>
      )}
      
      <div className="dynamic-search-results">
        {results.length > 0 && !loading && (
          <>
            <div className="results-summary">
              <p>
                Showing {indexOfFirstResult + 1}-{Math.min(indexOfLastResult, Math.min(results.length, maxResults))} of {Math.min(results.length, maxResults)} documents
                {results.length > maxResults && ` (displaying first ${maxResults} of ${results.length} total results)`}
              </p>
            </div>
            
            <div className={`results-grid ${viewMode}-view`}>
              {viewMode === 'jurisdiction' ? (
                sortedJurisdictions.map(jurisdiction => {
                  const isExpanded = expandedJurisdictions.has(jurisdiction);
                  const totalDocs = groupedResults[jurisdiction].length;
                  const currentPage = jurisdictionPages[jurisdiction] || 1;
                  const totalPages = Math.ceil(totalDocs / DOCS_PER_PAGE);
                  const start = (currentPage - 1) * DOCS_PER_PAGE;
                  const end = Math.min(start + DOCS_PER_PAGE, totalDocs);

                  return (
                    <div 
                      key={jurisdiction} 
                      className={`jurisdiction-group ${isExpanded ? 'expanded' : ''}`}
                    >
                      <div 
                        className="jurisdiction-header"
                        onClick={() => toggleJurisdiction(jurisdiction)}
                      >
                        <div className="jurisdiction-title-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <h3 className="jurisdiction-title" style={{ margin: 0 }}>
                            {jurisdiction.replace(/_/g, ' ')}
                          </h3>
                          <span className="jurisdiction-count">
                            {totalDocs}
                          </span>
                          <button 
                            className="expand-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleJurisdiction(jurisdiction);
                            }}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                          >
                            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                          </button>
                        </div>
                      </div>

                      {!isExpanded && (
                        <>
                          <div className="jurisdiction-preview">
                            {getJurisdictionDocs(jurisdiction, true).map((result, index) => 
                              renderResultCard(result, index)
                            )}
                          </div>
                          {totalDocs > PREVIEW_COUNT && (
                            <button 
                              className="show-all-button"
                              onClick={() => toggleJurisdiction(jurisdiction)}
                            >
                              Show all {totalDocs} <FaChevronDown />
                            </button>
                          )}
                        </>
                      )}

                      {isExpanded && (
                        <>
                          <div className="jurisdiction-content">
                            {getJurisdictionDocs(jurisdiction).map((result, index) => 
                              renderResultCard(result, index)
                            )}
                          </div>
                          <div className="jurisdiction-navigation">
                            <button
                              className="jurisdiction-nav-button"
                              onClick={() => handleJurisdictionPage(jurisdiction, 'prev')}
                              disabled={currentPage === 1}
                            >
                              <FaChevronLeft /> Previous
                            </button>
                            <span className="jurisdiction-nav-info">
                              {start + 1}-{end} of {totalDocs}
                            </span>
                            <button
                              className="jurisdiction-nav-button"
                              onClick={() => handleJurisdictionPage(jurisdiction, 'next')}
                              disabled={currentPage === totalPages}
                            >
                              Next <FaChevronRight />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                currentResults.map((result, index) => renderResultCard(result, index))
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination-controls">
                <button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {searchInitiated && !loading && results.length === 0 && (
          <p className="no-results">No results found. Try a different search query.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicSearch;