import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import socket from '../utils/socket';
import { useAuth } from  '../utils/AuthContext';
import UserList from '../components/UserList';

const Messages = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${userId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users'); // Fetch all users
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchMessages();
    fetchUsers();

    // Listen for new messages
    socket.on('message', (message) => {
      if (
        (message.sender._id === userId && message.receiver._id === user._id) ||
        (message.sender._id === user._id && message.receiver._id === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Clean up the socket connection
    return () => {
      socket.off('message');
    };
  }, [userId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/messages', {
        receiver: userId,
        content,
      });
      setMessages((prev) => [...prev, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Messages</h1>
      <div>
        <UserList users={users} />
      </div>
      <div>
        {messages.map((message) => (
          <div key={message._id}>
            <img
              src={`http://localhost:5000/${message.sender.profilePicture}`}
              alt={message.sender.username}
              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            />
            <strong>{message.sender.username}:</strong> {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
Messages.propTypes = {
  selectedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profilePicture: PropTypes.string
  }),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired,
      receiver: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired,
  onMessageSend: PropTypes.func.isRequired
};

export default Messages;