import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        {error && <div className="text-red-600">{error}</div>}
        <input name="username" placeholder="Username" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" className="w-full border px-3 py-2 rounded" onChange={handleChange} />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Create Account</button>
      </form>
    </div>
  );
}

export default RegisterPage;
