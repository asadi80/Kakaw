import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UserNotFound from "../../components/UserNotFound"; // Import the UserNotFound component
import { useQRCode } from "next-qrcode";

import "../../styles/globals.css";

const SkeletonLoader = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center space-x-6">
      <div className="w-24 h-24 rounded-full bg-gray-300"></div>
      <div className="h-8 bg-gray-300 rounded w-48"></div>
    </div>
    <div>
      <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-48"></div>
        <div className="h-4 bg-gray-300 rounded w-48"></div>
      </div>
    </div>
  </div>
);

export default function User() {
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

  const retryFetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/user?id=${id}`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError("Failed to load user profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <SkeletonLoader />
      </div>
    );
  }

  // Display UserNotFound component if the ID is invalid or the user is not found
  if (error || !user) {
    return <UserNotFound />;
  }

  return (
    <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>

      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          src={
            user.profilePicture ||
            "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
          }
          alt={`${user.name}'s profile`}
          className="object-cover object-center h-32"
          onError={(e) => {
            if (e.target.src.endsWith("/default-profile.jpg")) return; // Prevent infinite requests
            e.target.src = "/default-profile.jpg";
          }}
        />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold">{user.name}</h2>
        {user.occupation && <p className="text-gray-500">{user.occupation}</p>}
      </div>

      <div className="p-4 border-t mx-8 mt-2 flex justify-center">
        <div>
          {user.email && <p>Email: {user.email}</p>}
          {user.phone && <p>Phone: {user.phone}</p>}
        </div>
      </div>

      <div className="p-4 border-t mx-8 mt-2 flex justify-center">
        <div>{user.aboutMe && <p>About Me: {user.aboutMe}</p>}</div>
      </div>

      <div className="p-4 border-t mx-8 mt-2">
        <div className="mt-2 space-y-2">
          {links &&
            links.map((link) => (
              <div
                key={link._id}
                className="flex items-center justify-center w-full "
              >
                <button className="bg-white w-full text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                 
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                    </a>
                 
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="p-4 border-t mx-8 mt-2 flex justify-center">
        <Image
          text={`https://kakaw-ten.vercel.app/user/${user._id}`}
          options={{
            type: "image/jpeg",
            quality: 1,
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 200,
            color: {
              dark: "#000",
              light: "#FFFFFF",
            },
          }}
        />
      </div>
    </div>
  );
}
