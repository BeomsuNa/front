import React from 'react';
import { Link } from 'react-router-dom';


const homePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800 font-pacifico">
              PhotoPolio AI
            </div>
            <div className="flex space-x-8">
              <div  className="text-gray-600 hover:text-gray-900 transition-colors">
              <Link to="/gallery">Gallery</Link>
              </div>
              <div className="text-gray-600 hover:text-gray-900 transition-colors">
                <Link to="/create">Create</Link>
              </div>
              <div  className="text-gray-600 hover:text-gray-900 transition-colors">
                <Link to="/about">About</Link>
              </div>
              <div className="text-gray-600 hover:text-gray-900 transition-colors">
                <Link to="/login">Login</Link>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
            AI-Powered Photo
            <span className="bg-gradient-to-l from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Portfolio
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your photography with artificial intelligence, generate gradient square themes
            and showcase your work like never before.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Start Creating
            </button>
            <button className="border border-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 whitespace-nowrap">
              View Gallery
            </button>
          </div>
          <div className='mt-16 flex justify-center'>
          <div className='grid grid-cols-2 grid-rows-2  justify-center items-center sm:grid-cols-2 lg:grid-cols-2 gap-6 '>
           {[1, 2, 3, 4].map((i) => (
  <div
    key={i}
    className="w-72 aspect-square bg-gray-200 rounded-lg border-2 border-dashed border-gray-300"
  />
))}       </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li>AI Theme Generator</li>
                <li>Portfolio Sharing</li>
                <li>Image Analytics</li>
                <li>Custom Domains</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Blog</li>
                <li>Docs</li>
                <li>Support</li>
                <li>API</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 PhotoPolio AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default homePage;
