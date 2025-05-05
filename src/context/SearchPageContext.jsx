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
  'Kentucky': 'Kentucky',
  'Alaska': 'Alaska',
  'Arkansas': 'Arkansas',
  'Amador APCD': 'Amador_APCD',
  'Antelope Valley AQMD': 'Antelope_Valley_AQMD',
  'Butte County AQMD': 'Butte_County_AQMD',
  'Calaveras County APCD': 'Calaveras_County_APCD',
  'California SCAQMD': 'California_SCAQMD',
  'Colusa County APCD': 'Colusa_County_APCD',
  'Eastern Kern APCD': 'Eastern_Kern_APCD',
  'El Dorado County AQMD': 'El_Dorado_County_AQMD',
  'Feather River AQMD': 'Feather_River_AQMD',
  'Glenn County APCD': 'Glenn_County_APCD',
  'Great Basin Unified APCD': 'Great_Basin_Unified_APCD',
  'Imperial County APCD': 'Imperial_County_APCD',
  'Lake County AQMD': 'Lake_County_AQMD',
  'Lassen County APCD': 'Lassen_County_APCD',
  'Mariposa County APCD': 'Mariposa_County_APCD',
  'Mendocino County AQMD': 'Mendocino_County_AQMD',
  'Modoc County APCD': 'Modoc_County_APCD',
  'Mojave Desert AQMD': 'Mojave_Desert_AQMD',
  'Monterey Bay Unified APCD': 'Monterey_Bay_Unified_APCD',
  'North Coast Unified AQMD': 'North_Coast_Unified_AQMD',
  'Northern Sierra AQMD': 'Northern_Sierra_AQMD',
  'Northern Sonoma County APCD': 'Northern_Sonoma_County_APCD',
  'Placer County APCD': 'Placer_County_APCD',
  'Sacramento Metropolitan AQMD': 'Sacramento_Metropolitan_AQMD',
  'San Diego County APCD': 'San_Diego_County_APCD',
  'San Luis Obispo County APCD': 'San_Luis_Obispo_County_APCD',
  'Shasta County AQMD': 'Shasta_County_AQMD',
  'Siskiyou County APCD': 'Siskiyou_County_APCD',
  'Tehama County APCD': 'Tehama_County_APCD',
  'Tuolumne County APCD': 'Tuolumne_County_APCD',
  'Ventura County AQMD': 'Ventura_County_AQMD',
  'Yolo-Solano AQMD': 'Yolo-Solano_AQMD',
  'Connecticut': 'Connecticut',
  'Delaware': 'Delaware',
  'Florida': 'Florida',
  'Georgia': 'Georgia',
  'Hawaii': 'Hawaii',
  'Idaho': 'Idaho',
  'Illinois': 'Illinois',
  'Kansas': 'Kansas',
  'Maryland': 'Maryland',
  'Massachusetts': 'Massachusetts',
  'Michigan': 'Michigan',
  'Mississippi': 'Mississippi',
  'Nevada': 'Nevada',
  'New Mexico-Albuquerque': 'New_Mexico-Albuquerque',
  'North Carolina': 'North_Carolina',
  'North Dakota': 'North_Dakota',
  'Oklahoma': 'Oklahoma',
  'Oregon': 'Oregon',
  'Pennsylvania': 'Pennsylvania',
  'South Carolina': 'South_Carolina',
  'South Dakota': 'South_Dakota',
  'Tennessee': 'Tennessee',
  'Vermont': 'Vermont',
  'Virginia': 'Virginia',
  'Wisconsin': 'Wisconsin',
  'Wyoming': 'Wyoming'
};

// Reverse mapping for display and Kendra searches
const reverseJurisdictionMapping = Object.fromEntries(
  Object.entries(jurisdictionMapping).map(([key, value]) => [value, key])
);

// Debug the mapping
console.log('Jurisdiction mappings loaded:');
console.log('- Total forward mappings:', Object.keys(jurisdictionMapping).length);
console.log('- Total reverse mappings:', Object.keys(reverseJurisdictionMapping).length);
console.log('- First few reverse mappings:');
Object.entries(reverseJurisdictionMapping).slice(0, 5).forEach(([key, value]) => {
  console.log(`  "${key}" => "${value}"`);
});

const LOCAL_STORAGE_KEY = 'searchHistory';

