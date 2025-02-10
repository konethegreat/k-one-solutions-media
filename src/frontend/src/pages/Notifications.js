import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import socket from '../utils/socket';
import { useAuth } from  '../utils/AuthContext';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Join the user's room
    if (user) {
      socket.emit('join', user._id);
    }

    // Listen for new notifications
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    // Clean up the socket connection
    return () => {
      socket.off('notification');
    };
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id}>
              <div>
                <img
                  src={`http://localhost:5000/${notification.sender.profilePicture}`}
                  alt={notification.sender.username}
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
                <span>{notification.sender.username}</span>
                {notification.type === 'follow' && ' started following you'}
                {notification.type === 'like' && ' liked your post'}
                {notification.type === 'comment' && ' commented on your post'}
              </div>
              {!notification.read && (
                <button onClick={() => handleMarkAsRead(notification._id)}>
                  Mark as read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
Notifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['like', 'comment', 'follow']).isRequired,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        profilePicture: PropTypes.string
      }).isRequired,
      read: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      postId: PropTypes.string,
      commentId: PropTypes.string
    })
  ).isRequired,
  onMarkAsRead: PropTypes.func.isRequired
};


export default Notifications;