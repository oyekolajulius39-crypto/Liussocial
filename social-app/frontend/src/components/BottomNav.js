import React from 'react';

function BottomNav({ currentPage, onNavigate, onUpload }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <i className="fas fa-home"></i>
      </button>

      <button
        className={`nav-btn ${currentPage === 'messages' ? 'active' : ''}`}
        onClick={() => onNavigate('messages')}
      >
        <i className="fas fa-envelope"></i>
      </button>

      <button className="upload-btn" onClick={onUpload}>
        <i className="fas fa-plus"></i>
      </button>

      <button
        className={`nav-btn ${currentPage === 'stories' ? 'active' : ''}`}
        onClick={() => onNavigate('stories')}
      >
        <i className="fas fa-circle"></i>
      </button>

      <button
        className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`}
        onClick={() => onNavigate('search')}
      >
        <i className="fas fa-search"></i>
      </button>
    </nav>
  );
}

export default BottomNav;
