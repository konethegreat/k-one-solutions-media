import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const UserList = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user._id}>
          <Link to={`/messages/${user._id}`}>
            <img
              src={`http://localhost:5000/${user.profilePicture}`}
              alt={user.username}
              style={{ width: '50px', height: '50px', borderRadius: '50%' }}
            />
            <span>{user.username}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};
UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
      bio: PropTypes.string
    })
  ).isRequired,
  onUserClick: PropTypes.func
};

export default UserList;