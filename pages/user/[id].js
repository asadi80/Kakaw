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
      <div role="status" className="flex flex-row min-h-screen justify-center items-center">
        <svg
          aria-hidden="true"
          class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
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
