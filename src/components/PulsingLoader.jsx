import React from 'react';
import './PulsingLoader.css';
import aiTechIcon from '../assets/ai-technology.png';

const PulsingLoader = () => {
  return (
    <div className="pulsing-loader-container">
      <div className="pulsing-loader">
        <img src={aiTechIcon} alt="Loading" className="pulsing-icon" />
      </div>
    </div>
  );
};

export default PulsingLoader; 