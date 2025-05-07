import React, { createContext, useContext, useState, useEffect } from 'react';

const EXPANDED_FOLDERS_KEY = 'pi_expanded_folders';

const getInitialExpandedFolders = () => {
  try {
    const stored = localStorage.getItem(EXPANDED_FOLDERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const FolderExpansionContext = createContext();

export const FolderExpansionProvider = ({ children }) => {
  const [expandedFolders, setExpandedFolders] = useState(getInitialExpandedFolders);

  useEffect(() => {
    localStorage.setItem(EXPANDED_FOLDERS_KEY, JSON.stringify(expandedFolders));
  }, [expandedFolders]);

  return (
    <FolderExpansionContext.Provider value={{ expandedFolders, setExpandedFolders }}>
      {children}
    </FolderExpansionContext.Provider>
  );
};

export const useFolderExpansion = () => {
  const ctx = useContext(FolderExpansionContext);
  if (!ctx) throw new Error('useFolderExpansion must be used within a FolderExpansionProvider');
  return ctx;
}; 