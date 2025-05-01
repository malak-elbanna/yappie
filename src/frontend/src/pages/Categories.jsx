import React from 'react';
import { Link } from 'react-router-dom'; // ✅ make sure react-router-dom is installed
import category from '../assets/category.png';

const categories = [
  { name: 'Philosophy', color: 'bg-blue-900', icon: '🧠', image: category },
  { name: 'Classics', color: 'bg-purple-700', icon: '📖', image: category },
  { name: 'Romance', color: 'bg-pink-400', icon: '❤️', image: category },
  { name: 'Religion', color: 'bg-yellow-700', icon: '🕊️', image: category },
  { name: 'Adventure & Historical Fiction', color: 'bg-orange-700', icon: '⏳', image: category },
  { name: 'Travel & Exploration', color: 'bg-sky-500', icon: '🌍', image: category },
  { name: 'Fables', color: 'bg-gray-500', icon: '✍️', image: category },
  { name: 'Children', color: 'bg-green-700', icon: '🚀', image: category },
  { name: 'Comedy', color: 'bg-yellow-400', icon: '🎭', image: category },
  { name: 'Drama', color: 'bg-purple-700', icon: '📖', image: category },
  { name: 'Poetry', color: 'bg-purple-700', icon: '📖', image: category },
  { name: 'Fantasy', color: 'bg-purple-700', icon: '📖', image: category }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Browse all</h1>
        <p className="text-gray-400 mb-10">Choose the category you want to dive in</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={idx}
              className="block rounded-xl overflow-hidden relative h-40"
            >
              <div className={`relative h-full flex items-end p-4 ${category.color}`}>
                <div className="absolute inset-0 opacity-30">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="relative z-10 text-xl font-bold">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
