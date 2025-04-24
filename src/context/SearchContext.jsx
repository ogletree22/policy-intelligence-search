import React, { createContext, useContext, useState, useEffect } from 'react';
import { searchDocuments } from '../services/searchService';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    documentType: [],
    jurisdiction: [],
    dateRange: null
  });

  // Handle search function
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data for now
      const mockResults = [
        {
          id: '1',
          title: 'Air Quality Standards',
          description: 'Air quality regulations and compliance standards',
          url: '#',
          jurisdiction: 'Colorado',
          documentType: 'Regulation'
        },
        {
          id: '2',
          title: 'Emissions Control Guidelines',
          description: 'Guidelines for industrial emissions control',
          url: '#',
          jurisdiction: 'New_Mexico',
          documentType: 'Guidance-Policy'
        },
        {
          id: '3',
          title: 'Environmental Compliance Report 2023',
          description: 'Annual report on environmental compliance metrics',
          url: '#',
          jurisdiction: 'Texas',
          documentType: 'Compliance Document'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResults(mockResults);
    } catch (err) {
      setError('Failed to search documents. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // Re-run search when filters change
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Context value
  const value = {
    searchQuery,
    results,
    loading,
    error,
    filters,
    handleSearch,
    handleFilterChange
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext; 