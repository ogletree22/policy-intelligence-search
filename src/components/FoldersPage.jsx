import React, { useState, useEffect, useRef } from 'react';
import './FoldersPage.css';
import SidebarFilters from './SidebarFilters';
import SearchBar from './SearchBar';
import { searchKendra, transformKendraResults, normalizeDocumentType } from '../utils/kendraAPI';
import { FaUserCircle, FaFolder, FaFolderPlus, FaFolderMinus, FaExpand, FaCompress, FaEye, FaTimes, FaTrash } from 'react-icons/fa';
import { useWorkingFolder } from '../context/WorkingFolderContext';

// Import mock data as fallback
import mockDataCO2 from '../mockDataCO2.js';
import mockDataNM from '../mockDataNM';
import mockDataSCAQMD from '../mockDataSCAQMD.js';
import mockDataBAAD from '../mockDataBAAD';
import mockDataTX from '../mockDataTX';
import mockDataWA from '../mockDataWA';
import mockDataUT from '../mockDataUT';

// Define the jurisdictions we want to display
const jurisdictions = [
  'Colorado',
  'New Mexico',
  'South Coast AQMD',
  'Bay Area AQMD',
  'Texas',
  'Washington'
];

// List of document types for filtering - match exact Kendra values
const documentTypes = [
  'Regulation',
  ' Source Report',
  'Compliance Document',
  'Guidance-Policy',
  'Form-Template',
  'State Implementation Plan',
  'Protocol',
  'General Info Item',
  'Legislation'
];

// Fallback mock data
const mockJurisdictionData = {
  'Colorado': {
    name: 'Colorado',
    documents: mockDataCO2,
  },
  'New Mexico': {
    name: 'New Mexico',
    documents: mockDataNM,
  },
  'South Coast AQMD': {
    name: 'South Coast AQMD',
    documents: mockDataSCAQMD,
  },
  'Bay Area AQMD': {
    name: 'Bay Area AQMD',
    documents: mockDataBAAD,
  },
  'Texas': {
    name: 'Texas',
    documents: mockDataTX,
  },
  'Washington': {
    name: 'Washington',
    documents: mockDataWA,
  },
  'Utah': {
    name: 'Utah',
    documents: mockDataUT,
  }
};

// Debug function to log document type details
function logDocTypeDetails(docType) {
  if (!docType) return;
  console.log('Filter - Document type details:');
  console.log(`- Original: "${docType}"`);
  console.log(`- Trimmed: "${docType.trim()}"`);
  console.log(`- Length: ${docType.length}`);
  console.log(`- Char codes:`, Array.from(docType).map(c => c.charCodeAt(0)));
}

// Function to display document type without leading spaces and handle all possible types
const getDisplayType = (type) => {
  if (!type || type === 'Unknown') return null;
  
  // Remove any leading/trailing spaces for display purposes only
  const trimmedType = type.trim();
  
  // Match our predefined document types
  const typeMap = {
    'regulation': 'Regulation',
    'source report': 'Source Report',
    'compliance document': 'Compliance Document',
    'guidance-policy': 'Guidance-Policy',
    'form-template': 'Form-Template',
    'state implementation plan': 'State Implementation Plan',
    'protocol': 'Protocol',
    'general info item': 'General Info Item',
    'legislation': 'Legislation'
  };
  
  // Check for an exact match (case-insensitive)
  const lowerType = trimmedType.toLowerCase();
  if (typeMap[lowerType]) {
    return typeMap[lowerType];
  }
  
  // If it doesn't match our predefined types, use the original but trim
  return trimmedType;
};

