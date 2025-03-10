"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../../styles/globals.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(""); // State to store error messages

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.clear("authToken");
      localStorage.clear("userId");
    console.log("Signup:", { name, email, password });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Signup Error:", errorData);
        setError(errorData.error || "An error occurred"); // Set error message
        return;
      }

      const data = await response.json();
      console.log("Signup Successful:", data);

      // Save user ID to localStorage
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("authToken",data.token);

      // Redirect to profile page
      router.push(`/profile`);
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
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
          Sign Up
        </button>
        <p className="text-center text-sm text-gray-600">
          If you have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline focus:outline-none"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}