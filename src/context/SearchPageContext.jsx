import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { searchKendra, transformKendraResults } from '../utils/kendraAPI';
import { JURISDICTIONS, DOCUMENT_TYPES } from '../utils/constants';

// Import mock data as fallback
import mockDataCO2 from '../mockDataCO2.js';
import mockDataNM from '../mockDataNM';
import mockDataSCAQMD from '../mockDataSCAQMD.js';
import mockDataBAAD from '../mockDataBAAD';
import mockDataTX from '../mockDataTX';
import mockDataWA from '../mockDataWA';
import mockDataUT from '../mockDataUT';

// Define the context
export const SearchPageContext = createContext();

// Combine all mock data
const MOCK_DOCUMENTS = [
  ...mockDataCO2,
  ...mockDataNM,
  ...mockDataSCAQMD,
  ...mockDataBAAD,
  ...mockDataTX,
  ...mockDataWA,
  ...mockDataUT
];

// Mapping between Kendra format (with spaces) and code format (with underscores)
const jurisdictionMapping = {
  'New Mexico': 'New_Mexico',
  'South Coast AQMD': 'South_Coast_AQMD',
  'Bay Area AQMD': 'Bay_Area_AQMD',
  'San Joaquin Valley APCD': 'San_Joaquin_Valley_APCD',
  'Santa Barbara County APCD': 'Santa_Barbara_County_APCD',
  'Colorado': 'Colorado',
  'Texas': 'Texas',
  'Washington': 'Washington',
  'Kentucky': 'Kentucky'
};

// Reverse mapping for display and Kendra searches
const reverseJurisdictionMapping = Object.fromEntries(
  Object.entries(jurisdictionMapping).map(([key, value]) => [value, key])
);

const LOCAL_STORAGE_KEY = 'searchHistory';

