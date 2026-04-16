import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, DollarSign, Edit2, Save, X } from "lucide-react";
//import { userProfile as initialProfile } from "../data/mockData.js";
import { updateMember,getMemberById } from "../api/memberApi";
import {useNavigate} from "react-router"
import { getAdminById, updateAdmin } from "../api/adminApi";
function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  // const [userProfile, setUserProfile] = useState({});
  const [profile, setProfile] = useState({});
  const [editedProfile, setEditedProfile] = useState({});
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  useEffect(() => {
  const loadProfile = async () => {
    const id = localStorage.getItem('id');
      // ❌ if no id → redirect
      if (!id || id === "null") {
        console.log("No ID found, redirecting...",id);
        return;
      }
      if (role === "member") {
        const res = await getMemberById(id);
        console.table(res.data);
        const data = res.data?.data || res.data; // handle both cases
        //setUserProfile(data);
        setProfile(data);          // ✅ IMPORTANT
        setEditedProfile(data);
      } else {
        const res = await getAdminById(id);
        console.table(res.data);
        const data = res.data?.data || res.data; // handle both cases
        //setUserProfile(data);
        setProfile(data);          // ✅ IMPORTANT
        setEditedProfile(data);
      }
        // ✅ IMPORTANT
  };

      loadProfile();
    }, []);
      const handleEdit = () => {
      setIsEditing(true);
      setEditedProfile(profile); // ok AFTER fix above
    }
    const departments = [
      "Engineering",
      "Computer Science (CS)",
      "Electronics (EC)",
      "Electronics & Communication (ECE)",
      "Mechanical",
      "Civil",
      "MBBS",
      "BDS",
      "Pharmacy",
      "MBA",
      "B.Com",
      "Arts"
    ];
    const handleLogout = () => {
      // 🧹 Clear storage
      localStorage.removeItem("id");
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      localStorage.clear()
      //localStorage.removeItem("token"); // if you use JWT later

      // 🚀 Redirect to login type page
      navigate("/");
    };
 const handleSave = async () => {
    try {
      let res;

      if (role === "member") {
        res = await updateMember(profile._id, editedProfile);
      } else {
        res = await updateAdmin(profile._id, editedProfile);
      }

      const updatedData = res.data?.data || res.data;

      setProfile(updatedData);
      setEditedProfile(updatedData);
      setIsEditing(false);

      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const currentProfile = isEditing ? editedProfile : profile;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-[#93A5CF] to-[#B4ECE9] rounded-full flex items-center justify-center mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentProfile.name}</h2>
              <p className="text-gray-500 mb-4">Member ID: {currentProfile.id}</p>
              
              <div className="w-full pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Member since {currentProfile.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Library Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Active Loans</span>
                </div>
                <span className="font-semibold text-gray-900">{currentProfile.activeLoans}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Total Borrowed</span>
                </div>
                <span className="font-semibold text-gray-900">{currentProfile.totalBorrowed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-600">Total Fines</span>
                </div>
                <span className="font-semibold text-red-600">{currentProfile.totalFines}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="font-semibold text-xl mb-6 text-gray-800">Personal Information</h3>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={currentProfile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.email}</p>
                )}
              </div>
                {/* Role */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Role
                </label>

                <p className="text-gray-900 text-lg">
                  {role || "Member"}
                </p>
              </div>
              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={currentProfile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={currentProfile.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.address}</p>
                )}
                
              </div>
              {/* Department*/}
              <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Department
              </label>

              {isEditing ? (
                <select
                  value={currentProfile.dept || ""}
                  onChange={(e) => handleChange("dept", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Department</option>
                  
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 text-lg">
                  {currentProfile.dept || "Not Assigned"}
                </p>
              )}
            </div>
              {/* Member Type*/}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Member Type
                </label>
                {isEditing ? (
                  <select
                    value={currentProfile.memberType || ""}
                    onChange={(e) => handleChange("memberType", e.target.value)}
                    className="input"
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.memberType}</p>
                )}
              </div>
              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                {isEditing ? (
                  <select
                    value={currentProfile.status || ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : (
                  <p className="text-gray-900 text-lg">{currentProfile.status}</p>
                )}
              </div>
              {/* createdAt*/}
              <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Created At
                  </label>
                  <p className="text-gray-900 text-lg">
                    {new Date(currentProfile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* updateAt */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Last Updated
            </label>
            <p className="text-gray-900 text-lg">
              {new Date(currentProfile.updatedAt).toLocaleDateString()}
            </p>
          </div>
            </div>
          </div>
          
          {/* Change Password Section */}
          {isEditing && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-xl mb-6 text-gray-800">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
