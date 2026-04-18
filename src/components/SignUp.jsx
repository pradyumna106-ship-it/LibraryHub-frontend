import { useRef, useState } from 'react';
import { User, Mail, Phone, MapPin, BookOpen, Users, Lock } from 'lucide-react';
import { addMember } from '../api/memberApi';
import { useNavigate } from 'react-router';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',  // ✅ Added
    memberType: 'Student',
    avatar:''
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const navigate = useNavigate()
  const [errors, setErrors] = useState({});
  const streamRef = useRef(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleCapture = () => {
    const video = document.querySelector("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    // Convert to file instead of base64
    canvas.toBlob((blob) => {
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }, "image/jpeg");
    setShowCamera(false);
    stopCamera()
  };
    const startCamera = async () => {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream; // ✅ save reference
      document.querySelector("video").srcObject = stream;
    };
    const stopCamera = () => {
      streamRef.current?.getTracks().forEach(track => track.stop()); // ✅ kill stream
      setShowCamera(false);
    };
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dept.trim()) newErrors.dept = 'Department is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const departments = [
    "Computer Science",
    "Information Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Commerce"
  ];
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
          const formPayload = new FormData();
          Object.keys(formData).forEach(key => {
            if (key !== "confirmPassword" && formData[key]) {
              formPayload.append(key, formData[key]); // ✅ only non-empty
            }
          });

          // ✅ send actual file
          if (avatar) {
            formPayload.append("avatar", avatar);
          }
              for (let pair of formPayload.entries()) {
                    console.log(pair[0], pair[1]);
                  }
              const response = await addMember(formPayload);

              if (response.ok) {
                alert("Sign up successful!");
                navigate("/login/member");
              }

            } catch (error) {
              console.error(error);
              setErrors({ general: 'Server error' });
            }
          };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Create Member Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our library community
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-300 bg-red-50' : 'hover:border-gray-400'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <select
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl"
          >
            <option value="">Select Department</option>

            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-300 bg-red-50' : 'hover:border-gray-400'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Address (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
              placeholder="Your complete address"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-300 bg-red-50' : 'hover:border-gray-400'
              }`}
              placeholder="At least 6 characters"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* ✅ NEW: Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4 inline mr-2" />
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'hover:border-gray-400'
              }`}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Member Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Type *
            </label>
            <select
              name="memberType"
              value={formData.memberType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400 transition-all"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Other">Other</option>
            </select>
          </div>
               {/* Avatar Upload */}
        <div className="text-center">
          <div className="mb-4">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                <User className="h-10 w-10 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            {/* Upload */}
            <label className="cursor-pointer bg-blue-500 text-white px-3 py-2 rounded-lg text-sm">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {/* Camera */}
            <button
              type="button"
              onClick={startCamera}
              className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm"
            >
              Take Photo
            </button>
          </div>
        </div>
        {showCamera && (
        <div className="mt-4 text-center">
          <video autoPlay className="w-64 mx-auto rounded-lg border"></video>
          
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleCapture}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Capture
            </button>
            <button
              type="button"
              onClick={() => setShowCamera(false)}
              className="bg-gray-500 text-white px-3 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-lg"
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login/member" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;