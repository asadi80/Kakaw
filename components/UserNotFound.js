// components/UserNotFound.js
import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">User Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The user you are looking for does not exist or the ID is invalid.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}