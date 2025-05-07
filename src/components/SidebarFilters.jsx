import React, { useState, useCallback, useContext } from 'react';
import { FaUser, FaFolder, FaTrash, FaEye, FaTimes, FaChevronDown, FaChevronUp, FaBars, FaAngleDoubleLeft, FaAngleDoubleRight, FaFolderPlus, FaChevronRight } from 'react-icons/fa';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import { JurisdictionIcon, DocumentTypeIcon } from './icons/FilterIcons';
import { AuthContext } from '../context/AuthContext';
import { useSearchPage } from '../context/SearchPageContext';
import './SidebarFilters.css';
import WorkingFolderView from './WorkingFolderView';
import { useSidebar } from '../context/SidebarContext';
import CreateFolderModal from './CreateFolderModal';

const JURISDICTIONS = [
  'Colorado',
  'New_Mexico',
  'Texas',
  'South_Coast_AQMD',
  'Bay_Area_AQMD',
  'Washington',
  'Alaska',
  'Arkansas',
  'Amador_APCD',
  'Antelope_Valley_AQMD',
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
  'Tehama_County_APCD',
  'Tuolumne_County_APCD',
  'Ventura_County_AQMD',
  'Yolo-Solano_AQMD',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Kansas',
  'Kentucky',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Mississippi',
  'Nevada',
  'New_Mexico-Albuquerque',
  'North_Carolina',
  'North_Dakota',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'South_Carolina',
  'South_Dakota',
  'Tennessee',
  'Vermont',
  'Virginia',
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
const getJurisdictionCount = (jurisdiction, jurisdictionCounts = {}) => {
  // First try to get the count directly from the most recent document counts
  if (jurisdictionCounts && jurisdictionCounts[jurisdiction]) {
    return jurisdictionCounts[jurisdiction];
  }
  
  // If jurisdictionCounts is undefined or null, return 0
  if (!jurisdictionCounts) {
    return 0;
  }
  
  // Convert our jurisdiction name to match Kendra's format
  const kendraJurisdiction = jurisdiction.replace(/_/g, ' ');
  
  // For California districts, check multiple formats
  if (jurisdiction.includes('AQMD') || jurisdiction.includes('APCD')) {
    const directCount = jurisdictionCounts[jurisdiction] || 0;
    const californiaCount = jurisdictionCounts[`California/${jurisdiction}`] || 0;
    const kendraCount = jurisdictionCounts[kendraJurisdiction] || 0;
    const californiaKendraCount = jurisdictionCounts[`California (${kendraJurisdiction})`] || 0;
    const californiaPrefixCount = jurisdictionCounts[`California - ${kendraJurisdiction}`] || 0;
    
    // Also check for alternative formats in s3 paths
    const s3PathFormat = jurisdiction.replace(/_/g, '%20');
    const s3PathCount = jurisdictionCounts[s3PathFormat] || 0;
    
    // Sum all possible formats
    const totalCount = directCount + californiaCount + kendraCount + 
                       californiaKendraCount + californiaPrefixCount + s3PathCount;
    
    return totalCount;
  }
  
  // For regular jurisdictions, check multiple formats
  const directCount = jurisdictionCounts[jurisdiction] || 0;
  const kendraCount = jurisdictionCounts[kendraJurisdiction] || 0;
  const spaceCount = jurisdictionCounts[jurisdiction.replace(/_/g, ' ')] || 0;
  
  // Special case for New Mexico
  if (jurisdiction === 'New_Mexico') {
    const albuquerqueCount = jurisdictionCounts['New Mexico-Albuquerque'] || 0;
    return directCount + kendraCount + spaceCount + albuquerqueCount;
  }
  
  return directCount + kendraCount + spaceCount;
};

// Add the same color palette as in DynamicSearch
const FOLDER_COLORS = [
  '#ff7043', // deep orange
  '#42a5f5', // blue
  '#66bb6a', // green
  '#ab47bc', // purple
  '#ffa726', // orange
  '#26a69a', // teal
  '#ec407a', // pink
  '#7e57c2', // deep purple
  '#d4e157', // lime
  '#789262', // olive
  '#8d6e63', // brown
  '#29b6f6', // light blue
  '#cfd8dc', // blue gray
];

const SidebarFilters = ({ 
  onFilterChange, 
  isDisabled, 
  instanceId = 'default', 
  documentCounts = {},
  jurisdictionsInactive = false,
  documentTypesInactive = false
}) => {
  const { signOut, user } = useContext(AuthContext);
  // Get the sorted jurisdictions from SearchPageContext
  const { sortedJurisdictions: contextSortedJurisdictions } = useSearchPage();
  const [showUserMenu, setShowUserMenu] = useState(false);
  // Add state to track all filters
  const [filters, setFilters] = useState({
    jurisdictions: {},
    documentTypes: {}
  });

  // Add state to track pending changes
  const [pendingFilters, setPendingFilters] = useState({
    jurisdictions: {},
    documentTypes: {}
  });

  // Set default state to open or collapsed based on jurisdictionsInactive
  const [isJurisdictionCollapsed, setIsJurisdictionCollapsed] = useState(true);
  const [isDocumentTypeCollapsed, setIsDocumentTypeCollapsed] = useState(true);
  const [showAllJurisdictions, setShowAllJurisdictions] = useState(false);

  // Get working folder functionality from context
  const { 
    workingFolderDocs, 
    removeFromWorkingFolder, 
    folders, 
    createFolder,
    deleteFolder,
    moveToFolder,
    removeFromFolder,
    currentFolderId,
    setCurrentFolderId
  } = useWorkingFolder();
  const [isWorkingFolderOpen, setIsWorkingFolderOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [draggedDocId, setDraggedDocId] = useState(null);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [viewingFolder, setViewingFolder] = useState(null);
  
  // Add this near the top of the component function, after the state declarations
  // This will force the component to refresh when document counts change
  React.useEffect(() => {
    if (documentCounts && documentCounts.jurisdictions) {
      // Force refresh the filters to match new document counts
      console.log("Updating filter counts from new document counts:", documentCounts);
      
      // Reset pending filters when counts change
      setPendingFilters({
        jurisdictions: {},
        documentTypes: {}
      });
      
      // Refresh the UI with accurate counts
      const jurisdictionCounts = documentCounts.jurisdictions || {};
    }
  }, [documentCounts]);

  const handleFilterChange = useCallback((category, value) => {
    console.log('Filter change in SidebarFilters:', category, value);
    
    // Update pending filters instead of applying immediately
    setPendingFilters(prev => {
      // Get the current state of this filter (considering both current and pending)
      const currentState = prev[category][value] !== undefined 
        ? prev[category][value] 
        : filters[category][value] || false;
      
      // Log the current state before toggling
      console.log(`Toggling ${category} filter "${value}" from ${currentState} to ${!currentState}`);
      
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [value]: !currentState // Toggle based on the current combined state
        }
      };
    });
  }, [filters]);

  const applyFilters = useCallback(() => {
    // Merge current and pending filters
    const mergedFilters = {
      jurisdictions: {
        ...filters.jurisdictions,
        ...pendingFilters.jurisdictions
      },
      documentTypes: {
        ...filters.documentTypes,
        ...pendingFilters.documentTypes
      }
    };
    
    // Apply merged filters
    setFilters(mergedFilters);
    
    // Convert to the format expected by onFilterChange
    const activeFilters = {
      ...Object.entries(mergedFilters.jurisdictions)
        .filter(([_, isSelected]) => isSelected)
        .reduce((acc, [key]) => ({ ...acc, [key]: true }), {}),
      ...Object.entries(mergedFilters.documentTypes)
        .filter(([_, isSelected]) => isSelected)
        .reduce((acc, [key]) => ({ ...acc, [key]: true }), {})
    };
    
    // Debug log to verify which filters are being sent
    console.log(`Applying filters with ${Object.keys(activeFilters).length} active filters:`, activeFilters);
    
    // Enhanced debugging for active filters
    console.log('Active filter details:');
    Object.keys(activeFilters).forEach(key => {
      console.log(`- Key: "${key}", Value: ${activeFilters[key]}`);
      console.log(`  - Is in JURISDICTIONS: ${JURISDICTIONS.includes(key)}`);
      console.log(`  - Is in DOCUMENT_TYPES: ${DOCUMENT_TYPES.includes(key)}`);
    });
    
    // Call parent component's filter handler
    onFilterChange(activeFilters);
    
    // Clear pending filters after applying
    setPendingFilters({
      jurisdictions: {},
      documentTypes: {}
    });
  }, [filters, pendingFilters, onFilterChange]);

  const removeFilters = useCallback(() => {
    // Reset both current and pending filters
    setFilters({
      jurisdictions: {},
      documentTypes: {}
    });
    setPendingFilters({
      jurisdictions: {},
      documentTypes: {}
    });
    onFilterChange({});
  }, [onFilterChange]);

  // Extract document counts from props
  const { documentTypes: docTypeCounts = {}, jurisdictions: jurisdictionCounts = {} } = documentCounts;

  // Use the sorted jurisdictions from the search context if available, or fall back to local sorting
  const sortedJurisdictions = React.useMemo(() => {
    // If we have sorted jurisdictions from the context with counts, use those
    if (contextSortedJurisdictions && contextSortedJurisdictions.length > 0) {
      console.log('Using sorted jurisdictions from context:', contextSortedJurisdictions.length);
      return contextSortedJurisdictions;
    }

    // Otherwise, fall back to the original sorting logic
    console.log('Falling back to alphabetical jurisdiction sorting');
    // First, separate California districts from states
    const states = [];
    const californiaDistricts = [];
    
    JURISDICTIONS.forEach(jurisdiction => {
      if (jurisdiction.includes('APCD') || jurisdiction.includes('AQMD')) {
        californiaDistricts.push(jurisdiction);
      } else {
        states.push(jurisdiction);
      }
    });
    
    // Sort states alphabetically
    states.sort();
    
    // Sort California districts alphabetically
    californiaDistricts.sort();
    
    // Show the main states first, then California districts
    return [...states, ...californiaDistricts];
  }, [contextSortedJurisdictions]);

  // Inside the render function, update the visibleJurisdictions
  const visibleJurisdictions = React.useMemo(() => {
    // If showing all, return the entire sorted list
    if (showAllJurisdictions) {
      return sortedJurisdictions;
    }
    
    // If sorted by count (from context), show the top 10 by default
    if (contextSortedJurisdictions && contextSortedJurisdictions.length > 0) {
      return sortedJurisdictions.slice(0, 10);
    }
    
    // Otherwise use the original logic for alphabetical sorting
    return sortedJurisdictions.slice(0, 10); 
  }, [showAllJurisdictions, sortedJurisdictions, contextSortedJurisdictions]);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-profile')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

  // Add at the top, after other useState declarations
  const { sidebarCollapsed: isCollapsed, setSidebarCollapsed } = useSidebar();

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar-filters${isDisabled ? ' disabled' : ''}${isCollapsed ? ' collapsed' : ''}`}>
      <div className="user-profile">
        <div className="user-profile-collapse-btn">
          <button
            className="collapse-sidebar-button"
            onClick={handleToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>
        <div className="user-profile-user-btn">
          <button 
            className="user-icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <FaUser />
          </button>
        </div>
        {showUserMenu && (
          <div className="user-dropdown">
            <div className="user-dropdown-content">
              <div className="user-email">
                {user?.attributes?.given_name || user?.attributes?.family_name
                  ? `${user?.attributes?.given_name || ''} ${user?.attributes?.family_name || ''}`.trim()
                  : user?.attributes?.email || user?.username}
              </div>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <>
          <div className="sidebar-header">
            <h2 className="sidebar-title">Filters</h2>
            <div className="filter-actions">
              <button 
                className="apply-filters-button"
                onClick={applyFilters}
                disabled={!Object.values(pendingFilters.jurisdictions).some(Boolean) && 
                        !Object.values(pendingFilters.documentTypes).some(Boolean)}
              >
                Apply
              </button>
              <button 
                className="remove-filters-button"
                onClick={removeFilters}
                disabled={Object.keys(filters.jurisdictions).length === 0 && 
                        Object.keys(filters.documentTypes).length === 0}
              >
                Remove
              </button>
            </div>
          </div>
          <div className="filter-groups-container">
            <div className="filter-group">
              <div className="filter-group-title">
                <JurisdictionIcon className="filter-icon" />
                <span>Jurisdiction</span>
                <button 
                  className="collapse-button"
                  onClick={() => {
                    if (!jurisdictionsInactive) setIsJurisdictionCollapsed(!isJurisdictionCollapsed);
                  }}
                  aria-label={isJurisdictionCollapsed ? "Expand jurisdiction filters" : "Collapse jurisdiction filters"}
                  disabled={jurisdictionsInactive}
                  style={jurisdictionsInactive ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {isJurisdictionCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
              {!isJurisdictionCollapsed && !jurisdictionsInactive && (
                <>
                  {visibleJurisdictions.map((jurisdiction, index) => {
                    // Get raw count directly from the documentCounts
                    let rawCount = 0;
                    if (documentCounts && documentCounts.jurisdictions) {
                      rawCount = documentCounts.jurisdictions[jurisdiction] || 0;
                      // Get processed count which handles various naming conventions
                      rawCount = getJurisdictionCount(jurisdiction, documentCounts.jurisdictions);
                    }
                    
                    const count = rawCount;
                    // Check both current filters and pending filters
                    const isSelected = (
                      (filters.jurisdictions[jurisdiction] && pendingFilters.jurisdictions[jurisdiction] !== false) ||
                      pendingFilters.jurisdictions[jurisdiction] === true
                    );
                    return (
                      <label 
                        key={`${instanceId}-jurisdiction-${index}`} 
                        htmlFor={`${instanceId}-jurisdiction-${index}`}
                        className="filter-label"
                      >
                        <input
                          type="checkbox"
                          id={`${instanceId}-jurisdiction-${index}`}
                          checked={isSelected}
                          onChange={() => handleFilterChange('jurisdictions', jurisdiction)}
                        />
                        <span className="filter-label-text">
                          {formatJurisdictionName(jurisdiction)}
                          {count > 0 && <span className="count-inline">({count})</span>}
                        </span>
                      </label>
                    );
                  })}
                  {sortedJurisdictions.length > 10 && (
                    <button 
                      className="show-more-button"
                      onClick={() => setShowAllJurisdictions(!showAllJurisdictions)}
                    >
                      {showAllJurisdictions ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="filter-group">
              <div className="filter-group-title">
                <DocumentTypeIcon className="filter-icon" />
                <span>Document Type</span>
                <button 
                  className="collapse-button"
                  onClick={() => {
                    if (!documentTypesInactive) setIsDocumentTypeCollapsed(!isDocumentTypeCollapsed);
                  }}
                  aria-label={isDocumentTypeCollapsed ? "Expand document type filters" : "Collapse document type filters"}
                  disabled={documentTypesInactive}
                  style={documentTypesInactive ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  {isDocumentTypeCollapsed ? <FaChevronDown /> : <FaChevronUp />}
                </button>
              </div>
              {!isDocumentTypeCollapsed && !documentTypesInactive && DOCUMENT_TYPES.map((type, index) => {
                const displayType = type.trim();
                const count = docTypeCounts[type] || 0;
                // Check both current filters and pending filters
                const isSelected = (
                  (filters.documentTypes[type] && pendingFilters.documentTypes[type] !== false) ||
                  pendingFilters.documentTypes[type] === true
                );
                return (
                  <label 
                    key={`${instanceId}-doctype-${index}`} 
                    htmlFor={`${instanceId}-doctype-${index}`} 
                    className="filter-label"
                  >
                    <input
                      type="checkbox"
                      id={`${instanceId}-doctype-${index}`}
                      checked={isSelected}
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
            <div className="working-folder-section">
              {false && (
                <div className="working-folder-header">
                  <span>Working Folder ({workingFolderDocs.length})</span>
                  <div className="working-folder-actions">
                    {instanceId !== 'copilot-page' && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              )}
              <div className="working-folder-list">
                {workingFolderDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="working-folder-item"
                    draggable={true}
                    onDragStart={() => { setDraggedDocId(doc.id); console.log('Drag start', doc.id); }}
                    onDragEnd={() => { setDraggedDocId(null); console.log('Drag end'); }}
                  >
                    <span className="doc-title">{doc.title}</span>
                    <div className="doc-actions">
                      {folders.length > 0 && (
                        <select
                          className="move-to-folder-select"
                          onChange={(e) => {
                            const folderId = parseInt(e.target.value);
                            if (folderId) {
                              moveToFolder(doc.id, folderId);
                            }
                          }}
                          value=""
                        >
                          <option value="">Move to...</option>
                          {folders.map(folder => (
                            <option key={folder.id} value={folder.id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        className="remove-doc-button"
                        onClick={() => removeFromWorkingFolder(doc.id)}
                        title="Remove from working folder"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* New Folders header and create button */}
              {folders.length > 0 || instanceId !== 'copilot-page' ? (
                <div className="folders-header">
                  <span>Folders</span>
                  {instanceId !== 'copilot-page' && (
                    <button 
                      className="create-folder-button"
                      onClick={() => setIsCreateFolderModalOpen(true)}
                      title="Create new folder"
                    >
                      +
                    </button>
                  )}
                </div>
              ) : null}
              {/* Folders list */}
              {folders.length > 0 && (
                <div className="folders-list">
                  {folders.map((folder, idx) => {
                    const isExpanded = expandedFolders[folder.id] !== false;
                    return (
                      <div key={folder.id} className="folder-item">
                        <div
                          className={`folder-header${dragOverFolderId === folder.id ? ' drag-over' : ''}`}
                          onClick={() => setExpandedFolders(prev => ({ ...prev, [folder.id]: !isExpanded }))}
                          style={{ cursor: 'pointer' }}
                          onDragOver={e => {
                            e.preventDefault();
                            setDragOverFolderId(folder.id);
                          }}
                          onDragLeave={() => setDragOverFolderId(null)}
                          onDrop={e => {
                            e.preventDefault();
                            let docId = e.dataTransfer.getData('application/x-doc-id');
                            if (!docId && draggedDocId) docId = draggedDocId;
                            if (docId) {
                              moveToFolder(docId, folder.id);
                            }
                            setDragOverFolderId(null);
                          }}
                        >
                          <button
                            className="toggle-folder-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedFolders(prev => ({ ...prev, [folder.id]: !isExpanded }));
                            }}
                            aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
                            style={{ marginRight: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#457b9d', fontSize: 14 }}
                          >
                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                          </button>
                          {/* Colored folder icon with white drop shadow for contrast */}
                          <FaFolder className="folder-icon" style={{ color: FOLDER_COLORS[idx % FOLDER_COLORS.length], marginRight: 8, filter: 'drop-shadow(0 0 2px #fff)' }} />
                          <span className="folder-name">
                            {folder.name}
                            <span className="folder-count" style={{ color: '#274C77', fontSize: '13px', fontWeight: 700, marginLeft: 4 }}>
                              ({folder.documents.length})
                            </span>
                          </span>
                          <span className="folder-actions">
                            <button
                              className="view-folder-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingFolder(folder);
                              }}
                              title="View folder contents"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="delete-folder-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFolder(folder.id);
                              }}
                              title="Delete folder"
                            >
                              <FaTrash />
                            </button>
                          </span>
                        </div>
                        {isExpanded && folder.documents.length > 0 && (
                          <div className="folder-documents">
                            {folder.documents.map(doc => (
                              <div key={doc.id} className="folder-doc-item">
                                <span className="doc-title">{doc.title}</span>
                                <button
                                  className="remove-doc-button"
                                  onClick={() => removeFromFolder(doc.id, folder.id)}
                                  title="Remove from folder"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {instanceId !== 'copilot-page' && (
            <>
              <WorkingFolderView 
                isOpen={isWorkingFolderOpen}
                onClose={() => setIsWorkingFolderOpen(false)}
                documents={workingFolderDocs}
              />
              <CreateFolderModal
                isOpen={isCreateFolderModalOpen}
                onClose={() => setIsCreateFolderModalOpen(false)}
                onCreateFolder={createFolder}
              />
            </>
          )}
          {/* Folder view modal */}
          {viewingFolder && (
            <WorkingFolderView
              isOpen={!!viewingFolder}
              onClose={() => setViewingFolder(null)}
              documents={viewingFolder.documents}
              title={viewingFolder.name}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SidebarFilters;