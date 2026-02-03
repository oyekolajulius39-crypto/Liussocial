import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notifications.css';

const API_BASE = 'https://liussocial.onrender.com/api';

function Notifications({ currentUser, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_BASE}/notifications/${currentUser.id}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'liked your post';
      case 'comment':
        return `commented: "${notification.comment}"`;
      case 'follow':
        return 'started following you';
      case 'message':
        return 'sent you a message';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notifications-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Notifications</h2>
          <button className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <img
                    src={`http://localhost:5000${notification.user.profilePicture}`}
                    alt={notification.user.username}
                    className="notif-avatar"
                  />
                  <div className="notif-content">
                    <p>
                      <strong>{notification.user.username}</strong>{' '}
                      {getNotificationText(notification)}
                    </p>
                    <span className="notif-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
