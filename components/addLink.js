import React, { useState } from "react";
import { toast } from 'react-hot-toast';




export default function AddLink({ setLinks }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
 
  const handleButtonClick = () => {
    toast.success('You did it!'); // Displays a success message
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    console.log("link:", { title, url });

    try {
      const response = await fetch("/api/auth/addLink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Adding Error:", errorData);
        setError(errorData.error || "An error occurred"); // Set error message
        return;
      }

      const data = await response.json();
      console.log("Link added successfully:", data);
      setLinks((prevInfo) => [...prevInfo, data.newLink]); // Correctly add new link
      setTitle('')
      setUrl('')
       // Trigger the toast message
     handleButtonClick()

     
    } catch (error) {
      console.error("Error adding link:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="For example: Facebook"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="website"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="For example: https://www.facebook.com/"
            required
          />
        </div>

        <button
          type="submit"
                className="bg-white w-full text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          Add
        </button>
      </form>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
     
    </>
  );
}
