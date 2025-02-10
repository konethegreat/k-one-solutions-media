import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const ProfileForm = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: profile.username,
    email: profile.email,
    bio: profile.bio || '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = { ...formData };
      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        const response = await api.post('/auth/upload-profile-picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        updatedProfile.profilePicture = response.data.profilePicture;
      }
      onUpdate(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bio:</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Update Profile</button>
    </form>
  );
};
ProfileForm.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
    bio: PropTypes.string,
    // Add other profile fields as needed
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ProfileForm;