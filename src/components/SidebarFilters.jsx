import React, { useState, useCallback } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './SidebarFilters.css';

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

const SidebarFilters = ({ onFilterChange, isDisabled, instanceId = 'default', documentCounts = {} }) => {
  // Add state to track pending changes before applying
  const [pendingFilters, setPendingFilters] = useState({
    jurisdictions: {
      'Colorado': true,
      'New_Mexico': true,
      'South_Coast_AQMD': true,
      'Bay_Area_AQMD': true,
      'Texas': true,
      'Washington': true
    },
    documentTypes: {}
  });
  
  // Add state to track the currently selected document type
  const [selectedDocType, setSelectedDocType] = useState(null);
  
  // Add state to track expanded/collapsed state of jurisdiction list
  const [showAllJurisdictions, setShowAllJurisdictions] = useState(false);

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
      
      <div className="filter-actions top-actions">
        <button 
          className="apply-filters-button small-button" 
          onClick={applyFilters}
          disabled={isDisabled}
        >
          Apply Filters
        </button>
        {(Object.values(pendingFilters.jurisdictions).some(Boolean) || selectedDocType) && (
          <button 
            className="clear-all-filters-button small-button" 
            onClick={() => {
              clearAllFilters();
              onFilterChange({});
            }}
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="filter-groups-container">
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

        <div className="filter-group">
          <h3 className="filter-group-title">Jurisdiction</h3>
          {visibleJurisdictions.map((jurisdiction, index) => {
            const count = getJurisdictionCount(jurisdiction, jurisdictionCounts);
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
                  {formatJurisdictionName(jurisdiction)} 
                  {count > 0 && <span className="count-inline">({count})</span>}
                </span>
              </label>
            );
          })}
          
          {sortedJurisdictions.length > 11 && (
            <button 
              className="show-more-button"
              onClick={() => setShowAllJurisdictions(!showAllJurisdictions)}
            >
              {showAllJurisdictions ? 'Show Less' : `Show More (${sortedJurisdictions.length - 11} more)`}
            </button>
          )}
          
          {Object.values(pendingFilters.jurisdictions).some(Boolean) && (
            <button 
              className="clear-filter-button"
              onClick={clearJurisdictionFilters}
            >
              Clear Jurisdictions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;
