import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSearchPage } from '../context/SearchPageContext';
import './MobileSearchBar.css';

const MobileSearchBar = ({ centered }) => {
  const { searchQuery, handleSearch, loading } = useSearchPage();
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className={`mobile-search-container${centered ? ' centered' : ''}`}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for policies..."
        className="mobile-search-input"
      />
      {loading && (
        null
      )}
      <button 
        className="mobile-search-button"
        onClick={() => handleSearch(query)}
        disabled={loading || !query.trim()}
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default MobileSearchBar; 