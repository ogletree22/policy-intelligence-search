import React from 'react';
import './SearchBar.css';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import searchIcon from '../assets/search-icon.png';

const SearchBar = ({ query, onChange, onClear, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    onSearch(query);    // Trigger search manually
  };

  return (
    <div className="search-panel-header">
      <h2 className="search-title">Document search</h2>
      <div className="search-controls">
        <form className="search-input-wrapper" onSubmit={handleSubmit}>
          <img src={searchIcon} alt="Search" className="search-icon-img" />
          <input
            type="text"
            value={query}
            onChange={onChange}
            placeholder="e.g. nox regulations colorado"
          />
          <FaTimes
            className={`clear-icon ${!query ? 'disabled' : ''}`}
            onClick={query ? onClear : null}
          />
        </form>

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
