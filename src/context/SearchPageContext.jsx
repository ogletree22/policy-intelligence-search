import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
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

export const SearchPageProvider = ({ children }) => {
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
  
  const searchRunId = useRef(0);
  const seenDocuments = useRef(new Set());

  // Function to perform initial search when component mounts
  useEffect(() => {
    const performInitialSearch = async () => {
      try {
        setLoading(true);
        const response = await searchKendra('', null, null, true);
        if (response && response.results) {
          const transformedResults = transformKendraResults(response.results);
          setResults(transformedResults);
          setUsingMockData(false);
        }
      } catch (error) {
        console.error('Error in initial search:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    performInitialSearch();
  }, []);

  const clearSearch = () => {
    setResults([]);
    setSearchQuery('');
    setError(null);
    setUsingMockData(false);
    seenDocuments.current.clear();
  };

  const queryWithRetry = async (query, jurisdiction = null, documentType = null, runId) => {
    if (runId !== searchRunId.current) {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    let retries = 0;
    const MAX_RETRIES = 3;
    let success = false;
    let searchResponse;

    while (retries < MAX_RETRIES && !success) {
      if (runId !== searchRunId.current) {
        setLoading(false);
        return null;
      }
      
      try {
        console.log(`Attempting Kendra search: query="${query}", jurisdiction="${jurisdiction || 'all'}", docType="${documentType || 'all'}"`);
        searchResponse = await searchKendra(query, jurisdiction, documentType);
        
        // Log the response for debugging
        console.log('Search response:', searchResponse);
        
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

    if (runId !== searchRunId.current) {
      return null;
    }

    const transformedResults = transformKendraResults(searchResponse.results);
    console.log(`Processed ${transformedResults.length} documents from Kendra:`, transformedResults);
    
    return transformedResults;
  };

  const handleSearch = async (query) => {
    console.log('Handling search for query:', query);
    setSearchQuery(query);
    searchRunId.current++;
    const currentRunId = searchRunId.current;
    
    // Clear seen documents for new search
    seenDocuments.current.clear();
    
    if (!query || query.trim() === '') {
      // For empty queries, fetch all documents and facet counts
      try {
        console.log('Empty query, fetching all documents and facet counts...');
        const [apiResults, facetResponse] = await Promise.all([
          queryWithRetry('', null, null, currentRunId),
          searchKendra('', null, null, true)
        ]);
        
        if (facetResponse && facetResponse.facets) {
          setDocumentCounts(facetResponse.facets);
        }
        
        if (apiResults && apiResults.length > 0) {
          console.log('Setting results from empty query search:', apiResults.length, 'items');
          setResults(apiResults);
          setUsingMockData(false);
        } else {
          console.log('No results from empty query search');
          setResults([]);
        }
      } catch (error) {
        console.error('Error fetching all documents:', error);
        setError(error);
        setResults([]);
      }
      return;
    }

    try {
      console.log('Searching with query:', query);
      const [apiResults, facetResponse] = await Promise.all([
        queryWithRetry(query, null, null, currentRunId),
        searchKendra(query, null, null, true)
      ]);
      
      if (facetResponse && facetResponse.facets) {
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

      // First, get the filtered results
      queryWithRetry(currentQuery, jurisdiction, documentType, currentRunId)
        .then(filteredResults => {
          if (filteredResults) {
            console.log('Received filtered results:', filteredResults);
            
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
            setResults(finalResults);
            setUsingMockData(false);

            // Then, update the facet counts for the new filter state
            searchKendra(currentQuery, jurisdiction, documentType, true)
              .then(facetResponse => {
                if (facetResponse && facetResponse.facets) {
                  setDocumentCounts(facetResponse.facets);
                }
              })
              .catch(error => {
                console.error('Error fetching facet counts:', error);
              });
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
      documentCounts
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