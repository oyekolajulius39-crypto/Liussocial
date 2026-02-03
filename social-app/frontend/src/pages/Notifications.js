import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Notifications({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'follow') {
      navigate(`/profile/${notification.fromUser.id}`);
    } else if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'share') {
      navigate('/'); // Navigate to home where the post would be
    } else if (notification.type === 'message') {
      navigate(`/messages/${notification.fromUser.id}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return 'fa-heart';
      case 'comment':
        return 'fa-comment';
      case 'share':
        return 'fa-share';
      case 'follow':
        return 'fa-user-plus';
      case 'message':
        return 'fa-envelope';
      default:
        return 'fa-bell';
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="container" style={{textAlign: 'center', padding: '50px'}}>
        <div className="spinner"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div>
      <div className="page-header">
        <h1><i className="fas fa-bell"></i> Notifications</h1>
      </div>

      <div className="container">
        {unreadCount > 0 && (
          <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span style={{color: 'var(--primary)', fontWeight: 600}}>
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </span>
            <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
              <i className="fas fa-check-double"></i> Mark all as read
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="card" style={{textAlign: 'center', padding: '40px'}}>
            <i className="fas fa-bell-slash" style={{fontSize: '50px', color: 'var(--primary)', marginBottom: '20px'}}></i>
            <h3>No notifications yet</h3>
            <p>When someone interacts with your content, you'll see it here</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notification)}
              style={{cursor: 'pointer'}}
            >
              <div className="notification-icon">
                <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
              </div>

              {notification.fromUser && notification.fromUser.profilePic ? (
                <img 
                  src={notification.fromUser.profilePic} 
                  alt={notification.fromUser.username} 
                  className="avatar avatar-sm" 
                />
              ) : notification.fromUser ? (
                <div className="avatar avatar-sm avatar-placeholder">
                  {notification.fromUser.username[0].toUpperCase()}
                </div>
              ) : null}

              <div className="notification-content">
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{getTimeAgo(notification.createdAt)}</div>
              </div>

              {!notification.read && (
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }}></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
