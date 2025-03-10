"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

export default function ProfilePictureUpload({
  onUpload,
  imageUrl,
  setImageUrl,
}) {
  const [error, setError] = useState("");

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    setError("Failed to upload image. Please try again.");
  };

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={(result) => {
        const url = result.info.secure_url; // Get the uploaded image URL
        setImageUrl(url); // Update the image URL state
        onUpload?.(url); // Call the callback with the new URL
      }}
      onError={handleUploadError}
    >
      {({ open }) => (
        <div>
          <button
            onClick={() => open()}
            aria-label="Upload profile picture"
          >
            <img
              src={imageUrl || "https://img.icons8.com/?size=100&id=tZuAOUGm9AuS&format=png&color=000000"} // Fallback image if no imageUrl is provided
              alt="Profile"
              className="object-cover object-center h-32"
            />
          </button>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </div>
      )}
    </CldUploadWidget>
  );
}