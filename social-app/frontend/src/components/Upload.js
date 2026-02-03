import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Upload.css';

const API_BASE = 'http://localhost:5000/api';

function Upload({ currentUser, onClose }) {
  const [uploadType, setUploadType] = useState('post'); // 'post' or 'story'
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }
      setMediaFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadType === 'story' && !mediaFile) {
      alert('Stories require media (image or video)');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', currentUser.id);
      
      if (uploadType === 'post') {
        formData.append('content', content);
        formData.append('anonymous', anonymous);
        if (mediaFile) {
          formData.append('media', mediaFile);
        }
        await axios.post(`${API_BASE}/posts`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Post created successfully!');
      } else {
        formData.append('anonymous', anonymous);
        formData.append('media', mediaFile);
        await axios.post(`${API_BASE}/stories`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Story created successfully!');
      }
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error creating content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="upload-type-selector">
          <button
            className={`type-btn ${uploadType === 'post' ? 'active' : ''}`}
            onClick={() => setUploadType('post')}
          >
            <i className="fas fa-image"></i>
            Post
          </button>
          <button
            className={`type-btn ${uploadType === 'story' ? 'active' : ''}`}
            onClick={() => setUploadType('story')}
          >
            <i className="fas fa-circle"></i>
            Story
          </button>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          {uploadType === 'post' && (
            <div className="input-group">
              <label>Caption</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows="4"
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Media (Image or Video)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="file-info">Max size: 100MB</div>
          </div>

          {mediaPreview && (
            <div className="media-preview">
              {mediaFile?.type.startsWith('image') ? (
                <img src={mediaPreview} alt="Preview" />
              ) : (
                <video src={mediaPreview} controls />
              )}
            </div>
          )}

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>Post anonymously</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Uploading...' : `Create ${uploadType === 'post' ? 'Post' : 'Story'}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
