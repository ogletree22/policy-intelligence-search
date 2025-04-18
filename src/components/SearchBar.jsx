import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { FaTimes } from 'react-icons/fa';
import searchIcon from '../assets/Search-Icon.png';
import { useSearchPage } from '../context/SearchPageContext';
import LoadingSpinner from './LoadingSpinner';

const SearchBar = ({ showHeader = true }) => {
  const { searchQuery, handleSearch, loading } = useSearchPage();
  const [query, setQuery] = useState(searchQuery);
  const [searchHistory] = useState([
    'air quality',
    'landfill',
    'emissions',
    'nox regulations',
    'waste management',
    'permits'
  ]);

  // Update local state when context searchQuery changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Main SearchBar: Triggering search with query:', query);
      handleSearch(query);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery('');
    handleSearch('');
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // If the value matches a history item exactly, trigger search
    if (searchHistory.includes(newValue)) {
      handleSearch(newValue);
    }
  };

  return (
    <div className="search-panel-header">
      {showHeader && <h2 className="search-title">Document search</h2>}
      <div className="search-controls">
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Search" className="search-icon-img" />
          <input
            type="text"
            id="document-search"
            name="document-search"
            placeholder="e.g. air quality (press Enter to search)"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            aria-label="Search documents"
            list="search-history"
          />
          <datalist id="search-history">
            {searchHistory.map((item, index) => (
              <option key={index} value={item} />
            ))}
          </datalist>
          {loading && <LoadingSpinner />}
          {query && (
            <FaTimes 
              className="clear-icon" 
              onClick={handleClear}
              role="button"
              aria-label="Clear search"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
