// src/components/NotificationPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    };
    fetchNotifications();

    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => socket.off('notification');
  }, [token]);

  const markAsRead = async (id) => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/notifications/read`,
      { notification_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id}>
            {n.message} - {n.is_read ? 'Read' : <button onClick={() => markAsRead(n.id)}>Mark as Read</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;