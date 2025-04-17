import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { searchKendra, transformKendraResults } from '../utils/kendraAPI';

// Import mock data as fallback
import mockDataCO2 from '../mockDataCO2.js';
import mockDataNM from '../mockDataNM';
import mockDataSCAQMD from '../mockDataSCAQMD.js';
import mockDataBAAD from '../mockDataBAAD';
import mockDataTX from '../mockDataTX';
import mockDataWA from '../mockDataWA';
import mockDataUT from '../mockDataUT';

// Define the context
const FolderPageContext = createContext();

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

// List of jurisdictions
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

export const FolderPageProvider = ({ children }) => {
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState(''); // Changed from 'air' to empty string
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
  const [activeDocType, setActiveDocType] = useState(null);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [documentCounts, setDocumentCounts] = useState({
    documentTypes: {},
    jurisdictions: {}
  });

  // Initialize the ref for tracking seen documents to avoid duplicates
  const seenDocuments = useRef({});
  
  // Add a search ID to track different search runs
  const searchRunId = useRef(0);

  // Function to query Kendra with retry logic
  const queryWithRetry = async (query, jurisdiction = null, documentType = null, runId) => {
    // Check if this is still the current search run
    if (runId !== searchRunId.current) {
      console.log(`Search for "${query}" (ID: ${runId}) is stale, current run is ${searchRunId.current}`);
      return null;
    }
    
    // Convert jurisdiction to Kendra format for the API call only
    const kendraJurisdiction = jurisdiction ? 
      reverseJurisdictionMapping[jurisdiction] || jurisdiction.replace(/_/g, ' ') : null;
    
    // Log the actual parameters being sent to the API
    console.log(`Sending search request with:
      - Query: ${query}
      - Jurisdiction: ${kendraJurisdiction || 'all'}
      - Document Type: ${documentType || 'all'}
      - Search ID: ${runId}`);
    
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
      // Check if this search has been superseded before making the API call
      if (runId !== searchRunId.current) {
        console.log(`Aborting search for "${query}" (ID: ${runId}), new search in progress (ID: ${searchRunId.current})`);
        
        // Reset loading state before returning
        setLoading(prev => ({ 
          ...prev, 
          [jurisdiction || 'all']: false 
        }));
        
        return null;
      }
      
      try {
        console.log(`Attempt ${retries + 1} for search: ${query}, jurisdiction: ${kendraJurisdiction || 'all'}, docType: ${documentType || 'all'}`);
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
        if (!seenDocuments.current[jurisdiction || 'all']) {
          seenDocuments.current[jurisdiction || 'all'] = new Set();
        }
        
        // Check if we've seen this document before in this jurisdiction
        if (seenDocuments.current[jurisdiction || 'all'].has(docIdentifier)) {
          console.log(`Skipping duplicate document in ${jurisdiction || 'all'}: ${doc.title}`);
          return false;
        }
        
        // Mark this document as seen
        seenDocuments.current[jurisdiction || 'all'].add(docIdentifier);
        
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
      jurisdiction: jurisdiction || 'all'
    };
  };

  // Function to handle search queries
  const handleSearch = (query) => {
    console.log(`Search requested: "${query}" (replacing "${searchQuery}")`);
    
    if (query === searchQuery) {
      console.log('Same search query, skipping duplicate search');
      return;
    }
    
    // Update the query first
    setSearchQuery(query);
    
    // Create a new search run ID and store it
    const newSearchId = Date.now();
    console.log(`Creating new search run ID: ${newSearchId}`);
    searchRunId.current = newSearchId;
    
    // Execute the search with the new query
    fetchAllJurisdictionResultsWithQuery(query);
  };
  
  // Modified function that accepts a query parameter and optional jurisdictions
  const fetchAllJurisdictionResultsWithQuery = async (queryToUse, explicitJurisdictions = null) => {
    console.log(`Starting search with query: "${queryToUse}" and jurisdictions: ${explicitJurisdictions}`);
    // Create a new search run ID
    const currentRunId = Date.now();
    console.log(`Starting new search run ID: ${currentRunId} for query: "${queryToUse}"`);
    searchRunId.current = currentRunId;
    
    // Reset seen documents for a new search
    seenDocuments.current = {};
    
    // Determine which jurisdictions to query
    const jurisdictionsToQuery = explicitJurisdictions === null ? 
      [...jurisdictions] : // If null, use all jurisdictions
      explicitJurisdictions.length > 0 ? 
        [...explicitJurisdictions] : // If non-empty array, use those jurisdictions
        selectedJurisdictions.length > 0 ? 
          [...selectedJurisdictions] : // If selected jurisdictions exist, use those
          [...jurisdictions]; // Otherwise, use all jurisdictions
    
    console.log(`Using jurisdictions for search: ${jurisdictionsToQuery.join(', ')}`);
    
    // Set all jurisdictions to loading
    const initialLoadingState = { all: true };
    jurisdictionsToQuery.forEach(j => {
      initialLoadingState[j] = true;
    });
    setLoading(initialLoadingState);
    
    setError(null);
    
    try {
      console.log(`Search run ${currentRunId} parameters:
      - Query: "${queryToUse}"
      - Document type: "${activeDocType || 'all'}"
      - Jurisdictions: ${jurisdictionsToQuery.join(', ')}`);
      
      // Array to collect jurisdictions with data
      const jurisdictionsWithData = [];
      const resultCounts = {};
      
      // Track if we have any actual results
      let totalDocuments = 0;
      
      // Initialize counts
      const jurisdictionCounts = {};
      const documentTypeCounts = {};
      
      // Keep track of results as they come in
      const searchResults = {};

      // Run queries in series to avoid race conditions
      for (const jurisdiction of jurisdictionsToQuery) {
        if (currentRunId !== searchRunId.current) {
          console.log(`Search run ${currentRunId} cancelled - newer search ${searchRunId.current} in progress`);
          break;
        }
        
        const result = await queryWithRetry(queryToUse, jurisdiction, activeDocType, currentRunId);
        
        if (result && result.success) {
          const documentsCount = result.documents.length;
          resultCounts[jurisdiction] = documentsCount;
          totalDocuments += documentsCount;
          
          // Store results for this jurisdiction
          searchResults[jurisdiction] = {
            name: jurisdiction,
            documents: result.documents
          };
          
          // Update jurisdiction counts
          jurisdictionCounts[jurisdiction] = documentsCount;
          
          // Update document type counts
          result.documents.forEach(doc => {
            if (doc.type) {
              documentTypeCounts[doc.type] = (documentTypeCounts[doc.type] || 0) + 1;
            }
          });
          
          if (documentsCount > 0) {
            jurisdictionsWithData.push(jurisdiction);
          }
        }
      }

      // Update document counts in state
      setDocumentCounts({
        documentTypes: documentTypeCounts,
        jurisdictions: jurisdictionCounts
      });

      console.log('All Kendra searches completed:', {
        jurisdictionsWithData, 
        resultCounts,
        totalDocuments,
        documentTypeCounts,
        jurisdictionCounts
      });

      if (currentRunId !== searchRunId.current) {
        return;
      }

      // Only fall back to mock data if we have no results AND we're not explicitly clearing filters
      if (totalDocuments === 0 && explicitJurisdictions !== null) {
        console.warn('No results found in any jurisdiction. Falling back to mock data.');
        setUsingMockData(true);
        setJurisdictionResults(mockJurisdictionData);
      } else {
        setUsingMockData(false);
        // Update with the collected results
        setJurisdictionResults(searchResults);
      }

      const finalLoadingState = { all: false };
      jurisdictionsToQuery.forEach(j => {
        finalLoadingState[j] = false;
      });
      setLoading(finalLoadingState);
    } catch (error) {
      console.error('Error fetching Kendra search results:', error);
      setUsingMockData(true);
      setError(`Error fetching results: ${error.message}`);
      const finalLoadingState = { all: false };
      jurisdictionsToQuery.forEach(j => {
        finalLoadingState[j] = false;
      });
      setLoading(finalLoadingState);
    }
  };
  
  // Original function now just calls the parameterized version with the current state
  const fetchAllJurisdictionResults = () => {
    fetchAllJurisdictionResultsWithQuery(searchQuery);
  };

  // Function to update filters from SidebarFilters component
  const handleFilterChange = useCallback((newFilters) => {
    console.log('Applying filters with search query:', searchQuery);
    console.log('Current jurisdiction results:', jurisdictionResults);
    console.log('Filter settings being applied:', newFilters);
    
    // Extract jurisdictions and document types from the filters
    const selectedJurisdictionsList = Object.entries(newFilters)
      .filter(([key, value]) => value && jurisdictions.includes(key))
      .map(([key]) => key);
    
    const selectedDocType = Object.entries(newFilters)
      .filter(([key, value]) => value && ['regulation', 'report', 'compliance', 'guidance', 'policy', 'form', 'template', 'implementation', 'protocol', 'general', 'legislation'].includes(key))
      .map(([key]) => key)[0] || null;

    console.log('Selected jurisdictions:', selectedJurisdictionsList);
    console.log('Selected document type:', selectedDocType);
    
    // Update selected jurisdictions
    setSelectedJurisdictions(selectedJurisdictionsList);

    // Update active document type
    setActiveDocType(selectedDocType);

    // Apply filters
    setFilters(newFilters);

    // Clear existing results and execute search
    setJurisdictionResults({});
    fetchAllJurisdictionResultsWithQuery(searchQuery, selectedJurisdictionsList);
  }, [searchQuery]);

  // Function to toggle folder expansion
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

  // Initialize search on first load if needed
  const initializeSearch = () => {
    if (Object.keys(jurisdictionResults).length === 0 && !loading.all) {
      // Only initialize if we have a search query
      if (searchQuery) {
        console.log('Initializing search with query:', searchQuery);
        
        // Set a unique search ID for this initialization
        const initialSearchId = Date.now();
        searchRunId.current = initialSearchId;
        
        // Set a slight delay to allow for any pending searches to be processed
        setTimeout(() => {
          // Only proceed if no other search has started
          if (searchRunId.current === initialSearchId) {
            fetchAllJurisdictionResultsWithQuery(searchQuery);
          } else {
            console.log('Skipping initial search as another search is already in progress');
          }
        }, 50);
      } else {
        console.log('No initial search query, skipping initialization');
      }
    }
  };

  // Normalize document type for filtering
  const normalizeDocumentType = (type) => {
    if (!type) return 'Unknown';
    const trimmedType = type.trim();
    
    // Handle variations in document types
    const lowercaseType = trimmedType.toLowerCase();
    if (lowercaseType.includes('regulation')) return 'Regulation';
    if (lowercaseType.includes('report')) return ' Source Report';
    if (lowercaseType.includes('compliance')) return 'Compliance Document';
    if (lowercaseType.includes('guidance') || lowercaseType.includes('policy')) return 'Guidance-Policy';
    if (lowercaseType.includes('form') || lowercaseType.includes('template')) return 'Form-Template';
    if (lowercaseType.includes('implementation')) return 'State Implementation Plan';
    if (lowercaseType.includes('protocol')) return 'Protocol';
    if (lowercaseType.includes('general')) return 'General Info Item';
    if (lowercaseType.includes('legislation') || lowercaseType.includes('law')) return 'Legislation';
    
    return trimmedType;
  };

  // Filter documents based on current filters
  const applyFilters = (documents = [], activeFilters = {}, jurisdiction = null) => {
    if (!Array.isArray(documents)) {
      console.warn('Expected documents to be an array but got:', typeof documents);
      return [];
    }

    // If no filters are active, return all documents without reverting to demo data
    if (!activeDocType && selectedJurisdictions.length === 0) {
      setUsingMockData(false);
      return documents;
    }

    return documents.filter(doc => {
      // Check jurisdiction filter
      if (selectedJurisdictions.length > 0) {
        if (!jurisdiction || !selectedJurisdictions.includes(jurisdiction)) {
          return false;
        }
      }

      // Check document type filter
      if (activeDocType) {
        const normalizedDocType = normalizeDocumentType(doc?.type);
        if (normalizedDocType !== activeDocType) {
          return false;
        }
      }

      // Check search query
      if (searchQuery && usingMockData) {
        const searchLower = searchQuery.toLowerCase();
        return (
          doc?.title?.toLowerCase().includes(searchLower) || 
          doc?.description?.toLowerCase().includes(searchLower) ||
          doc?.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  };

  // Get filtered documents for a jurisdiction
  const getFilteredDocuments = (documents, jurisdiction) => {
    return applyFilters(documents, filters, jurisdiction);
  };

  const removeFilters = useCallback(() => {
    // Reset both current and pending filters
    setFilters({});
    setSelectedJurisdictions([]);
    setActiveDocType(null);
    setUsingMockData(false);
    
    // Clear existing results
    setJurisdictionResults({});
    
    // Execute search with null jurisdiction to search all
    console.log('Removing filters and searching all jurisdictions');
    fetchAllJurisdictionResultsWithQuery(searchQuery, null);
  }, [searchQuery]);

  const value = {
    filters,
    searchQuery,
    loading,
    error,
    jurisdictionResults,
    usingMockData,
    activeDocType,
    selectedJurisdictions,
    expandedFolders,
    documentCounts,
    handleFilterChange,
    handleSearch,
    toggleFolderExpand,
    initializeSearch,
    getFilteredDocuments,
    removeFilters
  };

  return (
    <FolderPageContext.Provider value={value}>
      {children}
    </FolderPageContext.Provider>
  );
};

// Custom hook to use the folder page context
export const useFolderPage = () => {
  const context = useContext(FolderPageContext);
  if (context === undefined) {
    throw new Error('useFolderPage must be used within a FolderPageProvider');
  }
  return context;
}; 