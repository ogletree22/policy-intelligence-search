import React, { useState, useCallback, useEffect } from 'react';
import SearchResults from './SearchResults';
import SidebarFilters from './SidebarFilters';
import './MainContent.css';

const MainContent = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const [filteredResults, setFilteredResults] = useState([]);

  const jurisdictionData = {};

  const applyFilters = useCallback((documents, filters) => {
    console.log('Applying filters:', filters);
    console.log('Available documents:', documents.length);
    
    if (Object.keys(filters).length === 0) {
      console.log('No filters active, returning all documents');
      return documents;
    }

    const selectedJurisdictions = Object.keys(filters).filter(key => 
      filters[key] && Object.keys(jurisdictionData).includes(key)
    );
    
    console.log('Selected jurisdictions:', selectedJurisdictions);

    return documents.filter(doc => {
      const jurisdictionMatch = selectedJurisdictions.length === 0 || 
        selectedJurisdictions.includes(doc.jurisdiction);
      
      console.log('Document:', doc.title);
      console.log('Document jurisdiction:', doc.jurisdiction);
      console.log('Jurisdiction match:', jurisdictionMatch);
      
      return jurisdictionMatch;
    });
  }, [jurisdictionData]);

  const handleFilterChange = useCallback((newFilters) => {
    console.log('Filter change received:', newFilters);
    setActiveFilters(newFilters);
  }, []);

  useEffect(() => {
    console.log('Effect running with filters:', activeFilters);
    let allDocuments = [];
    Object.values(jurisdictionData).forEach(jurisdiction => {
      allDocuments = allDocuments.concat(jurisdiction.documents);
    });
    
    console.log('Total documents before filtering:', allDocuments.length);
    const filtered = applyFilters(allDocuments, activeFilters);
    console.log('Filtered documents:', filtered.length);
    
    setFilteredResults(filtered);
  }, [activeFilters, applyFilters, jurisdictionData]);

  return (
    <div className="main-content">
      <SidebarFilters onFilterChange={handleFilterChange} instanceId="main-content" />
      <SearchResults results={filteredResults} />
    </div>
  );
};

export default MainContent; 