export const SearchPageProvider = ({ children }) => {
  // Increase the maximum number of results to retrieve and display
  const MAX_RESULTS = 100; // Set maximum results to 100
  
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({
    documentTypes: {},
    jurisdictions: {}
  });
  
  // Add state for sorted jurisdictions
  const [sortedJurisdictions, setSortedJurisdictions] = useState([]);
  
  // Track if initial search has been performed
  const initialSearchPerformed = useRef(false);
  const searchRunId = useRef(0);
  const seenDocuments = useRef(new Set());

  // Function to sort jurisdictions by count
  const sortJurisdictionsByCount = useCallback((jurisdictionCounts) => {
    console.log('Sorting jurisdictions by count');
    if (!jurisdictionCounts || typeof jurisdictionCounts !== 'object') {
      return [];
    }
    
    // Convert to array of [jurisdiction, count] pairs
    const pairs = Object.entries(jurisdictionCounts);
    
    // Sort by count in descending order
    const sorted = pairs.sort((a, b) => b[1] - a[1]);
    
    // Return just the jurisdiction names
    return sorted.map(([jurisdiction]) => jurisdiction);
  }, []);
  
  // Update sorted jurisdictions whenever document counts change
  useEffect(() => {
    if (documentCounts && documentCounts.jurisdictions) {
      const jurisdictionCounts = documentCounts.jurisdictions;
      console.log('Jurisdiction counts updated, sorting jurisdictions');
      
      // Log the top jurisdictions by count before sorting
      const pairs = Object.entries(jurisdictionCounts);
      if (pairs.length > 0) {
        // Sort by count and get top 5 for logging
        const topJurisdictions = [...pairs]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([jur, count]) => `${jur}: ${count}`);
          
        console.log(`Top jurisdictions by count: ${topJurisdictions.join(', ')}`);
      }
      
      const sorted = sortJurisdictionsByCount(jurisdictionCounts);
      setSortedJurisdictions(sorted);
      
      // Log the number of jurisdictions sorted
      console.log(`Sorted ${sorted.length} jurisdictions by count`);
    }
  }, [documentCounts, sortJurisdictionsByCount]);

  // Function to perform initial setup when component mounts
  useEffect(() => {
    // No initial search or API calls on page load
    console.log('Search page initialized, waiting for user input');
    
    // Set initial empty state
    setResults([]);
    setLoading(false);
    setError(null);
    
    // No API calls happen until user initiates a search
    
    return () => {
      // Cleanup function
      initialSearchPerformed.current = false;
    };
  }, []); // Empty dependency array to run only once on mount

  const clearSearch = () => {
    setResults([]);
    setSearchQuery('');
    setError(null);
    setUsingMockData(false);
    seenDocuments.current.clear();
  };

  const queryWithRetry = async (query, jurisdiction = null, documentType = null, runId) => {
    // Skip if the search ID has changed
    if (runId !== searchRunId.current) {
      console.log('Search run ID changed, skipping stale request');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    let retries = 0;
    const MAX_RETRIES = 3;
    let success = false;
    let searchResponse;

    while (retries < MAX_RETRIES && !success) {
      // Check again if search was replaced
      if (runId !== searchRunId.current) {
        console.log('Search run ID changed during retry, aborting request');
        setLoading(false);
        return null;
      }
      
      try {
        console.log(`Attempting Kendra search: query="${query}", jurisdiction="${jurisdiction || 'all'}", docType="${documentType || 'all'}"`);
        // OPTIMIZED: This is the only actual data fetching call for search results
        searchResponse = await searchKendra(query, jurisdiction, documentType);
        
        // Log the response for debugging
        console.log('Search response received');
        
        // Verify we got a valid response with results
        if (searchResponse && Array.isArray(searchResponse.results)) {
          if (searchResponse.results.length > 0) {
            success = true;
            console.log('Kendra search successful with', searchResponse.results.length, 'results');
          } else {
            console.log('Kendra search returned 0 results');
            success = true; // Still consider it a success, just empty results
          }
        } else {
          console.error('Invalid response format:', searchResponse);
          throw new Error('Invalid response format from Kendra');
        }
      } catch (error) {
        console.error(`Search attempt ${retries + 1} failed:`, error);
        retries++;
        if (retries < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        }
      }
    }

    setLoading(false);

    if (!success) {
      const errorMessage = 'Failed to fetch results from search service';
      console.error(errorMessage);
      setError(new Error(errorMessage));
      return null;
    }

    // Final check if search was replaced
    if (runId !== searchRunId.current) {
      console.log('Search run ID changed after successful search, discarding results');
      return null;
    }

    const transformedResults = transformKendraResults(searchResponse.results);
    console.log(`Processed ${transformedResults.length} documents from Kendra`);
    
    return transformedResults;
  };

  const handleSearch = async (query) => {
    console.log('Handling search for query:', query);
    setSearchQuery(query);
    searchRunId.current++;
    const currentRunId = searchRunId.current;
    
    // Track that a search has been performed
    initialSearchPerformed.current = true;
    
    // Store search query in localStorage history
    if (query && query.trim() !== '') {
      let history = [];
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          history = JSON.parse(stored);
        }
      } catch (e) {
        history = [];
      }
      // Remove duplicates and add new query to the front
      history = [query, ...history.filter(item => item !== query)];
      // Limit to 20 most recent
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
    
    // Clear seen documents for new search
    seenDocuments.current.clear();
    
    if (!query || query.trim() === '') {
      // For empty queries, just clear results without making API calls
      console.log('Empty query, showing empty state');
      setResults([]);
      // Don't update facet counts for empty queries
      return;
    }

    try {
      console.log('Searching with query:', query);
      setLoading(true);
      
      // Always fetch both search results and facet counts on first search
      // Otherwise, be smarter about reusing existing facet data
      let facetPromise;
      const isFirstSearch = Object.keys(documentCounts.jurisdictions).length === 0;
      
      if (isFirstSearch || query !== searchQuery) {
        console.log(`Fetching facet counts for ${isFirstSearch ? 'first' : 'new'} query: "${query}"`);
        facetPromise = searchKendra(query, null, null, true);
      } else {
        console.log('Search query unchanged, reusing existing facet counts');
        facetPromise = Promise.resolve({ facets: documentCounts });
      }
      
      // Always fetch search results
      const resultsPromise = queryWithRetry(query, null, null, currentRunId);
      
      // Run these promises in parallel
      const [apiResults, facetResponse] = await Promise.all([
        resultsPromise,
        facetPromise
      ]);
      
      // Update facet counts if we got new ones
      if (facetResponse && facetResponse.facets) {
        console.log(`Received facet counts for query "${query}":`, {
          documentTypes: Object.keys(facetResponse.facets.documentTypes || {}).length,
          jurisdictions: Object.keys(facetResponse.facets.jurisdictions || {}).length
        });
        setDocumentCounts(facetResponse.facets);
      }
      
      if (currentRunId === searchRunId.current) {
        if (apiResults && apiResults.length > 0) {
          const uniqueResults = apiResults.filter(doc => {
            const docIdentifier = doc.id || `${doc.title}:${doc.url}`;
            if (seenDocuments.current.has(docIdentifier)) {
              return false;
            }
            seenDocuments.current.add(docIdentifier);
            return true;
          });
          
          console.log(`Setting ${uniqueResults.length} unique results from API`);
          // Don't limit results here
          setResults(uniqueResults);
          setUsingMockData(false);
        } else {
          console.log('No results found for query');
          setResults([]);
        }
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error);
      setResults([]);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    
    // Get active filters
    const activeFilterKeys = Object.entries(newFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Get all active jurisdiction and document type filters
    const jurisdictionFilters = activeFilterKeys.filter(key => JURISDICTIONS.includes(key));
    const documentTypeFilters = activeFilterKeys.filter(key => DOCUMENT_TYPES.includes(key));

    console.log('Active jurisdiction filters:', jurisdictionFilters);
    console.log('Active document type filters:', documentTypeFilters);

    // Convert jurisdiction names to Kendra format using the mapping
    const kendraJurisdictionFilters = jurisdictionFilters.map(jurisdiction => {
      // For jurisdictions that don't need underscore conversion (like 'Colorado')
      if (!jurisdiction.includes('_')) {
        return jurisdiction;
      }
      // Use the reverse mapping or convert underscores to spaces
      return reverseJurisdictionMapping[jurisdiction] || jurisdiction.replace(/_/g, ' ');
    });

    console.log('Converted jurisdiction filters:', kendraJurisdictionFilters);

    // If we have filters, perform a new search with them
    if (jurisdictionFilters.length > 0 || documentTypeFilters.length > 0) {
      // Get the first jurisdiction and document type filter (Kendra only supports one of each)
      const jurisdiction = kendraJurisdictionFilters.length > 0 ? kendraJurisdictionFilters[0] : null;
      const documentType = documentTypeFilters.length > 0 ? documentTypeFilters[0] : null;

      // Perform a new search with the current query and filters
      searchRunId.current++;
      const currentRunId = searchRunId.current;

      // Use the current search query when applying filters
      const currentQuery = searchQuery || '';
      console.log(`Searching with query "${currentQuery}" and filters:`, { jurisdiction, documentType });

      // CONSOLIDATED: Get the filtered results first
      queryWithRetry(currentQuery, jurisdiction, documentType, currentRunId)
        .then(filteredResults => {
          if (!filteredResults || currentRunId !== searchRunId.current) {
            // Don't proceed if the search was canceled or no results
            return;
          }
          
          console.log('Received filtered results:', filteredResults.length);
            
          // Apply additional filtering for multiple filters
          const finalResults = filteredResults.filter(doc => {
            // Check jurisdiction filter - safely handle undefined jurisdictions
            const docJurisdiction = doc.jurisdiction ? doc.jurisdiction.replace(/ /g, '_') : null;
            const jurisdictionMatch = jurisdictionFilters.length === 0 || 
              (docJurisdiction && jurisdictionFilters.includes(docJurisdiction));
            
            // Check document type filter
            const typeMatch = documentTypeFilters.length === 0 || 
              documentTypeFilters.includes(doc.type);
            
            return jurisdictionMatch && typeMatch;
          });
          
          console.log(`Filtered results: ${finalResults.length} items`);
          // Update UI with filtered results
          setResults(finalResults);
          setUsingMockData(false);

          // OPTIMIZED: Only fetch new facet counts if we need them
          // Use the current query (or default to "" if empty) for facet counts
          const facetQuery = currentQuery.trim() ? currentQuery : "";
          
          // Check if we have a new combination of query + filters that requires new facet counts
          // or if we never fetched facet counts before
          const needsFacetData = Object.keys(documentCounts.jurisdictions).length === 0;
          const facetQueryChanged = facetQuery !== searchQuery;
          const filtersChanged = jurisdiction !== null || documentType !== null;
          
          if (needsFacetData || facetQueryChanged || filtersChanged) {
            console.log(`Fetching facet counts with query "${facetQuery}" and filters:`, { jurisdiction, documentType });
            
            // Only make this API call when necessary
            searchKendra(facetQuery, jurisdiction, documentType, true)
              .then(facetResponse => {
                if (facetResponse?.facets && currentRunId === searchRunId.current) {
                  console.log(`Received facet counts for filtered query "${facetQuery}":`, {
                    documentTypes: Object.keys(facetResponse.facets.documentTypes || {}).length,
                    jurisdictions: Object.keys(facetResponse.facets.jurisdictions || {}).length
                  });
                  setDocumentCounts(facetResponse.facets);
                }
              })
              .catch(error => {
                console.error('Error fetching facet counts:', error);
                // Don't set error for facet counts
              });
          } else {
            console.log('Using existing facet counts since filters/query have not changed');
          }
        })
        .catch(error => {
          console.error('Error applying filters:', error);
          setError(error);
        });
    } else {
      // If no filters are active, perform a regular search
      handleSearch(searchQuery);
    }
  };

  return (
    <SearchPageContext.Provider value={{
      results,
      loading,
      error,
      usingMockData,
      handleSearch,
      handleFilterChange,
      filters,
      clearSearch,
      setResults,
      searchQuery,
      documentCounts,
      sortedJurisdictions
    }}>
      {children}
    </SearchPageContext.Provider>
  );
};

export const useSearchPage = () => {
  const context = useContext(SearchPageContext);
  if (!context) {
    throw new Error('useSearchPage must be used within a SearchPageProvider');
  }
  return context;
}; 