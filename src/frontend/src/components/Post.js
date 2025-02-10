import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments] = useState(post.comments); // Removed setComments

  const handleLike = async () => {
    try {
      await api.post(`/posts/${post._id}/like`);
      setLikes(likes + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="post">
      <h3 className="post-author">{post.author.username}</h3>
      <p className="post-content">{post.content}</p>
      <small className="post-date">{new Date(post.createdAt).toLocaleString()}</small>
      <div>
        <button onClick={handleLike}>Like ({likes})</button>
      </div>
      <div>
        <h4>Comments:</h4>
        {comments.map((comment, index) => (
          <div key={index}>
            <strong>{comment.author.username}:</strong> {comment.text}
          </div>
        ))}
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    likes: PropTypes.arrayOf(PropTypes.string).isRequired,
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        author: PropTypes.shape({
          username: PropTypes.string.isRequired,
        }).isRequired,
        text: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Post;