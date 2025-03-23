import React from 'react';
import './SidebarFilters.css';

const SidebarFilters = () => {
  return (
    <div className="sidebar-filters">
      <h2 className="sidebar-title">Filters</h2>

      <div className="filter-group">
        <label>
          <input type="checkbox" />
          Colorado
        </label>
        <label>
          <input type="checkbox" />
          Texas
        </label>
        <label>
          <input type="checkbox" />
          New Mexico
        </label>
      </div>

      <div className="filter-group">
        <label>
          <input type="checkbox" />
          Regulation
        </label>
        <label>
          <input type="checkbox" />
          Plan
        </label>
        <label>
          <input type="checkbox" />
          Permit
        </label>
      </div>
    </div>
  );
};

export default SidebarFilters;
