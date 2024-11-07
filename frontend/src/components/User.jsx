import React, { useState } from 'react';

function User() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Springfield, IL',
    profilePicture: '/path/to/profile-picture.jpg',
  });

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Side Navigation Panel */}
      <div className="w-64 bg-blue-200 p-6 space-y-6">
        <div className="text-center text-xl font-bold text-blue-600">User Dashboard</div>
        <nav className="space-y-4">
          <a href="#profile" className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-400 text-white">
            Profile
          </a>
          <a href="#security" className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-400 text-white">
            Security Settings
          </a>
          <a href="#notifications" className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-400 text-white">
            Notifications
          </a>
          <a href="#account" className="block py-2 px-4 rounded bg-blue-300 hover:bg-blue-400 text-white">
            Account Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center bg-white shadow-lg p-4 rounded-lg">
          <div className="text-xl font-semibold text-blue-600">Hello, {userData.name}</div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
        </div>

        {/* Profile Section */}
        <div id="profile" className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Profile</h2>
          <div className="flex items-center space-x-6">
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400"
            />
            <div>
              <h3 className="text-3xl font-semibold text-gray-800">{userData.name}</h3>
              <p className="text-lg text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Personal Details Section */}
        <div id="personal-details" className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Personal Details</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="border p-2 rounded-lg"
                />
              ) : (
                <p className="text-lg">{userData.phone}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Address</p>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                  className="border p-2 rounded-lg"
                />
              ) : (
                <p className="text-lg">{userData.address}</p>
              )}
            </div>
          </div>
          {isEditing && (
            <div className="mt-6">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Security Settings Section */}
        <div id="security" className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Change Password</p>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Change Password
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Enable 2FA</p>
              <button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div id="notifications" className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Email Notifications</p>
              <input type="checkbox" className="rounded-md" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">SMS Notifications</p>
              <input type="checkbox" className="rounded-md" />
            </div>
          </div>
        </div>

        {/* Account Settings Section */}
        <div id="account" className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Deactivate Account</p>
              <button className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Deactivate
              </button>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Delete Account</p>
              <button className="px-6 py-2 bg-red-700 text-white rounded-md hover:bg-red-800">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
