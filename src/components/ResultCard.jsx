import React from 'react';
import './ResultCard.css';

const ResultCard = ({ result }) => {
  return (
    <div className="result-card">
      <h3 className="result-title">
        <a href="#">{result.title}</a>
      </h3>
      <p className="result-description">
        {result.description || 'No description available.'}
      </p>
      <div className="result-tags">
        <span className="tag">{result.jurisdiction}</span>
        <span className="tag">{result.type}</span>
      </div>
    </div>
  );
};

export default ResultCard;
