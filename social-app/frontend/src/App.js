import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Stories from './components/Stories';
import Search from './components/Search';
import Upload from './components/Upload';
import Notifications from './components/Notifications';
import BottomNav from './components/BottomNav';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Check if user is logged in (in localStorage)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home currentUser={currentUser} />;
      case 'profile':
        return <Profile currentUser={currentUser} onLogout={handleLogout} />;
      case 'messages':
        return <Messages currentUser={currentUser} />;
      case 'stories':
        return <Stories currentUser={currentUser} />;
      case 'search':
        return <Search currentUser={currentUser} />;
      default:
        return <Home currentUser={currentUser} />;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 4H12V24H22V28H8V4Z" fill="url(#gradient)" />
              <defs>
                <linearGradient id="gradient" x1="8" y1="4" x2="22" y2="28">
                  <stop offset="0%" stopColor="#7F3FBF" />
                  <stop offset="100%" stopColor="#9B59B6" />
                </linearGradient>
              </defs>
            </svg>
            <span>Luna</span>
          </div>
          <button className="notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <i className="fas fa-bell"></i>
          </button>
        </div>
      </header>

      <main className="app-main">
        {renderPage()}
      </main>

      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} onUpload={() => setShowUploadModal(true)} />

      {showUploadModal && (
        <Upload
          currentUser={currentUser}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {showNotifications && (
        <Notifications
          currentUser={currentUser}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}

export default App;