const FoldersPage = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('air'); // Default to 'air' as Kendra requires a search term
  const [loading, setLoading] = useState({
    all: false,
    Colorado: false,
    'New Mexico': false,
    'South Coast AQMD': false,
    'Bay Area AQMD': false,
    Texas: false,
    Washington: false
  });
  const [error, setError] = useState(null);
  const [jurisdictionResults, setJurisdictionResults] = useState({});
  const [usingMockData, setUsingMockData] = useState(false);
  
  // Track active document type filter
  const [activeDocType, setActiveDocType] = useState(null);
  
  // Track selected jurisdictions
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);

  // Initialize the ref for tracking seen documents to avoid duplicates
  const seenDocuments = useRef({});
  
  // Add a search ID to track different search runs
  const searchRunId = useRef(0);
  
  // Add state for document counts by type and jurisdiction
  const [documentCounts, setDocumentCounts] = useState({
    documentTypes: {},
    jurisdictions: {}
  });

  // Get working folder functionality from context
  const { workingFolderDocs, addToWorkingFolder, removeFromWorkingFolder } = useWorkingFolder();

  // Track expanded folders
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  // Function to query Kendra with retry logic
  const queryWithRetry = async (query, jurisdiction = null, documentType = null, runId) => {
    // Set the specified jurisdiction to loading
    setLoading(prev => ({ 
      ...prev, 
      [jurisdiction || 'all']: true 
    }));
    
    let retries = 0;
    const MAX_RETRIES = 3;
    let success = false;
    let searchResponse;

    while (retries < MAX_RETRIES && !success) {
      try {
        console.log(`Attempting search for query: ${query}, jurisdiction: ${jurisdiction || 'all'}, docType: ${documentType || 'all'}`);
        searchResponse = await searchKendra(query, jurisdiction, documentType);
        success = true;
      } catch (error) {
        console.error(`Search attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    if (!success) {
      console.error(`Failed to search after ${MAX_RETRIES} attempts`);
      // Instead of setting error, just fall back to mock data silently
      setUsingMockData(true);
      // Reset the loading state for this jurisdiction
      setLoading(prev => ({ 
        ...prev, 
        [jurisdiction || 'all']: false 
      }));
      return null;
    }

    // If the search run ID has changed, this result is stale
    if (runId !== searchRunId.current) {
      console.log(`Search result for run ${runId} is stale, current run is ${searchRunId.current}`);
      return null;
    }

    // Transform and set results
    const transformedResults = transformKendraResults(searchResponse?.results) || [];
    console.log(`Processed ${transformedResults.length} documents for ${jurisdiction || 'all'}`);
    
    // Add jurisdiction property to each document and deduplicate
    const processedDocuments = transformedResults
      .map(doc => ({
        ...doc,
        jurisdiction: jurisdiction || 'All'
      }))
      .filter(doc => {
        // Create a unique identifier - use ID if available, otherwise use title+URL
        const docIdentifier = doc.id || `${doc.title}:${doc.url}`;
        
        // Initialize the jurisdiction object if needed
        if (!seenDocuments.current[jurisdiction]) {
          seenDocuments.current[jurisdiction] = new Set();
        }
        
        // Check if we've seen this document before in this jurisdiction
        if (seenDocuments.current[jurisdiction].has(docIdentifier)) {
          console.log(`Skipping duplicate document in ${jurisdiction}: ${doc.title}`);
          return false;
        }
        
        // Mark this document as seen
        seenDocuments.current[jurisdiction].add(docIdentifier);
        
        return true;
      });
    
    // Update jurisdiction results
    setJurisdictionResults(prev => {
      // If the search run ID has changed, this result is stale
      if (runId !== searchRunId.current) {
        return prev;
      }
      
      const prevResults = {...prev} || {};
      const jurisdictionKey = jurisdiction || 'all';
      
      prevResults[jurisdictionKey] = {
        name: jurisdiction || 'All',
        documents: processedDocuments
      };
      
      return prevResults;
    });

    // At the end, reset the loading state for this jurisdiction
    setLoading(prev => ({ 
      ...prev, 
      [jurisdiction || 'all']: false 
    }));
    
    // Return properly formatted result
    return {
      success: true,
      documents: processedDocuments,
      totalAvailable: searchResponse?.totalAvailable,
      jurisdiction: jurisdiction
    };
  };

  // Effect for fetching results when search query or document type filter changes
  useEffect(() => {
    // Create a new search run ID
    const currentRunId = Date.now();
    searchRunId.current = currentRunId;
    
    // Reset seen documents for a new search
    seenDocuments.current = {};
    
    const fetchAllJurisdictionResults = async () => {
      // Clear previous results when starting a new search
      setJurisdictionResults({});
      
      // Set all jurisdictions to loading
      const initialLoadingState = {};
      jurisdictions.forEach(j => {
        initialLoadingState[j] = true;
      });
      initialLoadingState.all = true;
      setLoading(initialLoadingState);
      
      setError(null);
      
      try {
        console.log(`Attempting Kendra searches for jurisdictions with query: "${searchQuery}" and document type: "${activeDocType || 'all'}"`);
        
        // Array to collect jurisdictions with data
        const jurisdictionsWithData = [];
        const resultCounts = {};
        
        // Track if we have any actual results
        let totalDocuments = 0;

        // Run queries in series to avoid race conditions
        for (const jurisdiction of jurisdictions) {
          // If the search run ID has changed, stop processing
          if (currentRunId !== searchRunId.current) {
            console.log('Search run cancelled - newer search in progress');
            break;
          }
          
          const result = await queryWithRetry(searchQuery, jurisdiction, activeDocType, currentRunId);
          
          if (result && result.success) {
            // Count documents from the result
            const documentsCount = result.documents.length;
            resultCounts[jurisdiction] = documentsCount;
            totalDocuments += documentsCount;
            
            // If we got any results at all for this jurisdiction, track it
            if (documentsCount > 0) {
              jurisdictionsWithData.push(jurisdiction);
            }
          }
        }

        console.log('All Kendra searches completed with jurisdictions that have data:', 
          jurisdictionsWithData, 
          'Result counts:', resultCounts,
          'Total documents:', totalDocuments
        );

        // If the search run ID has changed, this result is stale
        if (currentRunId !== searchRunId.current) {
          return;
        }

        // Check if we got any results at all
        if (totalDocuments === 0) {
          console.warn('No results found in any jurisdiction. Falling back to mock data.');
          // Format mock data to match our expected structure
          const formattedMockData = {};
          Object.keys(mockJurisdictionData).forEach(key => {
            formattedMockData[key] = {
              name: mockJurisdictionData[key].name,
              documents: mockJurisdictionData[key].documents.map(doc => ({
                ...doc,
                jurisdiction: key
              }))
            };
          });
          setJurisdictionResults(formattedMockData);
          setUsingMockData(true);
        } else {
          // We've already set jurisdiction results in queryWithRetry
          setUsingMockData(false);
        }
        
        // After all queries are completed, calculate document counts
        if (currentRunId === searchRunId.current && !usingMockData) {
          // Request facet data to get counts
          try {
            const facetResponse = await searchKendra(searchQuery, null, null, true);
            if (facetResponse && facetResponse.facets) {
              setDocumentCounts(facetResponse.facets);
              console.log("Document counts updated from facets:", facetResponse.facets);
            }
          } catch (error) {
            console.error("Failed to fetch document type counts:", error);
          }
        } else if (usingMockData) {
          // Calculate counts from mock data
          const jurisdictionCounts = {};
          const typeCounts = {};
          
          // Count by jurisdiction
          Object.entries(mockJurisdictionData).forEach(([key, data]) => {
            if (data?.documents && jurisdictions.includes(key)) {
              jurisdictionCounts[key] = data.documents.length;
            }
          });
          
          // Count by document type
          Object.values(mockJurisdictionData).forEach(({ documents }) => {
            if (Array.isArray(documents)) {
              documents.forEach(doc => {
                const type = normalizeDocumentType(doc.type) || 'Unknown';
                typeCounts[type] = (typeCounts[type] || 0) + 1;
              });
            }
          });
          
          setDocumentCounts({
            documentTypes: typeCounts,
            jurisdictions: jurisdictionCounts
          });
        }
        
        // At the end, clear all loading states
        const finalLoadingState = {};
        jurisdictions.forEach(j => {
          finalLoadingState[j] = false;
        });
        finalLoadingState.all = false;
        setLoading(finalLoadingState);
      } catch (error) {
        console.error('Error fetching Kendra search results:', error);
        
        // Fall back to mock data with proper structure
        const formattedMockData = {};
        Object.keys(mockJurisdictionData).forEach(key => {
          formattedMockData[key] = {
            name: mockJurisdictionData[key].name,
            documents: mockJurisdictionData[key].documents.map(doc => ({
              ...doc,
              jurisdiction: key
            }))
          };
        });
        setJurisdictionResults(formattedMockData);
        setUsingMockData(true);
        setError(`Error fetching results: ${error.message}`);
        
        // Clear loading states
        const finalLoadingState = {};
        jurisdictions.forEach(j => {
          finalLoadingState[j] = false;
        });
        finalLoadingState.all = false;
        setLoading(finalLoadingState);
      }
    };

    if (searchQuery) {
      fetchAllJurisdictionResults();
    }
  }, [searchQuery, activeDocType]); // Run when search query or document type filter changes

  const handleFilterChange = (newFilters) => {
    // Check if any document type filters are active
    const selectedDocTypes = documentTypes.filter(type => newFilters[type]);
    
    // Only use the first selected document type (if any)
    const docType = selectedDocTypes.length > 0 ? selectedDocTypes[0] : null;
    
    console.log('Document type filter applied:', docType);
    if (docType) {
      logDocTypeDetails(docType);
    }
    
    // Extract selected jurisdictions
    const jurisdictionFilters = jurisdictions.filter(j => newFilters[j]);
    console.log('Jurisdiction filters applied:', jurisdictionFilters);
    
    setActiveDocType(docType);
    setSelectedJurisdictions(jurisdictionFilters);
    setFilters(newFilters);
  };

  const handleSearch = (query) => {
    setSearchQuery(query || 'air'); // Ensure we always have at least 'air' as a fallback
  };

  // Fix the applyFilters function to handle potentially undefined documents
  const applyFilters = (documents = [], activeFilters = {}, jurisdiction = null) => {
    // Ensure documents is always an array
    if (!Array.isArray(documents)) {
      console.warn('Expected documents to be an array but got:', typeof documents);
      return [];
    }

    // If we have selected jurisdictions and this jurisdiction isn't in the list, skip it
    if (selectedJurisdictions.length > 0 && jurisdiction && !selectedJurisdictions.includes(jurisdiction)) {
      return [];
    }

    return documents.filter(doc => {
      // First apply search query if it exists (for mock data)
      const matchesSearch = !searchQuery || usingMockData ? (
        doc?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc?.keywords?.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      ) : true; // If using API data, search is already applied

      if (!matchesSearch) return false;

      // For API-sourced data, we've already filtered by document type at the API level
      if (!usingMockData && activeDocType) return true;

      // For mock data, apply the document type filter locally
      if (usingMockData && activeDocType) {
        // Normalize the document type for comparison
        const normalizedType = normalizeDocumentType(doc?.type);
        return normalizedType === activeDocType;
      }

      return true;
    });
  };

  // Get filtered documents for each jurisdiction
  const getFilteredDocuments = (documents, jurisdiction) => {
    return applyFilters(documents, filters, jurisdiction);
  };

  const toggleFolderExpand = (folderName) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  return (
    <div className="app-wrapper">
      <div className="main-layout">
        <aside className="sidebar">
          <SidebarFilters 
            onFilterChange={handleFilterChange} 
            instanceId="folders-page" 
            documentCounts={documentCounts}
          />
        </aside>
        
        <div className="folders-container">
          <div className="folders-header">
            <div>
              <h1 className="page-title">Jurisdictions</h1>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SearchBar onSearch={handleSearch} showHeader={false} initialValue={searchQuery} />
                {usingMockData && (
                  <div className="demo-data-indicator">
                    <p>Using demo data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {Object.values(loading).some(Boolean) && (
            <div className="loading-container">
              <p className="loading-message">Loading search results</p>
            </div>
          )}

          {selectedJurisdictions.length > 0 && (
            <div className="filter-info">
              <p>
                Filtering jurisdictions: <strong>{selectedJurisdictions.join(', ')}</strong>
              </p>
            </div>
          )}

          <div className="folders-scroll-container">
            <div className="folders-grid">
              {Object.values(jurisdictionResults).map((jurisdiction) => {
                if (!jurisdiction) return null; // Skip if jurisdiction data isn't loaded yet
                
                const filteredDocs = getFilteredDocuments(jurisdiction.documents, jurisdiction.name);
                if (filteredDocs.length === 0) return null; // Don't show empty folders
                
                return (
                  <div key={jurisdiction.name} className={`folder-card ${expandedFolders.has(jurisdiction.name) ? 'expanded' : ''}`}>
                    <div className="folder-header">
                      <div className="folder-title-container">
                        <h3 className="folder-title">{jurisdiction.name}</h3>
                        <div className="folder-meta">
                          <span className="folder-type">Folder</span>
                          <span className="document-count">{filteredDocs.length} documents</span>
                        </div>
                      </div>
                      <button 
                        className="expand-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolderExpand(jurisdiction.name);
                        }}
                      >
                        {expandedFolders.has(jurisdiction.name) ? <FaCompress /> : <FaExpand />}
                      </button>
                    </div>
                    <div className="folder-content">
                      <div className="folder-files">
                        {filteredDocs.map((doc, index) => {
                          // Generate a truly unique key using jurisdiction, document ID and index
                          const uniqueKey = `${jurisdiction.name}-${doc.id || ''}-${index}`;
                          
                          // Debug URL for first doc in each jurisdiction
                          if (index === 0) {
                            console.log(`URL for first doc in ${jurisdiction.name}:`, doc.url || 'No URL');
                          }
                          
                          return (
                            <div key={uniqueKey} className="file-card">
                              <div className="file-header">
                                {doc.url ? (
                                  <a 
                                    href={doc.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="file-title"
                                  >
                                    {doc.title}
                                  </a>
                                ) : (
                                  <span className="file-title no-link">{doc.title}</span>
                                )}
                                <button
                                  className={`add-to-folder-button ${workingFolderDocs.some(wDoc => wDoc.id === doc.id) ? 'in-folder' : ''}`}
                                  onClick={() => {
                                    const isInFolder = workingFolderDocs.some(wDoc => wDoc.id === doc.id);
                                    if (isInFolder) {
                                      removeFromWorkingFolder(doc.id);
                                    } else {
                                      addToWorkingFolder(doc);
                                    }
                                  }}
                                  title={workingFolderDocs.some(wDoc => wDoc.id === doc.id) ? "Remove from Working Folder" : "Add to Working Folder"}
                                >
                                  {workingFolderDocs.some(wDoc => wDoc.id === doc.id) ? <FaFolderMinus /> : <FaFolderPlus />}
                                </button>
                              </div>
                              <p className="file-description">{doc.description || 'No description available'}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {!loading.all && Object.keys(jurisdictionResults).length === 0 && (
                <div className="no-results">
                  <p>No results found. Try adjusting your search query or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="working-folder-section">
          <div className="working-folder-header">
            <span>Working Folder ({workingFolderDocs.length})</span>
            <div className="working-folder-actions">
              <button 
                className="view-folder-button" 
                onClick={() => setIsWorkingFolderOpen(true)}
                title="View working folder contents"
              >
                <FaEye />
              </button>
              <button 
                className="clear-all-button"
                onClick={() => {
                  workingFolderDocs.forEach(doc => {
                    removeFromWorkingFolder(doc.id);
                  });
                }}
                title="Clear all documents"
                disabled={workingFolderDocs.length === 0}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="working-folder-list">
            {workingFolderDocs.length === 0 ? (
              <div className="empty-folder-message">
                <span className="empty-text">No documents selected</span>
              </div>
            ) : (
              workingFolderDocs.map((doc) => (
                <div key={doc.id} className="working-folder-item">
                  <span className="doc-title">{doc.title}</span>
                  <button
                    className="remove-doc-button"
                    onClick={() => removeFromWorkingFolder(doc.id)}
                    title="Remove from working folder"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        <WorkingFolderView 
          isOpen={isWorkingFolderOpen}
          onClose={() => setIsWorkingFolderOpen(false)}
          documents={workingFolderDocs}
        />
      </div>
    </div>
  );
};

export default FoldersPage; 