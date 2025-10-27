// src/auth/Register.jsx
import React, { useState, useContext } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    company_name: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await api.post("/users/register/", formData);
      // After successful registration → login automatically
      const res = await api.post("/users/login/", {
        username: formData.username,
        password: formData.password,
      });
      await login({ access: res.data.access, refresh: res.data.refresh });
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ["Registration failed. Please try again."] });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["username", "email", "company_name", "password", "password2"].map((field) => (
          <div key={field}>
            <input
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ")}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
