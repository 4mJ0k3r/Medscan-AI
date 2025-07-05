import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden"
      style={{ fontFamily: "Manrope, Noto Sans, sans-serif" }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <h2 className="text-[#0d141c] text-[28px] font-bold text-center pb-3 pt-5">
              Welcome Back
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              {/* Email Field */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0d141c] text-base font-medium pb-2">
                  Email
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input rounded-xl border border-[#cedbe8] bg-slate-50 h-14 px-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] focus:border-[#cedbe8] focus:outline-0"
                />
              </label>
            </div>

            {/* Password Field */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0d141c] text-base font-medium pb-2">
                  Password
                </p>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input rounded-xl border border-[#cedbe8] bg-slate-50 h-14 px-[15px] text-base text-[#0d141c] placeholder:text-[#49739c] focus:border-[#cedbe8] focus:outline-0"
                />
              </label>
            </div>

              {/* Login Button */}
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex flex-1 items-center justify-center h-10 px-4 rounded-xl text-slate-50 text-lg font-bold tracking-[0.015em] ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-[#0c7ff2] hover:bg-[#248bf3] transition-colors'
                  }`}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </div>
            </form>

            {/* Register Link */}
            <p className="text-sm text-center text-[#49739c] px-4">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#248bf3] underline">
                Register
              </Link>
            </p>

            {/* OR Separator */}
            <p className="text-[#49739c] text-sm font-normal text-center pb-3 pt-4 px-4">
              Or continue with
            </p>

            {/* Continue with Google Button */}
            <div className="flex px-4 py-3">
              <button className="flex flex-1 items-center justify-center h-10 px-4 rounded-xl bg-[#0c7ff2] text-slate-50 text-lg font-bold tracking-[0.015em]">
                Continue with Google
                <span className="pl-2">
                  <i className="fa-brands fa-google"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
