import React, { useEffect, useState } from 'react';
import { getProfile } from '../../services/profileService';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react"; 
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

const Profile = ({ open, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.UserId);
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
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
    >
      <DialogHeader>View Profile</DialogHeader>
      <DialogBody className="grid grid-cols-2 gap-4">
        <div>
          <img src={profile.avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full mb-4" />
        </div>
        <div>
          <p><strong>Full Name:</strong> {profile.fullName}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phone}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Date of Birth:</strong> {new Date(profile.dob).toLocaleDateString()}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Created Date:</strong> {new Date(profile.createdDate).toLocaleDateString()}</p>
          <p><strong>Last Update:</strong> {new Date(profile.lastUpdate).toLocaleDateString()}</p>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default Profile;
