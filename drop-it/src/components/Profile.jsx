// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ email: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token'); // From login
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data.data);
      setFormData({ email: res.data.data.email });
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProfile(res.data.data);
    alert('Profile updated!');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <h3>Update Profile</h3>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="New Email"
      />
      <button onClick={updateProfile}>Update</button>
    </div>
  );
};

export default Profile;