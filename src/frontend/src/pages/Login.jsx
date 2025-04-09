import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, googleLogin } from "../Api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">

      <div className="flex-grow flex items-center justify-center">
        <div className="bg-black p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-800">
          <h2 className="text-white text-3xl font-bold text-center mb-8">
            Log in to Yappie
          </h2>

          <div className="mb-6">
            <button
              onClick={googleLogin}
              className="w-full flex items-center justify-center gap-3 bg-black border border-gray-700 hover:bg-gray-900 text-white px-4 py-3 rounded-full transition duration-300"
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="my-8 flex items-center">
            <div className="flex-grow h-px bg-gray-800"></div>
            <div className="px-4 text-gray-500 text-sm">OR</div>
            <div className="flex-grow h-px bg-gray-800"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <label className="text-gray-400 text-sm block mb-2">Email or username</label>
              <input
                type="email"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border border-gray-800"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-gray-600 border border-gray-800"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="flex items-center text-gray-400 text-sm">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2 h-4 w-4 rounded" 
                  />
                  <span>Remember me</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition duration-300"
            >
              Log in
            </button>
          </form>

          <div className="text-center mt-4">
            <a href="/forgot-password" className="text-gray-400 hover:text-purple-400 text-sm">
              Forgot your password?
            </a>
          </div>

          <div className="text-center mt-4">
            <a href="/login-admin" className="text-gray-400 hover:text-purple-400 text-sm">
              Login as Admin habibi
            </a>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6">
            <p className="text-gray-400 text-center text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-purple-500 hover:text-purple-400">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
