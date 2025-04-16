import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { FaTimes } from 'react-icons/fa';
import searchIcon from '../assets/Search-Icon.png';
import { useSearchPage } from '../context/SearchPageContext';

const SearchBar = ({ showHeader = true, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);
  const { handleSearch } = useSearchPage();

  // Update local state when initialValue prop changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('Triggering search with query:', query);
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
          />
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
