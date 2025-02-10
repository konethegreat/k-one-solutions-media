import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';
import ProfileForm from '../components/ProfileForm';
import UserList from '../components/UserList';
import { useAuth } from  '../utils/AuthContext';

const Profile = ({ match }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'followers', or 'following'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profile/${match.params.userId}`);
        setProfile(response.data);
        setIsFollowing(
          currentUser.following.includes(response.data._id)
        );
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, match.params.userId]);

  const handleFollow = async () => {
    try {
      await api.post(`/auth/follow/${profile._id}`);
      setIsFollowing(true);
      setProfile({
        ...profile,
        followers: [...profile.followers, currentUser._id],
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api.post(`/auth/unfollow/${profile._id}`);
      setIsFollowing(false);
      setProfile({
        ...profile,
        followers: profile.followers.filter(
          (id) => id.toString() !== currentUser._id.toString()
        ),
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div>
      <h1>{profile.username}&apos;s Profile</h1>
      {profile.profilePicture && (
        <img
          src={`http://localhost:5000/${profile.profilePicture}`}
          alt={`${profile.username}'s profile picture`}
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
        />
      )}
      <p>{profile.bio}</p>
      <div>
        <button onClick={() => setActiveTab('posts')}>Posts</button>
        <button onClick={() => setActiveTab('followers')}>Followers ({profile.followers.length})</button>
        <button onClick={() => setActiveTab('following')}>Following ({profile.following.length})</button>
      </div>
      {activeTab === 'followers' && (
        <UserList users={profile.followers} />
      )}
      {activeTab === 'following' && (
        <UserList users={profile.following} />
      )}
      {currentUser._id !== profile._id && (
        <div>
          {isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
      )}
      {currentUser._id === profile._id && (
        <ProfileForm profile={profile} onUpdate={setProfile} />
      )}
    </div>
  );
};
Profile.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default Profile;