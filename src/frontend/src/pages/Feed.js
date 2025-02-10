import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]); // Add the new post to the top of the list
  };

  return (
    <div>
      <h1>Feed</h1>
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};
Feed.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        profilePicture: PropTypes.string
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      likes: PropTypes.arrayOf(PropTypes.string),
      comments: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          author: PropTypes.string.isRequired
        })
      )
    })
  ).isRequired,
  onPostUpdate: PropTypes.func
};

export default Feed;