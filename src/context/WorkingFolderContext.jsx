import React, { createContext, useContext, useState } from 'react';

const WorkingFolderContext = createContext();

export function WorkingFolderProvider({ children }) {
  const [workingFolderDocs, setWorkingFolderDocs] = useState([]);

  const addToWorkingFolder = (document) => {
    setWorkingFolderDocs(prev => {
      // Check if document already exists
      if (!prev.some(doc => doc.id === document.id)) {
        return [...prev, document];
      }
      return prev;
    });
  };

  const removeFromWorkingFolder = (documentId) => {
    setWorkingFolderDocs(prev => prev.filter(doc => doc.id !== documentId));
  };

  return (
    <WorkingFolderContext.Provider 
      value={{ 
        workingFolderDocs, 
        addToWorkingFolder, 
        removeFromWorkingFolder 
      }}
    >
      {children}
    </WorkingFolderContext.Provider>
  );
}

export function useWorkingFolder() {
  const context = useContext(WorkingFolderContext);
  if (!context) {
    throw new Error('useWorkingFolder must be used within a WorkingFolderProvider');
  }
  return context;
} 