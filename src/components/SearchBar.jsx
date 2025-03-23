import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import searchIcon from '../assets/search-icon.png';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search: waits before sending query to parent
  useEffect(() => {
    if (debouncedQuery === '') return;

    const timeout = setTimeout(() => {
      onSearch(debouncedQuery);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(timeout);
  }, [debouncedQuery, onSearch]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setDebouncedQuery(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
  };

  return (
    <div className="search-panel-header">
      <h2 className="search-title">Document search</h2>
      <div className="search-controls">
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Search" className="search-icon-img" />
          <input
            type="text"
            placeholder="e.g. nox regulations colorado"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {query && <FaTimes className="clear-icon" onClick={handleClear} />}
        </div>

        <div className="sort-wrapper">
          <label htmlFor="sort">Sort:</label>
          <select id="sort">
            <option value="relevance">Relevance</option>
            <option value="recent">Most Recent</option>
          </select>
          <FaChevronDown className="sort-arrow-icon" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
