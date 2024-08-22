"use client";

import "../../public/css/login.css";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
// import { setRole } from "next-auth/client";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For handling login errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Prevents automatic redirection
      username,
      password,
    });

    if (result.error) {
      // Handle login error
      console.error("Login error:", result.error);
      setError(result.error);
    } else {
      // Handle successful login
      console.log("Login successful");
      window.alert("Login successful");
      // Redirect to the desired page, e.g., dashboard
      window.location.href = "/homepage"; // Adjust the path as needed
    }
  };
  return (
    <div className="background-container">
      <div className="main-cont">
        <div className="flex justify-center mb-6">
          <Image
            src="/Images/selase-logo.png"
            alt="Logo"
            width={80}
            height={80}
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-600">
          Login
        </h2>
        <p className="text-gray-600 text-center mb-6">Hi, Welcome back 👋</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-left text-gray-700 mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your user name"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-left text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                onChange={() => setRole("admin")}
              />
              <label htmlFor="rememberMe" className="text-gray-700">
                Remember Me
              </label>
            </div>
            <a
              href="/account/forgot-password"
              className="text-blue-500 hover:text-blue-700"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
