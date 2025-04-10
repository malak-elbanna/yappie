import React from 'react';
import heroImage from '../assets/hero-image.jpg';

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Yappie</h1>
          <p className="text-xl">Your Modern Development Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 