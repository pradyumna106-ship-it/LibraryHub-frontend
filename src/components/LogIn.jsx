import { User } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminLogin, memberLogin } from "../api/base";

function LogIn() {
  const navigate = useNavigate();
  const { role } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAdmin = role === "admin";
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(role, email, password);

    // 🔥 simple validation
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

      // 🚀 Navigate based on role
    if (isAdmin) {
        const res = await adminLogin({email,password})
        console.log(res)
        if(res.status === 200){
          localStorage.setItem('id',res.data.admin.id)
          navigate("/admin-dashboard");
        }
        else {
          console.warn("wrong credentials");
        }
    } else {
        const res = await memberLogin({email,password});
        console.log(res)
        if(res.status === 200){
          localStorage.setItem('id',res.data.member.id)
          navigate("/dashboard");
        }
        else{
          console.warn("wrong credentials");
        }
          

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <User size={40} className="text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold">
            Login as Member
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>

        </form>

        {/* Footer (ONLY for Member) */}
        {!isAdmin && (
          <p className="text-center text-sm mt-5">
            Don’t have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Register Here
            </span>
          </p>
        )}

      </div>
    </div>
  );
}

export default LogIn;