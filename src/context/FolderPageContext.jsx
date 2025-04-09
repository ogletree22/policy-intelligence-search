import React, { createContext, useContext, useState, useRef } from 'react';
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

  // Function to handle search queries
  const handleSearch = (query) => {
    const sanitizedQuery = query || 'air'; // Ensure we always have at least 'air' as a fallback
    console.log(`Search requested: "${sanitizedQuery}" (replacing "${searchQuery}")`);
    
    if (sanitizedQuery === searchQuery) {
      console.log('Same search query, skipping duplicate search');
      return;
    }
    
    // Update the query first
    setSearchQuery(sanitizedQuery);
    
    // Create a new search run ID and store it
    const newSearchId = Date.now();
    console.log(`Creating new search run ID: ${newSearchId}`);
    searchRunId.current = newSearchId;
    
    // Clear any existing results to avoid showing stale data
    setJurisdictionResults({});
    
    // Execute the search with the new query - pass the sanitizedQuery directly
    // instead of relying on the state update to be immediate
    fetchAllJurisdictionResultsWithQuery(sanitizedQuery);
  };
  
  // Modified function that accepts a query parameter and optional jurisdictions
  const fetchAllJurisdictionResultsWithQuery = async (queryToUse, explicitJurisdictions = null) => {
    // Create a new search run ID
    const currentRunId = Date.now();
    console.log(`Starting new search run ID: ${currentRunId} for query: "${queryToUse}"`);
    searchRunId.current = currentRunId;
    
    // Reset seen documents for a new search
    seenDocuments.current = {};
    
    // Clear previous results when starting a new search
    setJurisdictionResults({});
    
    // Determine which jurisdictions to query - use explicitly passed ones if available
    const jurisdictionsToQuery = explicitJurisdictions 
      ? [...explicitJurisdictions] 
      : selectedJurisdictions.length > 0 ? [...selectedJurisdictions] : [...jurisdictions];
    
    // Debug log to verify exactly which jurisdictions we're querying
    console.log(`Using jurisdictions for search: ${jurisdictionsToQuery.join(', ')}`);
    
    // Set all jurisdictions to loading
    const initialLoadingState = { all: true };
    jurisdictionsToQuery.forEach(j => {
      initialLoadingState[j] = true;
    });
    setLoading(initialLoadingState);
    
    setError(null);
    
    try {
      // Make sure we log the exact document type being sent to Kendra
      console.log(`Search run ${currentRunId} parameters:
      - Query: "${queryToUse}"
      - Document type: "${activeDocType || 'all'}"
      - Jurisdictions: ${jurisdictionsToQuery.join(', ')}`);
      
      // Array to collect jurisdictions with data
      const jurisdictionsWithData = [];
      const resultCounts = {};
      
      // Track if we have any actual results
      let totalDocuments = 0;

      // Run queries in series to avoid race conditions
      for (const jurisdiction of jurisdictionsToQuery) {
        // If the search run ID has changed, stop processing
        if (currentRunId !== searchRunId.current) {
          console.log(`Search run ${currentRunId} cancelled - newer search ${searchRunId.current} in progress`);
          break;
        }
        
        const result = await queryWithRetry(queryToUse, jurisdiction, activeDocType, currentRunId);
        
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
          console.log(`Requesting facets with document type filter: ${activeDocType || 'none'}`);
          // Include the document type parameter in the facet request
          const facetResponse = await searchKendra(queryToUse, null, activeDocType, true);
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
  
  // Original function now just calls the parameterized version with the current state
  const fetchAllJurisdictionResults = () => {
    fetchAllJurisdictionResultsWithQuery(searchQuery);
  };

  // Function to update filters from SidebarFilters component
  const handleFilterChange = (newFilters) => {
    // Check if any document type filters are active
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
    
    const selectedDocTypes = documentTypes.filter(type => newFilters[type]);
    
    // Only use the first selected document type (if any)
    const docType = selectedDocTypes.length > 0 ? selectedDocTypes[0] : null;
    
    // Extract selected jurisdictions - FIX: Make more robust to ensure all jurisdictions are captured
    const jurisdictionFilters = Object.entries(newFilters)
      .filter(([key, value]) => 
        value && // Filter is active
        !documentTypes.includes(key) && // Not a document type
        key !== 'all' && // Not the 'all' pseudo-jurisdiction
        (
          // Include all our standard jurisdictions
          jurisdictions.includes(key) ||
          // Plus any California districts
          key.includes('AQMD') || 
          key.includes('APCD') || 
          // Plus any other state
          ['Alaska', 'Arkansas', 'Connecticut', 'Delaware', 'Florida', 
           'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Kansas', 'Kentucky', 
           'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'Nevada',
           'North_Carolina', 'North_Dakota', 'Oklahoma', 'Oregon', 'Pennsylvania',
           'South_Carolina', 'South_Dakota', 'Tennessee', 'Vermont', 'Virginia',
           'Wisconsin', 'Wyoming'].includes(key)
        )
      )
      .map(([key]) => key);
    
    console.log('Document type filter applied:', docType);
    console.log('Filter settings being applied:', {
      docType,
      jurisdictions: jurisdictionFilters
    });
    
    // Debug to verify all selected jurisdictions are captured
    console.log('All selected jurisdictions:', jurisdictionFilters);
    
    // Log the raw filter object for debugging
    console.log('Raw filter object:', newFilters);
    
    // Store the current search query for use later
    const currentQuery = searchQuery;
    
    // Update state with filter changes - IMPORTANT: Set this BEFORE running the search
    setActiveDocType(docType);
    setSelectedJurisdictions(jurisdictionFilters);
    console.log('Updated selectedJurisdictions state to:', jurisdictionFilters);
    setFilters(newFilters);
    
    // Clear any existing results to avoid showing stale data
    setJurisdictionResults({});
    
    // Reset search run ID to force a new search
    const newSearchId = Date.now();
    console.log(`Creating new filter search ID: ${newSearchId}`);
    searchRunId.current = newSearchId;
    
    // Execute the search using the current query but with new filters
    // Pass the current query and explicitly pass the jurisdictionFilters to avoid state update timing issues
    fetchAllJurisdictionResultsWithQuery(currentQuery, jurisdictionFilters);
  };

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
      // Capture the current query
      const initialQuery = searchQuery || 'air';
      console.log('Initializing search with query:', initialQuery);
      
      // Set a unique search ID for this initialization
      const initialSearchId = Date.now();
      searchRunId.current = initialSearchId;
      
      // Set a slight delay to allow for any pending searches to be processed
      setTimeout(() => {
        // Only proceed if no other search has started
        if (searchRunId.current === initialSearchId) {
          fetchAllJurisdictionResultsWithQuery(initialQuery);
        } else {
          console.log('Skipping initial search as another search is already in progress');
        }
      }, 50);
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
    // Ensure documents is always an array
    if (!Array.isArray(documents)) {
      console.warn('Expected documents to be an array but got:', typeof documents);
      return [];
    }

    // Debug log to verify which jurisdictions are active when filtering
    console.log('Filtering documents for jurisdiction:', jurisdiction);
    console.log('Selected jurisdictions when filtering:', selectedJurisdictions);

    // If we have selected jurisdictions and this jurisdiction isn't in the list, skip it
    if (selectedJurisdictions.length > 0 && jurisdiction && !selectedJurisdictions.includes(jurisdiction)) {
      console.log(`Jurisdiction ${jurisdiction} is not in selected jurisdictions, returning empty array`);
      return [];
    }

    // If we made it here, jurisdiction check passed, so do normal filtering
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

  // Get filtered documents for a jurisdiction
  const getFilteredDocuments = (documents, jurisdiction) => {
    return applyFilters(documents, filters, jurisdiction);
  };

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
    getFilteredDocuments
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