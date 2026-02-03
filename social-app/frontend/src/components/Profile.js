import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const API_BASE = 'http://localhost:5000/api';

function Profile({ currentUser, onLogout }) {
  const [user, setUser] = useState(currentUser);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: currentUser.username,
    bio: currentUser.bio || ''
  });

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/users/${currentUser.id}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/posts/user/${currentUser.id}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(editData));
      
      await axios.put(`${API_BASE}/users/${currentUser.id}`, formData);
      setEditing(false);
      fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderStars = (level) => Array(level).fill('★').join('');

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={`http://localhost:5000${user.profilePicture}`}
          alt={user.username}
          className="profile-avatar"
        />
        <div className="profile-info">
          <div className="profile-username">
            <h2>{user.username}</h2>
            {user.level > 0 && (
              <span className="level-stars">{renderStars(user.level)}</span>
            )}
            {user.verified && (
              <i className="fas fa-check-circle verified-badge"></i>
            )}
          </div>
          <p className="profile-bio">{user.bio || 'No bio yet'}</p>
          <div className="profile-stats">
            <div className="stat">
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div className="stat">
              <strong>{user.followers?.length || 0}</strong>
              <span>Followers</span>
            </div>
            <div className="stat">
              <strong>{user.following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
        <button className="btn btn-secondary" onClick={onLogout}>
          Logout
        </button>
      </div>

      {editing && (
        <div className="edit-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={editData.username}
              onChange={(e) => setEditData({...editData, username: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Bio</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({...editData, bio: e.target.value})}
              rows="3"
            />
          </div>
          <button className="btn btn-primary" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </div>
      )}

      <div className="profile-posts">
        <h3>Your Posts</h3>
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="grid-post">
              {post.mediaUrl ? (
                <img src={`http://localhost:5000${post.mediaUrl}`} alt="Post" />
              ) : (
                <div className="text-post">{post.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
