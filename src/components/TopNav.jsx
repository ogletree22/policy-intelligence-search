import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './TopNav.css';
import logo from '../assets/logo.png';
import searchIcon from '../assets/Search-Icon.png';
import folderIcon from '../assets/Folders.png';
import coPilotIcon from '../assets/AI-technology.png'; // Assuming that's AI Technology icon
import piLogo from '../assets/PI_Logo_2024.png';

const TopNav = () => {
  const location = useLocation();
  const { user, signOut } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link to="/">
          <img src={logo} alt="Policy Intelligence Logo" className="topnav-logo" />
        </Link>
      </div>
      <div className="topnav-right">
        <nav className="topnav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <img src={searchIcon} alt="Search" className="nav-icon" />
            Search
          </Link>
          <span className="nav-divider" />
          <Link to="/folders" className={location.pathname === '/folders' ? 'active' : ''}>
            <img src={folderIcon} alt="Folders" className="nav-icon" />
            Folders
          </Link>
          <span className="nav-divider" />
          <Link to="/copilot" className={location.pathname === '/copilot' ? 'active' : ''}>
            <img src={coPilotIcon} alt="PI Co-Pilot" className="nav-icon" />
            PI Co-Pilot
          </Link>
        </nav>
        {user && (
          <div className="user-info">
            <span className="user-email">{user.username}</span>
            <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
