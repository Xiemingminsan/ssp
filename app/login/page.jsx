"use client";

import "../../public/css/login.css";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import LoadingScreen from "../components/LoadingScreen";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For disabling the submit button
  const [isLoading, setIsLoading] = useState(false); // For loading indicator during redirect
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button to prevent multiple clicks

    const result = await signIn("credentials", {
      redirect: false, // Prevent NextAuth from redirecting automatically
      username,
      password,
    });

    if (result.error) {
      // Login failed
      showErrorToast(result.error || "Login failed. Please try again.");
      setIsSubmitting(false); // Re-enable the submit button
    } else {
      // Login successful
      showSuccessToast("Login successful!");

      // Delay loading indicator
      setTimeout(() => {
        setIsLoading(true); // Show loading indicator during redirection
        // Optionally redirect or perform any other action here
      }, 1000);

      // Let NextAuth handle redirection
      await signIn("credentials", {
        redirect: true,
        callbackUrl: "/", // Redirect to the root path
        username,
        password,
      });

      // Redirect user based on their role

      router.push(redirectPath);
    }
  };

  return (
    <>
      {isLoading && <LoadingScreen />}
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
                disabled={isSubmitting || isLoading}
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
                disabled={isSubmitting || isLoading}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="mr-2"
                  disabled={isSubmitting || isLoading}
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
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
