import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";

import "../../styles/globals.css";

import {
  Mail,
  Phone,
  User,
  QrCode,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useQRCode } from "next-qrcode";

// UserNotFound component
const UserNotFound = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6">
    <div className="text-center space-y-6 max-w-md">
      <div className="flex justify-center">
        <div className="bg-red-500/20 p-6 rounded-full border border-red-500/30">
          <AlertCircle className="text-red-400" size={64} />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white">User Not Found</h2>
      <p className="text-white/60">
        The profile you're looking for doesn't exist or has been removed.
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-lg"
      >
        Go Home
      </button>
    </div>
  </div>
);

export default function UserView() {
  const router = useRouter();
  const { Image } = useQRCode();
  const [links, setLinks] = useState("");

  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!router.isReady || !id) return; // Don't fetch if id is missing

      if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) {
        // Example MongoDB ObjectId check
        setError("Invalid user ID format.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/user?id=${id}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setLinks(data.links);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router.isReady]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-12 w-12 text-blue-400"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return <UserNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Main Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30"></div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            {/* Profile Picture */}
            <div className="px-8 -mt-16 mb-6 flex justify-center">
              <div className="w-32 h-32 border-4 border-white/20 rounded-full overflow-hidden shadow-xl bg-white/10">
                <img
                  src={
                    user.profilePicture ||
                    "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8 space-y-6 text-white">
              {/* Name */}
              <div className="text-center">
                <h2 className="text-3xl font-bold">{user.name}</h2>
                {user.occupation && (
                  <p className="text-white/60 mt-1">{user.occupation}</p>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-2 border-t border-white/10 pt-4 text-center text-white/70">
                {user.email && <p>{user.email}</p>}
                {user.phone && <p>{user.phone}</p>}
              </div>

              {/* About Me */}
              {user.aboutMe && (
                <div className="border-t border-white/10 pt-4">
                  <h3 className="text-white font-semibold mb-2">About Me</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {user.aboutMe}
                  </p>
                </div>
              )}

              {/* Links */}
              {links?.length > 0 && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                  {links.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center font-medium hover:bg-white/10 transition"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              )}

              {/* QR Code */}
              <div className="border-t border-white/10 pt-6 flex flex-col items-center space-y-3">
                <div className="bg-white p-4 rounded-2xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                      <QRCodeCanvas
                      value={`https://kakaw-ten.vercel.app/user/${user._id}`}
                      size={128}
                    />
                  </div>
                </div>
                <p className="text-white/60 text-sm">Scan to view profile</p>
                <a href="/signup">Signup</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
