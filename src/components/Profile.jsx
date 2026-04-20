import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, BookOpen, DollarSign, Edit2, Save, X } from "lucide-react";
import { updateMember, getMemberById, deleteMember } from "../api/memberApi";
import { useNavigate } from "react-router";
import { deleteAdmin, getAdminById, updateAdmin } from "../api/adminApi";
import { base64img } from "../utils/imagedisplay.js";

let cache = {};
const Field = ({ icon: Icon, label, field, type = "text", children, isEditing,currentProfile,inputClass,fieldClass,handleChange }) => (
    <div>
      <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
        {label}
      </label>
      {children ?? (
        isEditing ? (
          <input
            type={type}
            value={currentProfile[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            className={inputClass}
          />
        ) : (
          <p className={fieldClass}>{currentProfile[field] || "—"}</p>
        )
      )}
    </div>
  );
function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [editedProfile, setEditedProfile] = useState({});
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  useEffect(() => {
    const loadProfile = async () => {
      if (!id || id === "null") {
        console.log("No ID found, redirecting...", id);
        return;
      }
      if (cache[id]) {
        setProfile(cache[id]);
        setEditedProfile(cache[id]);
        return;
      }
      if (role === "member") {
        const res = await getMemberById(id);
        const data = res.data?.data || res.data;
        setProfile(data);
        setEditedProfile(data);
        cache[id] = data;
      } else {
        const res = await getAdminById(id);
        const data = res.data?.data || res.data;
        setProfile(data);
        setEditedProfile(data);
        cache[id] = data;
      }
    };
    loadProfile();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const departments = [
    "Engineering", "Computer Science (CS)", "Electronics (EC)",
    "Electronics & Communication (ECE)", "Mechanical", "Civil",
    "MBBS", "BDS", "Pharmacy", "MBA", "B.Com", "Arts",
  ];

  const handleLogout = () => {
    const confirmed = confirm("Are you sure you want to logout?");
    if (!confirmed) return;
    localStorage.clear();
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
      cache[id] = updatedData;
      setProfile(updatedData);
      setEditedProfile(updatedData);
      setIsEditing(false);
      alert("Profile updated successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;
    if (role === "member") {
      const res = await deleteMember(id);
      console.log(res.data.message);
    } else {
      const res = await deleteAdmin(id);
      console.log(res.data.message);
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
  const displayAvatar = currentProfile?.avatar || base64img(128, 128, 4);

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm";
  const fieldClass = "text-gray-900 text-sm md:text-base";


  return (
    <div className="p-3 md:p-8 max-w-6xl mx-auto">

      {/* ── TOP BAR ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">My Profile</h1>

        {/* Action buttons — wrap on mobile */}
        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition-colors"
          >
            Logout
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* ── LEFT COLUMN: Avatar + Stats ── */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">

          {/* Avatar card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex flex-col items-center text-center">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="User avatar"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-bold text-gray-800">{currentProfile.name}</h2>
              <p className="text-xs text-gray-400 mt-0.5 break-all">ID: {currentProfile._id}</p>

              {currentProfile.memberSince && (
                <div className="flex items-center gap-1.5 text-gray-500 mt-3 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {currentProfile.memberSince}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-base md:text-lg mb-4 text-gray-800">Library Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Active Loans</span>
                </div>
                <span className="font-semibold text-gray-900">{currentProfile.activeLoans ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Total Borrowed</span>
                </div>
                <span className="font-semibold text-gray-900">{currentProfile.totalBorrowed ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Total Fines</span>
                </div>
                <span className="font-semibold text-red-600">{currentProfile.totalFines ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Personal Info + Password ── */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">

          {/* Personal info card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-semibold text-base md:text-xl mb-5 text-gray-800">Personal Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">

              {/* Name */}
              <Field icon={User} label="Full Name" field="name" isEditing={isEditing} currentProfile={currentProfile} inputClass={inputClass} fieldClass={fieldClass} handleChange={handleChange}/>

              {/* Email */}
              <Field icon={Mail} label="Email Address" field="email" type="email" isEditing={isEditing} currentProfile={currentProfile} inputClass={inputClass} fieldClass={fieldClass} handleChange={handleChange}/>

              {/* Role */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Role</label>
                <p className={fieldClass}>{role || "Member"}</p>
              </div>

              {/* Phone */}
              <Field icon={Phone} label="Phone Number" field="phone" type="tel" isEditing={isEditing} currentProfile={currentProfile} inputClass={inputClass} fieldClass={fieldClass} handleChange={handleChange}/>

              {/* Department */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Department</label>
                {isEditing ? (
                  <select
                    value={currentProfile.dept || ""}
                    onChange={(e) => handleChange("dept", e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                ) : (
                  <p className={fieldClass}>{currentProfile.dept || "Not Assigned"}</p>
                )}
              </div>

              {/* Member Type */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Member Type</label>
                {isEditing ? (
                  <select
                    value={currentProfile.memberType || ""}
                    onChange={(e) => handleChange("memberType", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Student">Student</option>
                    <option value="Faculty">Faculty</option>
                  </select>
                ) : (
                  <p className={fieldClass}>{currentProfile.memberType || "—"}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Status</label>
                {isEditing ? (
                  <select
                    value={currentProfile.status || ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                ) : (
                  <p className={fieldClass}>{currentProfile.status || "—"}</p>
                )}
              </div>

              {/* Created At */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Created At</label>
                <p className={fieldClass}>
                  {currentProfile.createdAt ? new Date(currentProfile.createdAt).toLocaleDateString() : "—"}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Last Updated</label>
                <p className={fieldClass}>
                  {currentProfile.updatedAt ? new Date(currentProfile.updatedAt).toLocaleDateString() : "—"}
                </p>
              </div>

              {/* Address — full width */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={currentProfile.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                ) : (
                  <p className={fieldClass}>{currentProfile.address || "—"}</p>
                )}
              </div>
            </div>
          </div>

          {/* Change Password — only when editing */}
          {isEditing && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-semibold text-base md:text-xl mb-5 text-gray-800">Change Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Current Password</label>
                  <input type="password" placeholder="Enter current password" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">New Password</label>
                  <input type="password" placeholder="Enter new password" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 block">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className={inputClass} />
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