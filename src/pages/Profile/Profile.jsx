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
  }, [user.UserId]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
    </div>
  );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      className="bg-white rounded-lg shadow-xl"
    >
      <DialogHeader className="text-2xl font-bold text-gray-800 border-b pb-4">
        <i className="fas fa-user-circle mr-2"></i>Thông tin cá nhân
      </DialogHeader>
      <DialogBody className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col items-center">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="w-40 h-40 rounded-full shadow-lg mb-4" />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-500 text-white flex items-center justify-center mb-4">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="text-2xl font-semibold text-gray-800">{profile.fullName}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>
        <div className="space-y-4">
          <ProfileItem icon="fa-phone" label="Số điện thoại" value={profile.phone} />
          <ProfileItem icon="fa-map-marker-alt" label="Địa chỉ" value={profile.address} />
          <ProfileItem icon="fa-birthday-cake" label="Ngày sinh" value={new Date(profile.dob).toLocaleDateString()} />
          <ProfileItem icon="fa-venus-mars" label="Giới tính" value={profile.gender} />
          <ProfileItem icon="fa-calendar-plus" label="Ngày tạo" value={new Date(profile.createdDate).toLocaleDateString()} />
          <ProfileItem icon="fa-calendar-check" label="Lần cuối truy cập" value={new Date(profile.lastUpdate).toLocaleDateString()} />
        </div>
      </DialogBody>
      <DialogFooter className="border-t pt-4">
        <Button
          variant="text"
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out"
        >
          <i className="fas fa-times mr-2"></i>Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <i className={`fas ${icon} w-6 text-blue-500`}></i>
    <span className="font-semibold text-gray-700 mr-2">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default Profile;
