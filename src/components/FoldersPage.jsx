import React, { useState, useEffect, useRef } from 'react';
import './FoldersPage.css';
import SidebarFilters from './SidebarFilters';
import SearchBar from './SearchBar';
import { searchKendra, transformKendraResults, normalizeDocumentType } from '../utils/kendraAPI';

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
  'New_Mexico',
  'South_Coast_AQMD',
  'Bay_Area_AQMD',
  'Texas',
  'Washington'
];

// Mapping between Kendra format (with spaces) and code format (with underscores)
const jurisdictionMapping = {
  'New Mexico': 'New_Mexico',
  'South Coast AQMD': 'South_Coast_AQMD',
  'Bay Area AQMD': 'Bay_Area_AQMD',
  // Add direct mappings for non-spaced jurisdictions
  'Colorado': 'Colorado',
  'Texas': 'Texas',
  'Washington': 'Washington'
};

// Reverse mapping for display and Kendra searches
const reverseJurisdictionMapping = Object.fromEntries(
  Object.entries(jurisdictionMapping).map(([key, value]) => [value, key])
);

// Helper function to convert Kendra format to code format
const getCodeJurisdiction = (kendraJurisdiction) => {
  return jurisdictionMapping[kendraJurisdiction] || kendraJurisdiction;
};

