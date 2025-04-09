import React, { useState, useCallback } from 'react';
import { FaUserCircle, FaFolder, FaTrash, FaEye, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { JurisdictionIcon, DocumentTypeIcon } from './icons/FilterIcons';
import './SidebarFilters.css';
import WorkingFolderView from './WorkingFolderView';

const JURISDICTIONS = [
  'Alaska',
  'Arkansas',
  'Amador_APCD',
  'Antelope_Valley_AQMD',
  'Bay_Area_AQMD',
  'Butte_County_AQMD',
  'Calaveras_County_APCD',
  'California_SCAQMD',
  'Colusa_County_APCD',
  'Eastern_Kern_APCD',
  'El_Dorado_County_AQMD',
  'Feather_River_AQMD',
  'Glenn_County_APCD',
  'Great_Basin_Unified_APCD',
  'Imperial_County_APCD',
  'Lake_County_AQMD',
  'Lassen_County_APCD',
  'Mariposa_County_APCD',
  'Mendocino_County_AQMD',
  'Modoc_County_APCD',
  'Mojave_Desert_AQMD',
  'Monterey_Bay_Unified_APCD',
  'North_Coast_Unified_AQMD',
  'Northern_Sierra_AQMD',
  'Northern_Sonoma_County_APCD',
  'Placer_County_APCD',
  'Sacramento_Metropolitan_AQMD',
  'San_Diego_County_APCD',
  'San_Joaquin_Valley_APCD',
  'San_Luis_Obispo_County_APCD',
  'Santa_Barbara_County_APCD',
  'Shasta_County_AQMD',
  'Siskiyou_County_APCD',
  'South_Coast_AQMD',
  'Tehama_County_APCD',
  'Tuolumne_County_APCD',
  'Ventura_County_AQMD',
  'Yolo-Solano_AQMD',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Kansas',
  'Kentuvky',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Mississippi',
  'Nevada',
  'New_Mexico-Albuquerque',
  'New_Mexico',
  'North_Carolina',
  'North_Dakota',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'South_Carolina',
  'South_Dakota',
  'Tennessee',
  'Texas',
  'Vermont',
  'Virginia',
  'Washington',
  'Wisconsin',
  'Wyoming'
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

// Helper function to format jurisdiction name for display
const formatJurisdictionName = (jurisdiction) => {
  // Replace underscores with spaces for display
  let formatted = jurisdiction.replace(/_/g, ' ');
  
  // Add California prefix to California jurisdictions
  if ((jurisdiction.includes('APCD') || jurisdiction.includes('AQMD')) && 
      !jurisdiction.startsWith('California') && 
      !formatted.startsWith('California')) {
    formatted = `California - ${formatted}`;
  }
  
  // Handle any special cases
  if (formatted === 'New Mexico Albuquerque') {
    return 'New Mexico - Albuquerque';
  }
  if (formatted === 'Yolo Solano') {
    return 'Yolo-Solano';
  }
  
  return formatted;
};

// Helper function to get the jurisdiction count considering California districts
const getJurisdictionCount = (jurisdiction, jurisdictionCounts) => {
  // Convert our jurisdiction name to match Kendra's format
  const kendraJurisdiction = jurisdiction.replace(/_/g, ' ');
  
  // For California districts, check multiple formats
  if (jurisdiction.includes('AQMD') || jurisdiction.includes('APCD')) {
    const directCount = jurisdictionCounts[jurisdiction] || 0;
    const californiaCount = jurisdictionCounts[`California/${jurisdiction}`] || 0;
    const kendraCount = jurisdictionCounts[kendraJurisdiction] || 0;
    const californiaKendraCount = jurisdictionCounts[`California (${kendraJurisdiction})`] || 0;
    return directCount + californiaCount + kendraCount + californiaKendraCount;
  }
  
  // For regular jurisdictions, check both formats
  return (jurisdictionCounts[jurisdiction] || 0) + (jurisdictionCounts[kendraJurisdiction] || 0);
};

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

  // Set default state to open
  const [isJurisdictionCollapsed, setIsJurisdictionCollapsed] = useState(false);
  const [isDocumentTypeCollapsed, setIsDocumentTypeCollapsed] = useState(false);

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

  // Sort jurisdictions by count in descending order
  const sortedJurisdictions = [...JURISDICTIONS].sort((a, b) => {
    const countA = getJurisdictionCount(a, jurisdictionCounts);
    const countB = getJurisdictionCount(b, jurisdictionCounts);
    return countB - countA; // Sort in descending order
  });

  // Get the jurisdictions to display based on collapsed/expanded state
  const visibleJurisdictions = showAllJurisdictions 
    ? sortedJurisdictions 
    : sortedJurisdictions.slice(0, 11);

  return (
    <div className={`sidebar-filters ${isDisabled ? 'disabled' : ''}`}>
      <div className="user-profile">
        <FaUserCircle className="user-icon" />
      </div>
      <h2 className="sidebar-title">Filters</h2>
      <div className="filter-groups-container">
        <div className="filter-group">
          <div className="filter-group-title">
            <JurisdictionIcon className="filter-icon" />
            <span>Jurisdiction</span>
            <button 
              className="collapse-button"
              onClick={() => setIsJurisdictionCollapsed(!isJurisdictionCollapsed)}
              aria-label={isJurisdictionCollapsed ? "Expand jurisdiction filters" : "Collapse jurisdiction filters"}
            >
              {isJurisdictionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
          {!isJurisdictionCollapsed && JURISDICTIONS.map((jurisdiction, index) => {
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
        </div>

        <div className="filter-group">
          <div className="filter-group-title">
            <DocumentTypeIcon className="filter-icon" />
            <span>Document Type</span>
            <button 
              className="collapse-button"
              onClick={() => setIsDocumentTypeCollapsed(!isDocumentTypeCollapsed)}
              aria-label={isDocumentTypeCollapsed ? "Expand document type filters" : "Collapse document type filters"}
            >
              {isDocumentTypeCollapsed ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
          {!isDocumentTypeCollapsed && DOCUMENT_TYPES.map((type, index) => {
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
