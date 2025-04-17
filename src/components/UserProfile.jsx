import React, { useState, useEffect } from 'react';
import { Shield, User, Heart, Edit2, Check, X, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedData(user);
    }
  }, [user]);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'provider':
        return <Shield className="w-6 h-6 text-blue-500" />;
      case 'recipient':
        return <User className="w-6 h-6 text-green-500" />;
      case 'volunteer':
        return <Heart className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handlePrivacyChange = (setting) => {
    setEditedData({
      ...editedData,
      privacySettings: {
        ...editedData.privacySettings,
        [setting]: !editedData.privacySettings[setting]
      }
    });
  };

  const handleSave = () => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find and update the current user's data
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...editedData } : u
    );

    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user || !editedData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {getRoleIcon(user.role)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>

          {user.isVerified && (
            <div className="flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Verified User
              </span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md mt-1"
                  />
                ) : (
                  <p className="mt-1">{user.privacySettings.showEmail ? user.email : '(Hidden)'}</p>
                )}
              </div>
            </div>

            {(user.role === 'provider' || user.role === 'volunteer') && (
              <>
                <div>
                  <h3 className="text-lg font-medium">Skills</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {user.role === 'provider' && (
                  <div>
                    <h3 className="text-lg font-medium">Resources Available</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.resources.map((resource) => (
                        <span
                          key={resource}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {isEditing && (
              <div>
                <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                <div className="space-y-2">
                  {Object.entries(editedData.privacySettings).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handlePrivacyChange(key)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">
                        Show {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 