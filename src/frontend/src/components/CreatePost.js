import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';


const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/posts', { content });
      onPostCreated(response.data); // Notify parent component
      setContent(''); // Clear the form
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
};
CreatePost.propTypes = {
  onPostCreated: PropTypes.func.isRequired
};

export default CreatePost;