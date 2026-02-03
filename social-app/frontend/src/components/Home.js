import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import '../styles/Home.css';

const API_BASE = 'http://localhost:5000/api';

function Home({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Your Feed</h2>
        <p className="subtitle">Latest posts from the community</p>
      </div>

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-images"></i>
            <p>No posts yet</p>
            <p className="empty-subtitle">Be the first to share something!</p>
          </div>
        ) : (
          posts.map(post => (
            <Post
              key={post.id}
              post={post}
              currentUser={currentUser}
              onUpdate={handlePostUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
