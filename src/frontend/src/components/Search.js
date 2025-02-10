import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    users: [],
    posts: [],
    messages: [],
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const [usersResponse, postsResponse, messagesResponse] = await Promise.all([
        api.get(`/search/users?query=${query}`),
        api.get(`/search/posts?query=${query}`),
        api.get(`/search/messages?query=${query}`),
      ]);

      setResults({
        users: usersResponse.data,
        posts: postsResponse.data,
        messages: messagesResponse.data,
      });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          required
        />
        <button type="submit">Search</button>
      </form>

      <div>
        <h3>Users</h3>
        {results.users.map((user) => (
          <div key={user._id}>
            <Link to={`/profile/${user._id}`}>
              <img
                src={`http://localhost:5000/${user.profilePicture}`}
                alt={user.username}
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <span>{user.username}</span>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <h3>Posts</h3>
        {results.posts.map((post) => (
          <div key={post._id}>
            <Link to={`/post/${post._id}`}>
              <p>{post.content}</p>
              <small>by {post.author.username}</small>
            </Link>
          </div>
        ))}
      </div>

      <div>
        <h3>Messages</h3>
        {results.messages.map((message) => (
          <div key={message._id}>
            <p>{message.content}</p>
            <small>
              From {message.sender.username} to {message.receiver.username}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
Search.propTypes = {
  results: PropTypes.shape({
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        sender: PropTypes.shape({
          username: PropTypes.string.isRequired
        }).isRequired,
        receiver: PropTypes.shape({
          username: PropTypes.string.isRequired
        }).isRequired
      })
    ).isRequired
  }).isRequired
};

export default Search;