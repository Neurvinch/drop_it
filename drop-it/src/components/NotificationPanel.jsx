// src/components/Notifications.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token'); // From login
    const fetchNotifications = async () => {
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    };
    fetchNotifications();

    socket.emit('join', 'user_id_here'); // Replace with actual user ID from token
    socket.on('notificationUpdate', (updatedNotification) => {
      setNotifications(prev => 
        prev.map(n => n._id === updatedNotification._id ? updatedNotification : n)
      );
    });

    return () => socket.off('notificationUpdate');
  }, []);

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem('token');
    await axios.put('http://localhost:5000/api/notifications/read', 
      { notification_id: notificationId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification._id}>
          <p>{notification.message} - {notification.is_read ? 'Read' : 'Unread'}</p>
          {!notification.is_read && (
            <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;