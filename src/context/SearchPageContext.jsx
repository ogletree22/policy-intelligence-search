import React, { createContext, useContext, useState, useRef } from 'react';
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
  'Colorado': 'Colorado',
  'Texas': 'Texas',
  'Washington': 'Washington'
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
  
  const searchRunId = useRef(0);
  const seenDocuments = useRef(new Set());

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
    
    const kendraJurisdiction = jurisdiction ? 
      reverseJurisdictionMapping[jurisdiction] || jurisdiction.replace(/_/g, ' ') : null;
    
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
        console.log(`Attempting Kendra search: query="${query}", jurisdiction="${kendraJurisdiction || 'all'}", docType="${documentType || 'all'}"`);
        searchResponse = await searchKendra(query, kendraJurisdiction, documentType);
        
        // Verify we got a valid response
        if (searchResponse && searchResponse.results) {
          success = true;
          console.log('Kendra search successful');
        } else {
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

    if (!success) {
      console.log('Falling back to mock data after API failures');
      setUsingMockData(true);
      setLoading(false);
      return null;
    }

    if (runId !== searchRunId.current) {
      setLoading(false);
      return null;
    }

    const transformedResults = transformKendraResults(searchResponse.results) || [];
    console.log(`Processed ${transformedResults.length} documents from Kendra`);
    
    setLoading(false);
    return transformedResults;
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    searchRunId.current++;
    const currentRunId = searchRunId.current;
    
    // Clear seen documents for new search
    seenDocuments.current.clear();
    
    if (!query || query.trim() === '') {
      setResults([]);
      setUsingMockData(false);
      setError(null);
      return;
    }

    try {
      const apiResults = await queryWithRetry(query, null, null, currentRunId);
      
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
          
          console.log(`Setting ${uniqueResults.length} results from API`);
          setResults(uniqueResults);
          setUsingMockData(false);
        } else {
          // Fall back to mock data if API returns no results
          console.log('No API results, falling back to mock data');
          const filteredResults = MOCK_DOCUMENTS.filter(doc => 
            doc.title?.toLowerCase().includes(query.toLowerCase()) || 
            doc.description?.toLowerCase().includes(query.toLowerCase()) ||
            doc.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
          );
          setResults(filteredResults);
          setUsingMockData(true);
        }
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error);
      setUsingMockData(true);
      
      // Fall back to mock data on error
      const filteredResults = MOCK_DOCUMENTS.filter(doc => 
        doc.title?.toLowerCase().includes(query.toLowerCase()) || 
        doc.description?.toLowerCase().includes(query.toLowerCase()) ||
        doc.keywords?.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filteredResults);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Applying filters:', newFilters);
    setFilters(newFilters);
    
    // Apply filters to current results
    const filteredResults = results.filter(doc => {
      // If no filters are active, show all results
      const activeFilterKeys = Object.entries(newFilters)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      console.log('Active filter keys:', activeFilterKeys);

      if (activeFilterKeys.length === 0) return true;

      // Check if document matches any of the active filters
      return activeFilterKeys.some(filter => {
        // Handle jurisdiction filters
        if (JURISDICTIONS.includes(filter)) {
          const docJurisdiction = doc.jurisdiction?.replace(/ /g, '_');
          const matches = docJurisdiction === filter;
          console.log(`Checking jurisdiction filter: ${filter}, Document jurisdiction: ${docJurisdiction}, Matches: ${matches}`);
          return matches;
        }
        
        // Handle document type filters
        if (DOCUMENT_TYPES.includes(filter)) {
          const matches = Array.isArray(doc.type) ? doc.type.includes(filter) : doc.type === filter;
          console.log(`Checking document type filter: ${filter}, Document type: ${doc.type}, Matches: ${matches}`);
          return matches;
        }
        
        return false;
      });
    });

    console.log('Filtered results count:', filteredResults.length);
    setResults(filteredResults);
  };

  console.log('SearchPageProvider initialized with handleSearch:', handleSearch);

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
      searchQuery
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