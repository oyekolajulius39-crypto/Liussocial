import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Search.css';

const API_BASE = 'https://liussocial.onrender.com/api';

function Search({ currentUser }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await axios.get(`${API_BASE}/users/search/${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const isFollowing = currentUser.following?.includes(userId);
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      
      await axios.post(`${API_BASE}/users/${userId}/${endpoint}`, {
        followerId: currentUser.id
      });

      // Update local state
      const updatedResults = results.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            followers: isFollowing
              ? user.followers.filter(id => id !== currentUser.id)
              : [...(user.followers || []), currentUser.id]
          };
        }
        return user;
      });
      setResults(updatedResults);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const renderStars = (level) => Array(level).fill('★').join('');

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {searching && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      <div className="search-results">
        {results.map(user => (
          <div key={user.id} className="user-card">
            <img
              src={`http://localhost:5000${user.profilePicture}`}
              alt={user.username}
              className="user-avatar"
            />
            <div className="user-info">
              <div className="user-name">
                <span>{user.username}</span>
                {user.level > 0 && (
                  <span className="level-stars">{renderStars(user.level)}</span>
                )}
                {user.verified && (
                  <i className="fas fa-check-circle verified-badge"></i>
                )}
              </div>
              <div className="user-stats">
                {user.followers?.length || 0} followers
              </div>
            </div>
            {user.id !== currentUser.id && (
              <button
                className={`btn ${currentUser.following?.includes(user.id) ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => handleFollow(user.id)}
              >
                {currentUser.following?.includes(user.id) ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
