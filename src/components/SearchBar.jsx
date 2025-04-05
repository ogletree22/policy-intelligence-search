import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { FaTimes } from 'react-icons/fa';
import searchIcon from '../assets/search-icon.png';

const SearchBar = ({ onSearch, showHeader = true, initialValue = '' }) => {
  const [query, setQuery] = useState(initialValue);

  // Update local state when initialValue prop changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Remove the debounce effect - we'll only search on Enter now

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(query); // Directly call onSearch when Enter is pressed
    }
  };

  const handleClear = () => {
    const defaultValue = initialValue || '';
    setQuery(defaultValue);
    onSearch(defaultValue); // Trigger search with empty/default value on clear
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    // Don't trigger search on change anymore
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
          {query && <FaTimes className="clear-icon" onClick={handleClear} />}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
