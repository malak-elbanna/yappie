import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiUser, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { RiBookLine } from 'react-icons/ri';

const Navbar = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <RiBookLine className="text-purple-500 text-3xl" />
              <span className="ml-2 text-white text-xl font-bold">YAPPIE</span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className={`relative w-full ${isSearchFocused ? 'ring-2 ring-purple-500' : ''}`}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search for audiobooks..."
                className="w-full bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white p-2">
              <FiBell className="h-6 w-6" />
            </button>
            <button className="text-gray-300 hover:text-white p-2">
              <FiUser className="h-6 w-6" />
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium">
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {/* Mobile Search */}
            <div className="pt-2 pb-3">
              <div className={`relative ${isSearchFocused ? 'ring-2 ring-purple-500' : ''}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search for audiobooks..."
                  className="w-full bg-gray-800 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Mobile Navigation Items */}
            <div className="flex items-center justify-between">
              <button className="text-gray-300 hover:text-white p-2">
                <FiBell className="h-6 w-6" />
                <span className="ml-2 text-sm">Notifications</span>
              </button>
              <button className="text-gray-300 hover:text-white p-2">
                <FiUser className="h-6 w-6" />
                <span className="ml-2 text-sm">Profile</span>
              </button>
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-medium">
              Subscribe
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 