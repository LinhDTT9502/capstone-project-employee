import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/profileService';
import Logout from '../Auth/Logout';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(2);
        setProfile(data);
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold mb-4">{profile.fullName}</h1>
      <img src={profile.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Address:</strong> {profile.address}</p>
      <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
      <p><strong>Gender:</strong> {profile.gender}</p>
      <p><strong>Created Date:</strong> {new Date(profile.createdDate).toLocaleDateString()}</p>
      <p><strong>Last Update:</strong> {new Date(profile.lastUpdate).toLocaleDateString()}</p>
      <Logout/>
    </div>
  );
};

export default Profile;