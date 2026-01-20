"use client";

import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin, Twitter, QrCode, Leaf, RefreshCw, UserPlus } from 'lucide-react';
export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <QrCode className="text-2xl text-blue-400" size={28} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">KAKAW</h1>
          </div>
          <div className="flex items-center space-x-4">
             <a href="/login">
            <button className="text-white/90 hover:text-white transition px-4 py-2">Login</button>
             </a>
            <a href="/signup">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:scale-105 transition-transform font-semibold shadow-lg shadow-blue-500/50">
              Sign Up
            </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-6 inline-block animate-bounce">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-purple-500/50">
              <QrCode className="text-white" size={64} />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Your Business Card,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-white/80 leading-relaxed">
            Instantly share your contact info and social profiles with a single scan. No app needed, no friction—just connection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/signup">
            <button className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full hover:scale-105 transition-all font-semibold text-lg shadow-2xl shadow-purple-500/50 flex items-center space-x-2">
              <span>Get Started Free</span>
              <UserPlus className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            </a>
            {/* <button className="border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/10 transition-all font-semibold text-lg">
              See Demo
            </button> */}
          </div>
        </div>

        {/* Floating QR Code Preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-48 h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center">
                <div className="grid grid-cols-5 gap-1 p-2">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}></div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-4 text-white/70 text-sm">Scan to connect instantly</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <QrCode size={32} />, title: '1. Generate', desc: 'Create your custom QR code linked to your profile in seconds', color: 'from-blue-500 to-cyan-500' },
              { icon: <RefreshCw size={32} />, title: '2. Share', desc: 'Print it, add it to your phone case, or share digitally anywhere', color: 'from-purple-500 to-pink-500' },
              { icon: <UserPlus size={32} />, title: '3. Connect', desc: 'People scan and instantly connect with all your platforms', color: 'from-pink-500 to-red-500' }
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" style={{background: `linear-gradient(to right, ${step.color})`}}></div>
                <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all hover:scale-105 duration-300">
                  <div className={`bg-gradient-to-r ${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Choose KAKAW?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <QrCode size={28} />, title: 'Contactless', desc: 'No physical cards needed. Just one quick scan and you\'re connected.', gradient: 'from-blue-500 to-cyan-500' },
              { icon: <RefreshCw size={28} />, title: 'Always Current', desc: 'Update your info anytime without reprinting expensive business cards.', gradient: 'from-purple-500 to-pink-500' },
              { icon: <Leaf size={28} />, title: 'Eco-Friendly', desc: 'Go green and sustainable. Eliminate paper waste completely.', gradient: 'from-green-500 to-emerald-500' }
            ].map((feature, i) => (
              <div key={i} className="group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{background: `linear-gradient(to bottom right, ${feature.gradient})`}}></div>
                <div className="relative bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all h-full">
                  <div className={`bg-gradient-to-r ${feature.gradient} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-3xl">
            <div className="bg-slate-900 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Networking?</h2>
              <p className="text-xl text-white/80 mb-8">Join thousands who've ditched outdated paper cards</p>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-10 py-4 rounded-full hover:scale-105 transition-all font-semibold text-lg shadow-2xl shadow-purple-500/50">
                Create Your Card Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-6 mb-6">
            {[
              { icon: <Instagram size={24} />, href: 'https://instagram.com' },
              { icon: <Linkedin size={24} />, href: 'https://linkedin.com' },
              { icon: <Twitter size={24} />, href: 'https://twitter.com' }
            ].map((social, i) => (
              <a key={i} href={social.href} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all">
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-white/60">© 2025 KAKAW Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}