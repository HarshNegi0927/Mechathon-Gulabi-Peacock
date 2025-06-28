import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, Lock, Bell, Settings, LogOut, Upload, Edit, Save } from 'lucide-react';

function User() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '/placeholder.svg',
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('https://mechathon-gulabi-peacock-8.onrender.com/auth/check', {
        credentials: 'include'
      });
      if (!response.ok) {
        navigate('/login');
        return;
      }
      fetchUserData();
    } catch (error) {
      console.error('Authentication check failed:', error);
      navigate('/login');
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://mechathon-gulabi-peacock-8.onrender.com/auth/user', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(prevData => ({
          ...prevData,
          name: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          profilePicture: data.profilePicture || '/placeholder.svg',
        }));
        console.log(userData.profilePicture);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', userData.name);
      formData.append('email', userData.email);
      formData.append('phone', userData.phone);
      formData.append('address', userData.address);
      if (newProfilePicture) {
        formData.append('profilePicture', newProfilePicture);
      }
      
      const response = await fetch('https://mechathon-gulabi-peacock-8.onrender.com/auth/update-profile', {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setIsEditing(false);
        fetchUserData();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://mechathon-gulabi-peacock-8.onrender.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="md:flex">
          <div className="md:flex-shrink-0 bg-indigo-600 p-8 text-white flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <img
                src={newProfilePicture ? URL.createObjectURL(newProfilePicture) : userData.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <label htmlFor="profile-picture-input" className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
                  <Upload size={20} className="text-indigo-600" />
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-indigo-200">{userData.email}</p>
          </div>
          <div className="p-8 w-full">
            <h1 className="text-3xl font-bold text-indigo-800 mb-6">User Profile</h1>
            
            {/* Profile Information Display/Edit */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Name Field */}
              <div>
                <label className="block text-indigo-800 font-semibold mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Name"
                  />
                ) : (
                  <div className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">
                    {userData.name || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-indigo-800 font-semibold mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Email"
                  />
                ) : (
                  <div className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">
                    {userData.email || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-indigo-800 font-semibold mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Phone"
                  />
                ) : (
                  <div className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">
                    {userData.phone || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-indigo-800 font-semibold mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Address"
                  />
                ) : (
                  <div className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-800">
                    {userData.address || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Profile Picture Upload - Only show when editing */}
              {isEditing && (
                <div className="mt-4">
                  <label htmlFor="profile-picture-input" className="block text-indigo-800 font-semibold mb-2">
                    Upload New Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="block w-full p-2 border border-indigo-300 rounded-lg"
                  />
                  {newProfilePicture && (
                    <img
                      src={URL.createObjectURL(newProfilePicture)}
                      alt="New Profile Preview"
                      className="mt-4 w-32 h-32 rounded-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Action Button */}
              {isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Save className="mr-2" /> Save Changes
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="mr-2" /> Edit Profile
                </motion.button>
              )}
            </motion.div>

            <motion.div 
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-white text-indigo-800 py-2 px-6 rounded-full hover:bg-indigo-100 transition-colors inline-flex items-center border border-indigo-300"
              >
                <LogOut className="mr-2" /> Logout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default User;