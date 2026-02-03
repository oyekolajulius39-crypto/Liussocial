import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Stories.css';

const API_BASE = 'https://liussocial.onrender.com/api';

function Stories({ currentUser }) {
  const [storyGroups, setStoryGroups] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stories`);
      setStoryGroups(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleStoryClick = async (group, index = 0) => {
    setSelectedStory(group);
    setCurrentIndex(index);
    
    // Mark as viewed
    try {
      await axios.post(`${API_BASE}/stories/${group.stories[index].id}/view`, {
        userId: currentUser.id
      });
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  };

  const handleNext = () => {
    if (!selectedStory) return;
    
    if (currentIndex < selectedStory.stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSelectedStory(null);
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="stories-container">
      <h2>Stories</h2>
      <div className="stories-carousel">
        {storyGroups.map((group, idx) => (
          <div
            key={idx}
            className="story-thumbnail"
            onClick={() => handleStoryClick(group)}
          >
            <img
              src={`http://localhost:5000${group.user.profilePicture}`}
              alt={group.user.username}
              className="story-avatar"
            />
            <span className="story-username">{group.user.username}</span>
          </div>
        ))}
      </div>

      {selectedStory && (
        <div className="story-viewer" onClick={() => setSelectedStory(null)}>
          <div className="story-content" onClick={(e) => e.stopPropagation()}>
            <div className="story-header">
              <img
                src={`http://localhost:5000${selectedStory.user.profilePicture}`}
                alt={selectedStory.user.username}
                className="viewer-avatar"
              />
              <span>{selectedStory.user.username}</span>
              <button className="close-story" onClick={() => setSelectedStory(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="story-media">
              {selectedStory.stories[currentIndex].mediaType === 'image' ? (
                <img
                  src={`http://localhost:5000${selectedStory.stories[currentIndex].mediaUrl}`}
                  alt="Story"
                />
              ) : (
                <video
                  src={`http://localhost:5000${selectedStory.stories[currentIndex].mediaUrl}`}
                  controls
                  autoPlay
                />
              )}
            </div>

            <div className="story-nav">
              {currentIndex > 0 && (
                <button className="nav-btn prev" onClick={handlePrevious}>
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              {currentIndex < selectedStory.stories.length - 1 && (
                <button className="nav-btn next" onClick={handleNext}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>

            <div className="story-progress">
              {selectedStory.stories.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-bar ${idx <= currentIndex ? 'active' : ''}`}
                />
              ))}
            </div>

            <div className="story-info">
              <span>{selectedStory.stories[currentIndex].views.length} views</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stories;
