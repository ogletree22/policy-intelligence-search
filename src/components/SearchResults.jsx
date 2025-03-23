// SearchResults.jsx
import React from 'react';
import './SearchResults.css';
import ResultCard from './ResultCard';

const SearchResults = ({ results }) => {
  return (
    <div className="results-container">
      <p className="results-summary">
        {results.length > 0
          ? `1-${results.length} of about 5,651 recommended documents`
          : 'No results found.'}
      </p>
      <div className="results-scroll-area">
        {results.map((result) => (
          <ResultCard key={result.pi_url} result={result} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
