import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FolderPanel.css';
import FolderResultCard from './FolderResultCard';
import folderIcon from '../assets/folder.png'; // 👈 your custom icon

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    title: "Colorado - Regulation No. 1: Emissions Standards",
    description: "Establishes baseline emissions standards for industrial operations in Colorado.",
    jurisdiction: "Colorado",
    type: "Regulation"
  },
  {
    id: 2,
    title: "Texas - Air Quality Standard Permit for Oil and Gas",
    description: "Standard permit for emissions from oil and gas sites.",
    jurisdiction: "Texas",
    type: "Permit"
  },
  {
    id: 3,
    title: "Colorado - Guidance on Methane Rule Implementation",
    description: "Explains how to comply with new methane standards.",
    jurisdiction: "Colorado",
    type: "Guidance"
  }
];

/**
 * FolderPanel Component
 * 
 * Displays a folder interface containing a list of documents that can be managed.
 * Documents can be removed from the folder, and the component shows a count of
 * current documents and an empty state when there are no documents.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.title="Folder"] - The title of the folder
 * @param {string} [props.subtitle="Download folder"] - The subtitle shown below the folder title
 * @param {Function} [props.onDocumentRemove] - Callback function when a document is removed
 */
const FolderPanel = ({ 
  title = "", 
  subtitle = "Download folder",
  onDocumentRemove 
}) => {
  const [folderDocuments, setFolderDocuments] = useState(INITIAL_DOCUMENTS);

  const handleRemoveDocument = (documentId) => {
    setFolderDocuments(docs => {
      const updatedDocs = docs.filter(doc => doc.id !== documentId);
      onDocumentRemove?.(documentId, updatedDocs);
      return updatedDocs;
    });
  };

  const renderHeader = () => (
    <div className="folder-header">
      <div className="folder-title-section">
        <h3 className="folder-title">{title}</h3>
        <div className="folder-subtitle">
          <img src={folderIcon} alt="Folder icon" className="folder-panel-icon" />
          <span className="folder-name">{subtitle}</span>
        </div>
      </div>
    </div>
  );

  const renderDocumentsList = () => (
    <div className="folder-results-list">
      {folderDocuments.map(doc => (
        <FolderResultCard
          key={doc.id}
          document={doc}
          onRemove={handleRemoveDocument}
        />
      ))}
      {folderDocuments.length === 0 && (
        <p className="empty-folder-message">No documents in folder</p>
      )}
    </div>
  );

  return (
    <div className="folder-panel">
      {renderHeader()}
      <div className="folder-contents">
        <p className="doc-count">
          {folderDocuments.length} of {folderDocuments.length} documents
        </p>
        {renderDocumentsList()}
      </div>
    </div>
  );
};

FolderPanel.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onDocumentRemove: PropTypes.func
};

export default FolderPanel;
