import React from 'react';
import './TopNav.css';
import logo from '../assets/logo.png';
import searchIcon from '../assets/search-icon.png';
import folderIcon from '../assets/folder.png';
import coPilotIcon from '../assets/ai-technology.png'; // Assuming that’s AI Technology icon

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="topnav-left">
        <img src={logo} alt="Policy Intelligence Logo" className="topnav-logo" />
      </div>
      <div className="topnav-right">
        <nav className="topnav-links">
          <a href="#" className="active">
            <img src={searchIcon} alt="Search" className="nav-icon" />
            Search
          </a>
          <span className="nav-divider" />
          <a href="#">
            <img src={folderIcon} alt="Folders" className="nav-icon" />
            Folders
          </a>
          <span className="nav-divider" />
          <a href="#">
            <img src={coPilotIcon} alt="PI Co-Pilot" className="nav-icon" />
            PI Co-Pilot
          </a>
        </nav>
      </div>
    </header>
  );
};

export default TopNav;
