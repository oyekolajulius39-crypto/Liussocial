import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Post.css';

const API_BASE = 'http://localhost:5000/api';

function Post({ post, currentUser, onUpdate }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const renderStars = (level) => {
    return Array(level).fill('★').join('');
  };

  const getLevelProgress = (followers, level) => {
    const thresholds = [0, 10, 20, 30, 60];
    if (level >= 5) return 'Max Level';
    const current = followers.length || 0;
    const next = thresholds[level];
    return `${current}/${next} followers to Level ${level + 1}`;
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_BASE}/posts/${post.id}/like`, {
        userId: currentUser.id
      });
      onUpdate(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`${API_BASE}/posts/${post.id}/comment`, {
        userId: currentUser.id,
        content: commentText
      });
      onUpdate(response.data);
      setCommentText('');
      setShowComments(true);
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleShare = async () => {
    try {
      const response = await axios.post(`${API_BASE}/posts/${post.id}/share`);
      onUpdate(response.data);
      alert('Post shared!');
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const isLiked = post.likes && post.likes.includes(currentUser.id);

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={`http://localhost:5000${post.user?.profilePicture || '/uploads/default-avatar.png'}`}
          alt={post.user?.username}
          className="post-avatar"
        />
        <div className="post-user-info">
          <div className="post-username">
            <span>{post.user?.username || 'Anonymous'}</span>
            {post.user?.level > 0 && (
              <span className="level-stars">{renderStars(post.user.level)}</span>
            )}
            {post.user?.verified && (
              <i className="fas fa-check-circle verified-badge"></i>
            )}
          </div>
          {post.user?.level > 0 && post.user?.level < 5 && (
            <div className="level-progress">
              {getLevelProgress(post.user.followers || [], post.user.level)}
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        {post.content}
      </div>

      {post.mediaUrl && (
        <>
          {post.mediaType === 'image' ? (
            <img
              src={`http://localhost:5000${post.mediaUrl}`}
              alt="Post media"
              className="post-media"
            />
          ) : (
            <video
              src={`http://localhost:5000${post.mediaUrl}`}
              controls
              className="post-media"
            />
          )}
        </>
      )}

      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <i className={isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <i className="far fa-comment"></i>
          <span>{post.comments?.length || 0}</span>
        </button>

        <button className="action-btn" onClick={handleShare}>
          <i className="far fa-share-square"></i>
          <span>{post.shares || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <strong>{comment.userId}</strong>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet</p>
            )}
          </div>

          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Post;
