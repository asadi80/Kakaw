import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
     <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          async
        />
      <h1 className="text-5xl font-bold mb-6">Welcome to the Cacao</h1>
      <p className="text-lg mb-8">Your social media platform to connect with friends.</p>
      <div className="flex space-x-4">
        <Link href="/signup">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">Sign Up</button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition">Login</button>
        </Link>
      </div>
    </div>
  );
}
