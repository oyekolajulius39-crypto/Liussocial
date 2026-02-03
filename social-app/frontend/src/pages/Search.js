import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Search({ user }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await axios.get(`/api/users/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await axios.post(`/api/users/${userId}/unfollow`);
      } else {
        await axios.post(`/api/users/${userId}/follow`);
      }
      
      // Refresh search results
      handleSearch({ preventDefault: () => {} });
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const renderStars = (level) => {
    return Array.from({ length: level }, (_, i) => (
      <i key={i} className="fas fa-star star"></i>
    ));
  };

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-search"></i> Discover</h1>
      </div>

      <div className="container">
        <form onSubmit={handleSearch} className="search-bar">
          <div style={{display: 'flex', gap: '10px'}}>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        {loading ? (
          <div style={{textAlign: 'center', padding: '50px'}}>
            <div className="spinner"></div>
          </div>
        ) : searched ? (
          searchResults.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px'}}>
              <i className="fas fa-user-slash" style={{fontSize: '50px', color: 'var(--primary)', marginBottom: '20px'}}></i>
              <h3>No users found</h3>
              <p>Try a different search term</p>
            </div>
          ) : (
            searchResults.map(result => (
              <div key={result.id} className="user-card fade-in">
                <div onClick={() => navigate(`/profile/${result.id}`)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                  {result.profilePic ? (
                    <img src={result.profilePic} alt={result.username} className="avatar" />
                  ) : (
                    <div className="avatar avatar-placeholder">
                      {result.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="user-card-info">
                    <div className="user-card-name">
                      {result.username}
                      <span className="user-level">
                        {renderStars(result.level)}
                      </span>
                      {result.verified && (
                        <i className="fas fa-check-circle verified-badge"></i>
                      )}
                    </div>
                    <div className="user-card-stats">
                      {result.followers.length} followers • Level {result.level}
                    </div>
                    {result.bio && (
                      <div style={{fontSize: '14px', color: '#666', marginTop: '5px'}}>
                        {result.bio.substring(0, 60)}{result.bio.length > 60 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
                
                {result.id !== user.id && (
                  <button
                    className={`btn ${user.following.includes(result.id) ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleFollow(result.id, user.following.includes(result.id))}
                  >
                    {user.following.includes(result.id) ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>
            ))
          )
        ) : (
          <div className="card" style={{textAlign: 'center', padding: '40px'}}>
            <i className="fas fa-compass" style={{fontSize: '50px', color: 'var(--primary)', marginBottom: '20px'}}></i>
            <h3>Discover People</h3>
            <p>Search for users to follow and connect with</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
