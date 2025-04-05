import React, { useState, useCallback } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './SidebarFilters.css';

const JURISDICTIONS = [
  'Colorado',
  'New Mexico',
  'South Coast AQMD',
  'Bay Area AQMD',
  'Texas',
  'Washington'
];

// Document types list
const DOCUMENT_TYPES = [
  'Regulation',
  ' Source Report',
  'Compliance Document',
  'Guidance-Policy',
  'Form-Template',
  'State Implementation Plan',
  'Protocol',
  'General Info Item',
  'Legislation'
];

const SidebarFilters = ({ onFilterChange, isDisabled, instanceId = 'default', documentCounts = {} }) => {
  // Add state to track pending changes before applying
  const [pendingFilters, setPendingFilters] = useState({
    jurisdictions: {},
    documentTypes: {}
  });
  
  // Add state to track the currently selected document type
  const [selectedDocType, setSelectedDocType] = useState(null);

  const handleFilterChange = useCallback((category, value) => {
    console.log('Filter change in SidebarFilters:', category, value);
    
    if (category === 'documentTypes') {
      // For document types, clear previous selections and only set the new one
      // Check if we're clicking the already selected item (to deselect it)
      const isDeselecting = pendingFilters.documentTypes[value];
      
      setPendingFilters(prev => ({
        ...prev,
        documentTypes: isDeselecting ? {} : { [value]: true }
      }));
      
      // Update selected doc type
      setSelectedDocType(isDeselecting ? null : value);
    } else {
      // For jurisdictions, just toggle the current selection
      setPendingFilters(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [value]: !prev[category][value]
        }
      }));
    }
  }, [pendingFilters]);
  
  const applyFilters = useCallback(() => {
    // Create a flat object of active filters
    const activeFilters = {};
    
    // Add selected jurisdictions
    Object.entries(pendingFilters.jurisdictions).forEach(([key, isSelected]) => {
      if (isSelected) activeFilters[key] = true;
    });
    
    // Add selected document type
    if (selectedDocType) {
      activeFilters[selectedDocType] = true;
    }
    
    console.log('Applying filters:', activeFilters);
    onFilterChange(activeFilters);
  }, [pendingFilters, selectedDocType, onFilterChange]);

  const clearJurisdictionFilters = useCallback(() => {
    setPendingFilters(prev => ({
      ...prev,
      jurisdictions: {}
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setPendingFilters({
      jurisdictions: {},
      documentTypes: {}
    });
    setSelectedDocType(null);
  }, []);

  // Extract document counts from props
  const { documentTypes: docTypeCounts = {}, jurisdictions: jurisdictionCounts = {} } = documentCounts;

  return (
    <div className={`sidebar-filters ${isDisabled ? 'disabled' : ''}`}>
      <div className="user-profile">
        <FaUserCircle className="user-icon" />
      </div>
      <h2 className="sidebar-title">Filters</h2>
      <div className="filter-groups-container">
        <div className="filter-group">
          <h3 className="filter-group-title">Jurisdiction</h3>
          {JURISDICTIONS.map((jurisdiction, index) => {
            const count = jurisdictionCounts[jurisdiction] || 0;
            return (
              <label 
                key={`${instanceId}-jurisdiction-${index}`} 
                htmlFor={`${instanceId}-jurisdiction-${index}`}
                className="filter-label"
              >
                <input
                  type="checkbox"
                  id={`${instanceId}-jurisdiction-${index}`}
                  checked={pendingFilters.jurisdictions[jurisdiction] || false}
                  onChange={() => handleFilterChange('jurisdictions', jurisdiction)}
                />
                <span className="filter-label-text">
                  {jurisdiction} 
                  {count > 0 && <span className="count-inline">({count})</span>}
                </span>
              </label>
            );
          })}
          {Object.values(pendingFilters.jurisdictions).some(Boolean) && (
            <button 
              className="clear-filter-button"
              onClick={clearJurisdictionFilters}
            >
              Clear Jurisdictions
            </button>
          )}
        </div>

        <div className="filter-group">
          <h3 className="filter-group-title">Document Type</h3>
          {DOCUMENT_TYPES.map((type, index) => {
            const displayType = type.trim();
            const count = docTypeCounts[type] || 0;
            
            return (
              <label 
                key={`${instanceId}-doctype-${index}`} 
                htmlFor={`${instanceId}-doctype-${index}`} 
                className="radio-label filter-label"
              >
                <input
                  type="radio"
                  name={`${instanceId}-doctype`}
                  id={`${instanceId}-doctype-${index}`}
                  checked={pendingFilters.documentTypes[type] || false}
                  onChange={() => handleFilterChange('documentTypes', type)}
                />
                <span className="filter-label-text">
                  {displayType}
                  {count > 0 && <span className="count-inline">({count})</span>}
                </span>
              </label>
            );
          })}
          {selectedDocType && (
            <button 
              className="clear-filter-button"
              onClick={() => {
                setPendingFilters(prev => ({
                  ...prev,
                  documentTypes: {}
                }));
                setSelectedDocType(null);
              }}
            >
              Clear Document Type
            </button>
          )}
        </div>
        
        <div className="filter-actions">
          <button 
            className="apply-filters-button" 
            onClick={applyFilters}
            disabled={isDisabled}
          >
            Apply Filters
          </button>
          {(Object.values(pendingFilters.jurisdictions).some(Boolean) || selectedDocType) && (
            <button 
              className="clear-all-filters-button" 
              onClick={() => {
                clearAllFilters();
                onFilterChange({});
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
