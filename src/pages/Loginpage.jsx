import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient, isDemo } from "../services/api";
import { demoUser } from "../services/demoData";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isDemo) {
      const user = {
        username: demoUser.username,
        email: form.email || demoUser.email,
      };
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
      return;
    }
    try {
      const res = await apiClient.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <div className="text-red-600">{error}</div>}
        <input name="email" placeholder="Email" type="email" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
