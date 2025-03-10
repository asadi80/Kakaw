import React, { useState } from "react";

export default function AboutMe({ aboutMe, setAboutMe }) {
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch("/api/auth/aboutMe", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aboutMe, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Adding Error:", errorData);
        setError(errorData.error || "An error occurred"); // Set error message
        return;
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding about me:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
            <label htmlFor="comment" className="sr-only">
              About me
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
              placeholder="Write a comment..."
              onChange={(e) => setAboutMe(e.target.value)}
              required
              value={aboutMe}
            ></textarea>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200">
            <button
              type="submit"
              className=" w-full text-gray-800 font-semibold py-2 px-4  rounded "
            >
              Update
            </button>
            <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2"></div>
          </div>
        </div>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </>
  );
}
