"use client";
import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-black text-white flex flex-col items-center mt-2 p-10 h-[20vh]">
      {/* About Us Title */}
      <h1 className="text-4xl font-bold mb-4">About Us</h1>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Left: Contact Us */}
        <div className="flex flex-col items-start space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>John Doe: +1 234 567 890</p>
          <p>Jane Smith: +1 987 654 321</p>
          <p>Mark Davis: +1 456 789 012</p>
          <p>Emily Wilson: +1 321 654 987</p>
        </div>

        {/* Center: Office Locations */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold">Office Locations</h2>
          <p>Indore, India</p>
        </div>

        {/* Right: Raise Bug & Social Media */}
        <div className="flex flex-col items-end space-y-4">
          <h2 className="text-2xl font-semibold">Raise a Bug</h2>
          <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-500 transition duration-200">
            Report an Issue
          </button>

          <h2 className="text-2xl font-semibold mt-4">Follow Us</h2>
          <div className="space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
