import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload({ user }) {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('post'); // 'post' or 'story'
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file size (100MB per file)
    const maxSize = 100 * 1024 * 1024; // 100MB
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name} is too large. Maximum file size is 100MB.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);

    // Create previews
    const newPreviews = [];
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push({
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: e.target.result
        });
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploadType === 'story' && files.length === 0) {
      alert('Please select a media file for your story');
      return;
    }

    if (uploadType === 'post' && files.length === 0 && !caption.trim()) {
      alert('Please add content or media to your post');
      return;
    }

    setLoading(true);

    try {
      if (uploadType === 'story') {
        // Upload story (only one file)
        const formData = new FormData();
        formData.append('media', files[0]);
        formData.append('anonymous', anonymous);

        await axios.post('/api/stories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Story uploaded successfully!');
        navigate('/stories');
      } else {
        // Upload post
        const formData = new FormData();
        formData.append('content', caption);
        formData.append('anonymous', anonymous);
        files.forEach(file => {
          formData.append('media', file);
        });

        await axios.post('/api/posts', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Post created successfully!');
        navigate('/');
      }

      // Reset form
      setFiles([]);
      setPreviews([]);
      setCaption('');
      setAnonymous(false);
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-plus-circle"></i> Create</h1>
      </div>

      <div className="container">
        <div className="upload-container">
          <div style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
            <button
              className={`btn ${uploadType === 'post' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUploadType('post')}
            >
              <i className="fas fa-image"></i> Post
            </button>
            <button
              className={`btn ${uploadType === 'story' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUploadType('story')}
            >
              <i className="fas fa-circle-notch"></i> Story
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div 
              className="file-upload-area"
              onClick={() => document.getElementById('file-input').click()}
            >
              <div className="file-upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3>Click to upload media</h3>
              <p>Images or videos up to 100MB</p>
              {uploadType === 'story' && (
                <p style={{color: 'var(--primary)', fontWeight: 600}}>
                  Stories disappear after 24 hours
                </p>
              )}
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*,video/*"
              multiple={uploadType === 'post'}
              onChange={handleFileChange}
              style={{display: 'none'}}
            />

            {previews.length > 0 && (
              <div className="preview-container">
                <h4>Preview:</h4>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px'}}>
                  {previews.map((preview, index) => (
                    <div key={index} style={{position: 'relative'}}>
                      {preview.type === 'image' ? (
                        <img src={preview.url} alt="Preview" className="preview-media" />
                      ) : (
                        <video src={preview.url} className="preview-media" controls />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadType === 'post' && (
              <div className="form-group">
                <label>Caption</label>
                <textarea
                  className="form-control"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows="4"
                />
              </div>
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>Post anonymously</span>
            </label>

            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{flex: 1}}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> {uploadType === 'post' ? 'Post' : 'Share Story'}
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Upload;
