import React, { createContext, useContext, useState } from 'react';

const TargetFolderContext = createContext();

export const useTargetFolder = () => useContext(TargetFolderContext);

export const TargetFolderProvider = ({ children }) => {
  const [targetFolderId, setTargetFolderId] = useState(null);

  const promptSelectFolder = () => {
    // This function can be used to trigger a modal or UI prompt to select a folder
    // For now, we'll just log a message
    console.log('No target folder selected. Please select a folder.');
    // In a real implementation, you might open a modal here
  };

  return (
    <TargetFolderContext.Provider value={{ targetFolderId, setTargetFolderId, promptSelectFolder }}>
      {children}
    </TargetFolderContext.Provider>
  );
}; 