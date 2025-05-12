import React, { useState } from 'react';
import { useTargetFolder } from '../context/TargetFolderContext';
import { useWorkingFolder } from '../context/WorkingFolderContext';
import './TargetFolderIndicator.css';

const TargetFolderIndicator = () => {
  const { targetFolderId, setTargetFolderId } = useTargetFolder();
  const { folders } = useWorkingFolder();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentFolder = folders.find(folder => folder.id === targetFolderId);
  const folderName = currentFolder ? currentFolder.name : 'No folder selected';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelectFolder = (folderId) => {
    setTargetFolderId(folderId);
    closeModal();
  };

  return (
    <>
      <div className="target-folder-indicator" onClick={openModal}>
        {folderName}
      </div>
      {isModalOpen && (
        <div className="folder-picker-modal">
          <div className="modal-content">
            <h2>Select Target Folder</h2>
            <ul>
              {folders.map(folder => (
                <li key={folder.id} onClick={() => handleSelectFolder(folder.id)}>
                  {folder.name}
                </li>
              ))}
            </ul>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TargetFolderIndicator; 