export const SearchPageProvider = ({ children }) => {
  const MAX_RESULTS = 100;
  
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [facetLoading, setFacetLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [documentCounts, setDocumentCounts] = useState({
    documentTypes: {},
    jurisdictions: {}
  });
  
  const [sortedJurisdictions, setSortedJurisdictions] = useState([]);
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

  const queryWithRetry = async (query, jurisdictions = null, documentType = null, runId) => {
    // Skip if the search ID has changed
    if (runId !== searchRunId.current) {
      console.log('Search run ID changed, skipping stale request');
      return null;
    }
    
    console.log('========== SEARCH REQUEST DETAILS ==========');
    console.log(`Query: "${query}"`);
    
    // Log jurisdiction information
    if (Array.isArray(jurisdictions)) {
      console.log(`Jurisdiction filters: [${jurisdictions.join(', ')}] (count: ${jurisdictions.length})`);
    } else if (jurisdictions) {
      console.log(`Jurisdiction filter: "${jurisdictions}" (single value)`);
    } else {
      console.log('No jurisdiction filters applied');
    }
    
    console.log(`Document type filter: "${documentType || 'None'}"`);
    console.log(`Run ID: ${runId}`);
    console.log('===========================================');
    
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
        console.log(`Attempting Kendra search with query="${query}" and ${Array.isArray(jurisdictions) ? jurisdictions.length : 0} jurisdiction filters`);
        // This is the only actual data fetching call for search results
        searchResponse = await searchKendra(query, jurisdictions, documentType);
        
        // Log the response for debugging
        console.log('Search response received');
        
        // Verify we got a valid response with results
        if (searchResponse && Array.isArray(searchResponse.results)) {
          if (searchResponse.results.length > 0) {
            success = true;
            console.log('Kendra search successful with', searchResponse.results.length, 'results');
            
            // Log the jurisdiction of the first few results for debugging
            if (searchResponse.results.length > 0) {
              const sampledResults = searchResponse.results.slice(0, 3);
              console.log('Sample jurisdiction values from results:');
              sampledResults.forEach((result, idx) => {
                const jurisdictionAttrs = Array.isArray(result.DocumentAttributes) 
                  ? result.DocumentAttributes.filter(attr => attr.Key === 'jurisdiction' || attr.Key === 'jurisdiction_name')
                  : [];
                
                console.log(`Result ${idx} jurisdiction:`, 
                  jurisdictionAttrs.length > 0 
                    ? jurisdictionAttrs.map(j => `${j.Key}: ${j.Value?.StringValue || 'N/A'}`).join(', ')
                    : 'Not found in DocumentAttributes'
                );
              });
            }
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
    
    // Check the jurisdiction values in the transformed results
    if (transformedResults.length > 0) {
      console.log('Jurisdiction values in final transformed results:');
      transformedResults.slice(0, 3).forEach((doc, idx) => {
        console.log(`- Result ${idx} jurisdiction: "${doc.jurisdiction || 'N/A'}"`);
      });
    }
    
    return transformedResults;
  };

  const handleSearch = async (query) => {
    console.log('Handling search for query:', query);
    setSearchQuery(query);
    searchRunId.current++;
    const currentRunId = searchRunId.current;
    
    initialSearchPerformed.current = true;
    
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
      history = [query, ...history.filter(item => item !== query)];
      if (history.length > 20) history = history.slice(0, 20);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    }
    
    seenDocuments.current.clear();
    
    if (!query || query.trim() === '') {
      console.log('Empty query, showing empty state');
      setResults([]);
      return;
    }

    try {
      console.log('Searching with query:', query);
      setLoading(true);
      
      // First, get the initial search results
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
          
          console.log(`Setting ${uniqueResults.length} unique results from API`);
          setResults(uniqueResults);
          setUsingMockData(false);
        } else {
          console.log('No results found for query');
          setResults([]);
        }
      }

      // Then, fetch facet counts in the background
      setFacetLoading(true);
      try {
        const facetResponse = await searchKendra(query, null, null, true);
        if (facetResponse && facetResponse.facets) {
          console.log(`Received facet counts for query "${query}":`, {
            documentTypes: Object.keys(facetResponse.facets.documentTypes || {}).length,
            jurisdictions: Object.keys(facetResponse.facets.jurisdictions || {}).length
          });
          setDocumentCounts(facetResponse.facets);
        }
      } catch (facetError) {
        console.error('Error fetching facet counts:', facetError);
      } finally {
        setFacetLoading(false);
      }
    } catch (error) {
      console.error('Error in handleSearch:', error);
      setError(error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    console.log('Applying filters:', newFilters);
    
    setFilters(newFilters);
    
    // Convert filter keys with spaces to have underscores to match JURISDICTIONS format
    const processedFilters = {};
    Object.keys(newFilters).forEach(key => {
      // If the key has spaces, replace them with underscores
      const processedKey = key.replace(/ /g, '_');
      processedFilters[processedKey] = newFilters[key];
    });
    
    // Get active filters from the processed filters
    const activeFilterKeys = Object.keys(processedFilters).filter(key => processedFilters[key] === true);

    // Get all active jurisdiction and document type filters
    const jurisdictionFilters = activeFilterKeys.filter(key => JURISDICTIONS.includes(key));
    const documentTypeFilters = activeFilterKeys.filter(key => DOCUMENT_TYPES.includes(key));

    console.log('Active jurisdiction filters:', jurisdictionFilters);
    console.log('Active document type filters:', documentTypeFilters);

    // Convert jurisdiction names from UI format (with underscores) to Kendra API format (with spaces)
    const kendraJurisdictionFilters = jurisdictionFilters.map(jurisdiction => {
      // Always convert from underscores to spaces for Kendra API
      // Either use the pre-defined mapping or simply replace underscores with spaces
      return reverseJurisdictionMapping[jurisdiction] || jurisdiction.replace(/_/g, ' ');
    });

    console.log('Converted jurisdiction filters for Kendra API:', kendraJurisdictionFilters);

    // If we have filters, perform a new search with them
    if (jurisdictionFilters.length > 0 || documentTypeFilters.length > 0) {
      // Get document type filter (Kendra only supports one document type)
      const documentType = documentTypeFilters.length > 0 ? documentTypeFilters[0] : null;

      // Perform a new search with the current query and filters
      searchRunId.current++;
      const currentRunId = searchRunId.current;

      // Use the current search query when applying filters
      const currentQuery = searchQuery || '';
      console.log(`Searching with query "${currentQuery}" and filters:`, { 
        jurisdictions: kendraJurisdictionFilters, 
        documentType
      });

      // Pass all jurisdiction filters to queryWithRetry instead of just the first one
      queryWithRetry(currentQuery, kendraJurisdictionFilters, documentType, currentRunId)
        .then(filteredResults => {
          if (!filteredResults || currentRunId !== searchRunId.current) {
            // Don't proceed if the search was canceled or no results
            return;
          }
          
          console.log('Received filtered results:', filteredResults.length);
            
          // Apply additional filtering for multiple filters (if needed for client-side filtering)
          const finalResults = filteredResults.filter(doc => {
            // Debug for first document's jurisdiction value
            if (filteredResults.indexOf(doc) === 0) {
              console.log('First document jurisdiction details:');
              console.log(`- Original value: "${doc.jurisdiction}"`);
              console.log(`- After conversion: "${doc.jurisdiction ? doc.jurisdiction.replace(/ /g, '_') : null}"`);
            }
            
            // Check jurisdiction filter - safely handle undefined jurisdictions
            // For jurisdictions, we need to normalize both the document jurisdiction and the filter value
            let jurisdictionMatch = true;
            if (jurisdictionFilters.length > 0) {
              // Normalize document jurisdiction
              const docJurisdiction = doc.jurisdiction ? doc.jurisdiction.replace(/ /g, '_') : null;
              
              // Check if any of the selected jurisdiction filters match
              jurisdictionMatch = docJurisdiction && jurisdictionFilters.some(filter => {
                // Direct match
                if (filter === docJurisdiction) return true;
                
                // Special case for South Coast AQMD
                if (filter === 'South_Coast_AQMD' && 
                    (docJurisdiction === 'South_Coast_AQMD' || 
                     docJurisdiction === 'SCAQMD' || 
                     docJurisdiction.includes('South_Coast'))) {
                  return true;
                }
                
                // For other California air districts
                if (filter.includes('AQMD') || filter.includes('APCD')) {
                  const filterName = filter.replace(/_/g, ' ');
                  const docName = docJurisdiction.replace(/_/g, ' ');
                  return docName.includes(filterName) || filterName.includes(docName);
                }
                
                return false;
              });
            }
            
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
          const filtersChanged = kendraJurisdictionFilters.length > 0 || documentType !== null;
          
          if (needsFacetData || facetQueryChanged || filtersChanged) {
            console.log(`Fetching facet counts with query "${facetQuery}" and filters:`, { 
              jurisdictions: kendraJurisdictionFilters, 
              documentType 
            });
            
            // Only make this API call when necessary
            searchKendra(facetQuery, kendraJurisdictionFilters, documentType, true)
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
      facetLoading,
      error,
      usingMockData,
      handleSearch,
      handleFilterChange,
      filters,
      clearSearch,
      setResults,
      searchQuery,
      setSearchQuery,
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