// Helper function to convert code format to Kendra format
const getKendraJurisdiction = (codeJurisdiction) => {
  return reverseJurisdictionMapping[codeJurisdiction] || codeJurisdiction;
};

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
  'New_Mexico': {
    name: 'New_Mexico',
    documents: mockDataNM,
  },
  'South_Coast_AQMD': {
    name: 'South_Coast_AQMD',
    documents: mockDataSCAQMD,
  },
  'Bay_Area_AQMD': {
    name: 'Bay_Area_AQMD',
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

// Helper function to format jurisdiction names for display (replace underscores with spaces)
const formatJurisdictionDisplay = (jurisdiction) => {
  return jurisdiction.replace(/_/g, ' ');
};

const FoldersPage = () => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('air'); // Default to 'air' as Kendra requires a search term
  const [loading, setLoading] = useState({
    all: false,
    Colorado: false,
    'New_Mexico': false,
    'South_Coast_AQMD': false,
    'Bay_Area_AQMD': false,
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
  
  // Function to query Kendra with retry logic
  const queryWithRetry = async (query, jurisdiction = null, documentType = null, runId) => {
    // Convert jurisdiction to Kendra format for the API call only
    const kendraJurisdiction = jurisdiction ? formatJurisdictionDisplay(jurisdiction) : null;
    
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
        console.log(`Attempting search for query: ${query}, jurisdiction: ${kendraJurisdiction || 'all'}, docType: ${documentType || 'all'}`);
        searchResponse = await searchKendra(query, kendraJurisdiction, documentType);
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
      setError(`Failed to search after ${MAX_RETRIES} attempts`);
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
    console.log(`Processed ${transformedResults.length} documents for ${kendraJurisdiction || 'all'}`);
    
    // Add jurisdiction property to each document and deduplicate
    const processedDocuments = transformedResults
      .map(doc => ({
        ...doc,
        jurisdiction: jurisdiction || 'All'  // Use code format for internal storage
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
      
      // Determine which jurisdictions to query
      // If specific jurisdictions are selected, use those
      // Otherwise, query all available jurisdictions
      const jurisdictionsToQuery = selectedJurisdictions.length > 0 
        ? selectedJurisdictions 
        : jurisdictions;
      
      // Set all jurisdictions to loading
      const initialLoadingState = { all: true };
      jurisdictionsToQuery.forEach(j => {
        initialLoadingState[j] = true;
      });
      setLoading(initialLoadingState);
      
      setError(null);
      
      try {
        console.log(`Attempting Kendra searches for ${jurisdictionsToQuery.length} jurisdictions with query: "${searchQuery}" and document type: "${activeDocType || 'all'}"`);
        
        // Array to collect jurisdictions with data
        const jurisdictionsWithData = [];
        const resultCounts = {};
        
        // Track if we have any actual results
        let totalDocuments = 0;

        // Run queries in series to avoid race conditions
        for (const jurisdiction of jurisdictionsToQuery) {
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
          setError("No documents found in the search index. Using demo data instead.");
          // Format mock data to match our expected structure
          const formattedMockData = {};
          Object.keys(mockJurisdictionData).forEach(key => {
            // Only include mock data for selected jurisdictions if any are selected
            if (selectedJurisdictions.length === 0 || selectedJurisdictions.includes(key)) {
              formattedMockData[key] = {
                name: mockJurisdictionData[key].name,
                documents: mockJurisdictionData[key].documents.map(doc => ({
                  ...doc,
                  jurisdiction: key
                }))
              };
            }
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
        }

        // Clear loading states
        const finalLoadingState = { all: false };
        jurisdictionsToQuery.forEach(j => {
          finalLoadingState[j] = false;
        });
        setLoading(finalLoadingState);
      } catch (error) {
        console.error('Error fetching Kendra search results:', error);
        
        // Fall back to mock data with proper structure
        const formattedMockData = {};
        Object.keys(mockJurisdictionData).forEach(key => {
          // Only include mock data for selected jurisdictions if any are selected
          if (selectedJurisdictions.length === 0 || selectedJurisdictions.includes(key)) {
            formattedMockData[key] = {
              name: mockJurisdictionData[key].name,
              documents: mockJurisdictionData[key].documents.map(doc => ({
                ...doc,
                jurisdiction: key
              }))
            };
          }
        });
        setJurisdictionResults(formattedMockData);
        setUsingMockData(true);
        setError(`Error fetching results: ${error.message}`);
        
        // Clear loading states
        const finalLoadingState = { all: false };
        jurisdictionsToQuery.forEach(j => {
          finalLoadingState[j] = false;
        });
        setLoading(finalLoadingState);
      }
    };

    if (searchQuery) {
      fetchAllJurisdictionResults();
    }
  }, [searchQuery, activeDocType, selectedJurisdictions]); // Run when search query, document type, or selected jurisdictions change

  const handleFilterChange = (newFilters) => {
    // Check if any document type filters are active
    const selectedDocTypes = documentTypes.filter(type => newFilters[type]);
    
    // Only use the first selected document type (if any)
    const docType = selectedDocTypes.length > 0 ? selectedDocTypes[0] : null;
    
    console.log('Document type filter applied:', docType);
    if (docType) {
      logDocTypeDetails(docType);
    }
    
    // Extract selected jurisdictions from all filter keys (not just predefined ones)
    const jurisdictionFilters = Object.entries(newFilters)
      .filter(([key, value]) => 
        value && // Filter is active
        !documentTypes.includes(key) && // Not a document type
        (key.includes('AQMD') || key.includes('APCD') || // California district
         ['Colorado', 'New_Mexico', 'Texas', 'Washington', // Predefined jurisdictions
          'Alaska', 'Arkansas', 'Connecticut', 'Delaware', 'Florida', 
          'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Kansas', 'Kentuvky', 
          'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'Nevada',
          'North_Carolina', 'North_Dakota', 'Oklahoma', 'Oregon', 'Pennsylvania',
          'South_Carolina', 'South_Dakota', 'Tennessee', 'Vermont', 'Virginia',
          'Wisconsin', 'Wyoming'].includes(key))
      )
      .map(([key]) => key);
    
    console.log('Jurisdiction filters applied:', jurisdictionFilters);
    
    // Update state with filter changes, which will trigger a new search
    setActiveDocType(docType);
    setSelectedJurisdictions(jurisdictionFilters);
    setFilters(newFilters);
    
    // Reset search run ID to force a new search
    searchRunId.current = Date.now();
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
            <h1 className="page-title">Jurisdictions</h1>
            <SearchBar onSearch={handleSearch} showHeader={false} initialValue={searchQuery} />
          </div>

          {Object.values(loading).some(Boolean) && (
            <div className="loading-container">
              <p className="loading-message">Loading search results...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-message">{error}</p>
            </div>
          )}

          {usingMockData && !loading.all && (
            <div className="mock-data-notice">
              <p>Using demo data - API connection not available</p>
            </div>
          )}

          {selectedJurisdictions.length > 0 && (
            <div className="filter-info">
              <p>
                Filtering jurisdictions: <strong>{selectedJurisdictions.map(formatJurisdictionDisplay).join(', ')}</strong>
              </p>
            </div>
          )}

          {activeDocType && (
            <div className="filter-info">
              <p>Filtering by document type: <strong>{activeDocType}</strong></p>
            </div>
          )}

          <div className="folders-scroll-container">
            <div className="folders-grid">
              {Object.values(jurisdictionResults).map((jurisdiction) => {
                if (!jurisdiction) return null; // Skip if jurisdiction data isn't loaded yet
                
                const filteredDocs = getFilteredDocuments(jurisdiction.documents, jurisdiction.name);
                if (filteredDocs.length === 0) return null; // Don't show empty folders
                
                // Format jurisdiction name for display
                const displayName = formatJurisdictionDisplay(jurisdiction.name);
                
                return (
                  <div key={jurisdiction.name} className="folder-card">
                    <div className="folder-header">
                      <h2 className="folder-title">{displayName}</h2>
                      <div className="folder-meta">
                        <span className="folder-type">Folder</span>
                        <span className="document-count">{filteredDocs.length} documents</span>
                      </div>
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
      </div>
    </div>
  );
};

export default FoldersPage; 