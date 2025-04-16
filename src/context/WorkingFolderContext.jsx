import React, { createContext, useContext, useState } from 'react';

const WorkingFolderContext = createContext();

export function WorkingFolderProvider({ children }) {
  const [workingFolderDocs, setWorkingFolderDocs] = useState([]);

  const addToWorkingFolder = (document) => {
    console.log('Adding document to working folder:', document);
    
    setWorkingFolderDocs(prev => {
      // Check if document already exists
      const exists = prev.some(doc => doc.id === document.id);
      if (exists) {
        console.log('Document already exists in working folder');
        return prev;
      }
      
      // Add new document
      return [...prev, document];
    });
  };

  const removeFromWorkingFolder = (documentId) => {
    console.log('Removing document from working folder:', documentId);
    
    setWorkingFolderDocs(prev => 
      prev.filter(doc => doc.id !== documentId)
    );
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