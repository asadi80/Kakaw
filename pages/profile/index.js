"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { QRCodeCanvas } from "qrcode.react";

import {
  Mail,
  Phone,
  User,
  Edit2,
  Save,
  X,
  Trash2,
  Plus,
  Camera,
  Loader,
  Upload,
  QrCode,
  Link as LinkIcon,
  Briefcase,
  Info,
} from "lucide-react";
import "../../styles/globals.css";

// Mock ProfilePictureUpload component
const ProfilePictureUpload = ({ imageUrl, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      setShowModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);

    try {
      const response = await fetch(preview);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const data = await uploadResponse.json();

      // ✅ parent controls state
      onUpload?.(data.secure_url);

      setShowModal(false);
      setPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Profile Image Button */}
      <div className="relative w-full h-full group">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="relative w-full h-full rounded-full overflow-hidden"
          aria-label="Upload profile picture"
        >
          <img
            src={
              imageUrl ||
              "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"
            }
            alt="Profile"
            className="object-cover w-full h-full"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Camera className="text-white" size={28} />
          </div>
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30"></div>

            <div className="relative bg-slate-900 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">
                  Upload Profile Picture
                </h3>
                <button
                  onClick={handleCancel}
                  disabled={uploading}
                  className="text-white/80 hover:text-white transition disabled:opacity-50"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Preview */}
              <div className="p-6">
                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 mb-6">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium flex items-center justify-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={20} />
                        <span>Upload</span>
                      </>
                    )}
                  </button>
                </div>

                {/* File Info */}
                <p className="text-white/40 text-xs text-center mt-4">
                  Maximum file size: 5MB • Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mock AddLink component
const AddLink = ({ setLinks }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = async () => {
    if (!title || !url) return;

    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("/api/auth/addLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      setLinks((prev) => [...prev, data.newLink]);
      setTitle("");
      setUrl("");
      setIsOpen(false);
    } catch (err) {
      console.error("Error adding link:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-all shadow-lg flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Link</span>
        </button>
      ) : (
        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
          <input
            type="text"
            placeholder="Link Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Add
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock AboutMe component
const AboutMe = ({ aboutMe, setAboutMe }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(aboutMe || "");
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("About Me cannot be empty");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("/api/auth/aboutMe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutMe: text, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      setAboutMe(data.aboutMe ?? text);

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating about me:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <Info size={18} />
          <span>About Me</span>
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-400 hover:text-blue-300"
          >
            <Edit2 size={18} />
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center space-x-1"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center space-x-1"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/70">{aboutMe || "No bio added yet"}</p>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
  });
  const [links, setLinks] = useState([]);
  const [aboutMe, setAboutMe] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
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
          setLinks(data.links || []);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveField = async (field) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
      return;
    }

    const updateData = {
      [field]: formData[field],
    };

    try {
      const res = await fetch(`/api/auth/profile?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile");
        return;
      }

      // Update UI with DB response
      setUser(data);
      setEditingField(null);
      setError("");
    } catch (err) {
      console.error("Update error:", err);
      setError("Something went wrong");
    }
  };

  const handleProfilePictureSave = async (url) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) return;

    try {
      const res = await fetch(`/api/auth/profile?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profilePicture: url }),
      });

      const data = await res.json();
      if (res.ok) setUser(data);
    } catch (err) {
      console.error("Profile picture save failed:", err);
    }
  };

  const handleDeleteLink = async (linkId) => {
    const userId = localStorage.getItem("userId");

    try {
      const res = await fetch("/api/auth/deleteLink", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, userId }),
      });

      if (!res.ok) return;

      setLinks((prev) => prev.filter((link) => link._id !== linkId));
    } catch (err) {
      console.error("Delete link failed:", err);
    }
  };

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
            <div className="px-8 -mt-16 mb-6">
              <div className="w-32 h-32 border-4 border-white/20 rounded-full overflow-hidden shadow-xl">
                <ProfilePictureUpload
                  imageUrl={imageUrl}
                  onUpload={(url) => {
                    setImageUrl(url);
                    handleProfilePictureSave(url);
                  }}
                />
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-8 pb-8 space-y-6">
              {/* Name */}
              <div>
                {editingField === "name" ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSaveField("name")}
                      className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                    >
                      <Save className="text-white" size={20} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                    >
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">
                      {user.name}
                    </h2>
                    <button
                      onClick={() => handleEditField("name")}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Occupation */}
              <div>
                {editingField === "occupation" ? (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="text-white/40" size={20} />
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleSaveField("occupation")}
                      className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                    >
                      <Save className="text-white" size={20} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                    >
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white/70">
                      <Briefcase size={20} />
                      <span>{user.occupation}</span>
                    </div>
                    <button
                      onClick={() => handleEditField("occupation")}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                {/* Email */}
                <div>
                  {editingField === "email" ? (
                    <div className="flex items-center space-x-2">
                      <Mail className="text-white/40" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSaveField("email")}
                        className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                      >
                        <Save className="text-white" size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                      >
                        <X className="text-white" size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-white/70">
                        <Mail size={20} />
                        <span>{user.email}</span>
                      </div>
                      <button
                        onClick={() => handleEditField("email")}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  {editingField === "phone" ? (
                    <div className="flex items-center space-x-2">
                      <Phone className="text-white/40" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSaveField("phone")}
                        className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                      >
                        <Save className="text-white" size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
                      >
                        <X className="text-white" size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-white/70">
                        <Phone size={20} />
                        <span>{user.phone}</span>
                      </div>
                      <button
                        onClick={() => handleEditField("phone")}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* About Me */}
              <div className="pt-4 border-t border-white/10">
                <AboutMe aboutMe={aboutMe} setAboutMe={setAboutMe} />
              </div>

              {/* Add Link */}
              <div className="pt-4 border-t border-white/10">
                <AddLink setLinks={setLinks} />
              </div>

              {/* Links List */}
              {links.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h3 className="text-white font-semibold flex items-center space-x-2">
                    <LinkIcon size={18} />
                    <span>My Links</span>
                  </h3>
                  {links.map((link) => (
                    <div key={link._id} className="flex items-center space-x-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white hover:bg-white/10 transition text-center font-medium"
                      >
                        {link.title}
                      </a>
                      <button
                        onClick={() => handleDeleteLink(link._id)}
                        className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition"
                      >
                        <Trash2 className="text-red-400" size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* QR Code */}
              <div className="pt-6 border-t border-white/10 flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-2xl">
                  <div className="w-48 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                    {/* <QrCode 
                    className="text-white" size={128} 
                   
                    /> */}
                    <QRCodeCanvas
                      value={`https://kakaw-ten.vercel.app/user/${user._id}`}
                      size={128}
                    />
                  </div>
                </div>
                <p className="text-white/60 text-sm text-center">
                  Scan to view profile
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
