import React, { useEffect, useState } from "react";
import { getProfile } from "../../services/profileService";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

const Profile = ({ open, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
console.log(profile)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.UserId);
        setProfile(data);
      } catch (err) {
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user.UserId]);

  if (loading)
    return (
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
            <img
              src={
                profile.avatarUrl ||
                "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
              }
              alt="Avatar"
              className="w-40 h-40 rounded-full shadow-lg mb-4"
            />

          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.fullName}
          </h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>
        <div className="space-y-4">
          <ProfileItem
            icon="fa-phone"
            label="Số điện thoại"
            value={profile.phoneNumber}
          />
          <ProfileItem
            icon="fa-map-marker-alt"
            label="Địa chỉ"
            value={profile.address}
          />
          <ProfileItem
            icon="fa-birthday-cake"
            label="Ngày sinh"
            value={new Date(profile.dob).toLocaleDateString()}
          />
          <ProfileItem
            icon="fa-venus-mars"
            label="Giới tính"
            value={profile.gender}
          />
          {/* <ProfileItem
            icon="fa-calendar-plus"
            label="Ngày tạo"
            value={new Date(profile.createdDate).toLocaleDateString()}
          /> */}
          {/* <ProfileItem
            icon="fa-calendar-check"
            label="Lần cuối truy cập"
            value={new Date(profile.lastUpdate).toLocaleDateString()}
          /> */}
        </div>
      </DialogBody>
      <DialogFooter className="border-t pt-4">
        <Button
          variant="text"
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out"
        >
          Đóng
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
