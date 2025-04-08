import React, { useState, useCallback } from 'react';
import { FaUserCircle, FaFolder, FaTrash, FaEye, FaTimes } from 'react-icons/fa';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import './SidebarFilters.css';
import WorkingFolderView from './WorkingFolderView';

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

const SidebarFilters = ({ 
  onFilterChange, 
  isDisabled, 
  instanceId = 'default', 
  documentCounts = {}
}) => {
  // Add state to track all filters
  const [filters, setFilters] = useState({
    jurisdictions: {},
    documentTypes: {}
  });

  // Get working folder functionality from context
  const { workingFolderDocs, removeFromWorkingFolder } = useWorkingFolder();
  const [isWorkingFolderOpen, setIsWorkingFolderOpen] = useState(false);
  
  const handleFilterChange = useCallback((category, value) => {
    console.log('Filter change in SidebarFilters:', category, value);
    
    // Toggle the selected filter
    const newFilters = {
      ...filters,
      [category]: {
        ...filters[category],
        [value]: !filters[category][value]
      }
    };
    
    setFilters(newFilters);
    
    // Immediately apply all active filters
    const activeFilters = {
      ...Object.entries(newFilters.jurisdictions)
        .filter(([_, isSelected]) => isSelected)
        .reduce((acc, [key]) => ({ ...acc, [key]: true }), {}),
      ...Object.entries(newFilters.documentTypes)
        .filter(([_, isSelected]) => isSelected)
        .reduce((acc, [key]) => ({ ...acc, [key]: true }), {})
    };
    onFilterChange(activeFilters);
  }, [filters, onFilterChange]);

  const clearJurisdictionFilters = useCallback(() => {
    const newFilters = {
      ...filters,
      jurisdictions: {}
    };
    setFilters(newFilters);
    
    // Apply remaining document type filters
    const activeFilters = Object.entries(newFilters.documentTypes)
      .filter(([_, isSelected]) => isSelected)
      .reduce((acc, [key]) => ({ ...acc, [key]: true }), {});
    onFilterChange(activeFilters);
  }, [filters, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      jurisdictions: {},
      documentTypes: {}
    });
    onFilterChange({});
  }, [onFilterChange]);

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
                  checked={filters.jurisdictions[jurisdiction] || false}
                  onChange={() => handleFilterChange('jurisdictions', jurisdiction)}
                />
                <span className="filter-label-text">
                  {jurisdiction} 
                  {count > 0 && <span className="count-inline">({count})</span>}
                </span>
              </label>
            );
          })}
          {Object.values(filters.jurisdictions).some(Boolean) && (
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
                className="filter-label"
              >
                <input
                  type="checkbox"
                  id={`${instanceId}-doctype-${index}`}
                  checked={filters.documentTypes[type] || false}
                  onChange={() => handleFilterChange('documentTypes', type)}
                />
                <span className="filter-label-text">
                  {displayType}
                  {count > 0 && <span className="count-inline">({count})</span>}
                </span>
              </label>
            );
          })}
        </div>
        
        <div className="filter-separator"></div>

        <div className="working-folder-section">
          <div className="working-folder-header">
            <span>Working Folder ({workingFolderDocs.length})</span>
            <div className="working-folder-actions">
              <button 
                className="view-folder-button" 
                onClick={() => setIsWorkingFolderOpen(true)}
                title="View working folder contents"
              >
                <FaEye />
              </button>
              <button 
                className="clear-all-button"
                onClick={() => {
                  // Clear all documents from working folder
                  workingFolderDocs.forEach(doc => {
                    removeFromWorkingFolder(doc.id);
                  });
                }}
                title="Clear all documents"
                disabled={workingFolderDocs.length === 0}
              >
                <FaTimes />
              </button>
            </div>
          </div>
          <div className="working-folder-list">
            {workingFolderDocs.length === 0 ? (
              <div className="empty-folder-message">
                <span className="empty-text">No documents selected</span>
              </div>
            ) : (
              workingFolderDocs.map((doc) => (
                <div key={doc.id} className="working-folder-item">
                  <span className="doc-title">{doc.title}</span>
                  <button
                    className="remove-doc-button"
                    onClick={() => removeFromWorkingFolder(doc.id)}
                    title="Remove from working folder"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {(Object.values(filters.jurisdictions).some(Boolean) || 
          Object.values(filters.documentTypes).some(Boolean)) && (
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

      <WorkingFolderView 
        isOpen={isWorkingFolderOpen}
        onClose={() => setIsWorkingFolderOpen(false)}
        documents={workingFolderDocs}
      />
    </div>
  );
};

export default SidebarFilters;
