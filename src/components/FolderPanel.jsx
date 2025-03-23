import React from 'react';
import './FolderPanel.css';
import folderIcon from '../assets/folder.png'; // 👈 your custom icon

const FolderPanel = () => {
  return (
    <div className="folder-panel">
      <h3 className="folder-title">Folder</h3>
      <div className="active-folder-header">
        <img src={folderIcon} alt="Folder" className="folder-icon" />
        <span className="folder-name">Download folder</span>
      </div>
      <div className="folder-contents">
        <p className="doc-count">3 of 3 documents</p>
        <ul className="doc-list">
          <li>
            <a href="#">Colorado - Regulation Number 20 - Low Emission Vehicle</a>
            <p className="doc-snippet">baseline emission standards for light-duty vehicles in Colorado...</p>
          </li>
          {/* Add more docs dynamically */}
        </ul>
      </div>
    </div>
  );
};

export default FolderPanel;
