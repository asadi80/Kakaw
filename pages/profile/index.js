import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import requireAuth from "../../utils/requireAuth";
import ProfilePictureUpload from "../../components/ProfilePictureUpload";
import "../../styles/globals.css";
import { useQRCode } from "next-qrcode";

import AddLink from "../../components/addLink";
import AboutMe from "../../components/aboutMe";

function Profile() {
  const router = useRouter();
  const { Image } = useQRCode();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
    occupation: "",
  });
  const [links, setLinks] = useState("");
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`/api/auth/profile?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log(data);

        if (res.ok) {
          setUser(data);
          setLinks(data.links);
          setImageUrl(data.profilePicture);
          setAboutMe(data.aboutMe);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            occupation: data.occupation || "",
            profilePicture: data.profilePicture || "",
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleEditField = (field) => {
    setEditingField(field);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleUpload = (imageUrl) => {
    setProfilePicture(imageUrl);
    setImageUrl(imageUrl); // Ensure both states are updated
    saveProfilePicture(imageUrl);
    console.log(imageUrl);
  };

  const saveProfilePicture = async (imageUrl) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    try {
      const res = await fetch(`/api/auth/profile?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePicture: imageUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile picture");
      }
    } catch (error) {
      console.error("Error saving profile picture:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("socialLinks.")) {
      const [parentKey, childKey] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSaveField = async (field) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    console.log(field);

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    try {
      let updateData = {};
      if (field.startsWith("socialLinks.")) {
        const [parentKey, childKey] = field.split(".");
        updateData = {
          [parentKey]: {
            [childKey]: formData[parentKey][childKey],
          },
        };
      } else {
        updateData = { [field]: formData[field] };
      }
      const res = await fetch(`/api/auth/profile?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditingField(null);
        setError("");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("An error occurred while updating your profile.");
    }
  };

  const handelDeleteLink = async (linkId) => {
    const userId = localStorage.getItem("userId");
    console.log("link id:", linkId, "user id", userId);

    try {
      const response = await fetch("/api/auth/deleteLink", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Adding Error:", errorData);
        setError(errorData.error || "An error occurred"); // Set error message
        return;
      }

      const data = await response.json();
      console.log("Link deleted successfully:", data);
      // Remove the deleted link from the state
      setLinks((prevLinks) => prevLinks.filter((link) => link._id !== linkId));
    } catch (error) {
      console.error("Error deleting link:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handelViewProfile = (id) => {
    router.push(`/user/${id}`);
  };

  if (loading)
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

  return (
    <div className=" max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-8 mb-8 bg-white shadow-xl rounded-lg text-gray-900">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
          alt="Mountain"
        />
      </div>
      {/* User info */}
      {user && (
        <>
          {/* --------------------------------------------- User image --------------------------------------------------------------------------*/}
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <ProfilePictureUpload
              onUpload={handleUpload}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
            />
          </div>
          {/* User name */}
          <div className="text-center mt-2">
            {editingField === "name" ? (
              <div className="flex items-center space-x-2 justify-center">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => handleSaveField("name")}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 justify-center">
                <h2 className="font-semibold">{user.name}</h2>
                <button
                  onClick={() => handleEditField("name")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {/* User occupation */}
          <div className="text-center mt-2">
            {editingField === "occupation" ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="border p-2 rounded"
                />
                <button
                  onClick={() => handleSaveField("occupation")}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="text-center mt-2">
                <p className="text-gray-500">{user.occupation}</p>
                <button
                  onClick={() => handleEditField("occupation")}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* -------------------------------------------------User Contact Information-----------------------------------------------------------------*/}
          <div className="p-4 border-t mx-8 mt-2 flex justify-center">
            <div className="p-4">
              <div className="mt-2 space-y-2">
                <div>
                  {editingField === "email" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border p-2 rounded"
                      />
                      <button
                        onClick={() => handleSaveField("email")}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p>Email: {user.email}</p>
                      <button
                        onClick={() => handleEditField("email")}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  {editingField === "phone" ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border p-2 rounded"
                      />
                      <button
                        onClick={() => handleSaveField("phone")}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p>Phone: {user.phone}</p>
                      <button
                        onClick={() => handleEditField("phone")}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* -------------------------------about me-------------------------------------------------------------- */}
      <div className="p-4 border-t mx-8 mt-2">
        <div className="mt-2 space-y-2">
          <AboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} />
        </div>
      </div>

      {/* -------------------------------User Social Media Links Add-------------------------------------------------------------- */}
      <div className="p-4 border-t mx-8 mt-2">
        <div className="mt-2 space-y-2">
          <AddLink setLinks={setLinks} />
        </div>
      </div>
      {/* -------------------------------User Social Media Links -------------------------------------------------------------- */}
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
                <button onClick={() => handelDeleteLink(link._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    color="#ed1212"
                    fill="none"
                  >
                    <path
                      d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.5 16.5L9.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.5 16.5L14.5 10.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
        </div>
      </div>
      {/* ----------------------------------------------------User QR code ------------------------------------------*/}
      <div className="p-4 border-t mx-8 mt-2 flex justify-center">
        <button onClick={() => handelViewProfile(user._id)}>
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
        </button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
    </div>
  );
}

export default requireAuth(Profile);
