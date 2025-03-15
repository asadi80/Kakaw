"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import "../../styles/globals.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error messages

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login:", { email, password });

    try {
      const response = await fetch("/api/auth/login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        setError(data.error || "Login failed");
        return;
      }

      // Decode the token to get user ID
      const decoded = jwtDecode(data.token);
      const userId = decoded.id;

      // Save token and user ID to localStorage
      localStorage.clear("authToken");
      localStorage.clear("userId");
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", userId);

      // Redirect to profile page
      router.push(`/profile`);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred. Please try again."); // Set a generic error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}