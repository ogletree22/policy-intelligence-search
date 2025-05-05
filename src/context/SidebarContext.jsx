import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => {
    const stored = localStorage.getItem('sidebarCollapsed');
    return stored === 'true';
  });
  const [shouldAnimateSidebar, setShouldAnimateSidebar] = useState(false);

  // Sync with localStorage and CSS variable
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
    document.body.style.setProperty('--sidebar-width', sidebarCollapsed ? '60px' : '275px');
  }, [sidebarCollapsed]);

  // Add/remove sidebar-animated class
  useEffect(() => {
    if (shouldAnimateSidebar) {
      document.body.classList.add('sidebar-animated');
    } else {
      document.body.classList.remove('sidebar-animated');
    }
  }, [shouldAnimateSidebar]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const onStorage = () => {
      const stored = localStorage.getItem('sidebarCollapsed');
      setSidebarCollapsedState(stored === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Setter that updates both state and localStorage, and enables animation
  const setSidebarCollapsed = (collapsed) => {
    setSidebarCollapsedState(collapsed);
    setShouldAnimateSidebar(true);
    localStorage.setItem('sidebarCollapsed', String(collapsed));
    document.body.style.setProperty('--sidebar-width', collapsed ? '60px' : '275px');
  };

  // Call this on page navigation to disable animation
  const resetSidebarAnimation = () => setShouldAnimateSidebar(false);

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, setSidebarCollapsed, shouldAnimateSidebar, setShouldAnimateSidebar, resetSidebarAnimation }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
} 