// pages/index.tsx
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

export default function Home() {
  return (
    <>
      <Head>
        <title>CACAO</title>
        <meta name="description" content="Your digital business card. Scan, connect, share." />
      </Head>

      <main className="min-h-screen bg-white text-gray-800">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 shadow-sm">
          <h1 className="text-xl font-bold">CACAO</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Your Business Card, Reimagined</h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl">
            Instantly share your contact info and social profiles with a single QR code.
          </p>
          <Link href="/signup" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-200 transition">
            Get Started Free
          </Link>
        </section>

        {/* QR Code Preview */}
        <section id="demo" className="py-16 px-6 flex flex-col items-center">
       
       
          <p className="text-gray-600 max-w-md text-center">
            Point your camera and instantly get my contact, LinkedIn, Instagram, and more. No app needed.
          </p>
        </section>

        {/* How It Works */}
        <section className="bg-gray-100 py-16 px-6">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Generate</h3>
              <p>Create your custom QR code linked to your profile.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Share</h3>
              <p>Print it, add it to your phone case, or share digitally.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">3. Connect</h3>
              <p>People scan it and instantly connect with you.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">Why Use a QR Business Card?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-xl shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Contactless</h3>
              <p>No physical cards. Just scan.</p>
            </div>
            <div className="p-6 rounded-xl shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Always Up to Date</h3>
              <p>Update your info without reprinting cards.</p>
            </div>
            <div className="p-6 rounded-xl shadow bg-white">
              <h3 className="text-lg font-semibold mb-2">Eco-Friendly</h3>
              <p>Go green. No paper waste.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 text-center">
          <p className="mb-4">© 2025 QRCard Inc. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          </div>
        </footer>
      </main>
    </>
  )
}
