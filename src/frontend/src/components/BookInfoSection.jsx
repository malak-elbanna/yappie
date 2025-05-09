import React from 'react';
import { renderStars } from '../utils/StarRating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const BookInfoSection = ({ book, reviewSummary, isOffline, isAutoPlayEnabled, setIsAutoPlayEnabled, isFavorite, onToggleFavorite }) => { 
  return (
    <div className="md:col-span-1 lg:col-span-2">
      <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-2">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">{book.title}</h1>
          <button
            onClick={onToggleFavorite}
            className='text-purple-400 hover:text-purple-300 text-2xl transition ml-4'
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <p className="text-xl text-purple-400 mb-4">{book.author}</p>
        <p className="text-gray-300 mb-6 leading-relaxed">{book.description}</p>
        
        {reviewSummary && (
          <div className="flex items-center mb-4">
            {renderStars(reviewSummary.averageRating)}
            <span className="ml-3 text-xl font-bold">{reviewSummary.averageRating.toFixed(1)}</span>
            <span className="ml-2 text-gray-400">({reviewSummary.totalReviews} reviews)</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`p-4 rounded-xl flex-1 ${isOffline ? 'bg-red-900 bg-opacity-30' : 'bg-green-900 bg-opacity-30'}`}>
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
              <p className="font-medium">{isOffline ? 'Offline Mode' : 'Online Mode'}</p>
            </div>
            <p className="text-sm mt-1 text-gray-300">
              {isOffline 
                ? 'You can play downloaded chapters in offline mode.' 
                : 'Stream chapters online or download them for offline listening.'}
            </p>
          </div>
          
          <div className="p-4 rounded-xl flex-1 bg-purple-900 bg-opacity-30">
            <div className="flex items-center">
              <span className={`h-3 w-3 rounded-full mr-2 ${isAutoPlayEnabled ? 'bg-purple-500' : 'bg-gray-500'}`}></span>
              <p className="font-medium">Auto-Play</p>
              <label className="relative inline-flex items-center cursor-pointer ml-2">
                <input 
                  type="checkbox" 
                  checked={isAutoPlayEnabled}
                  onChange={() => setIsAutoPlayEnabled(!isAutoPlayEnabled)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-sm mt-1 text-gray-300">
              {isAutoPlayEnabled 
                ? 'Chapters will play automatically one after another.' 
                : 'Auto-play is disabled. Chapters must be played manually.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoSection;
