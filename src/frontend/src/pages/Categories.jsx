import React from 'react';
import { Link } from 'react-router-dom';
import philosophy from '../assets/philosophy.jpg';
import classics from '../assets/classics.jpg';
import romance from '../assets/romance.jpg';
import religion from '../assets/religion.jpg';
import adventure from '../assets/adventure.jpg';
import travel from '../assets/travel.jpg';
import fable from '../assets/fables.jpg';
import children from '../assets/children.jpg';
import comedy from '../assets/comedy.jpg';
import drama from '../assets/drama.jpg';
import poetry from '../assets/poetry.jpg';
import fantasy from '../assets/fantasy.jpg';

const categories = [
  { name: 'Philosophy', color: 'from-gray-800 to-gray-900', icon: '🧠', image: philosophy },
  { name: 'Classics', color: 'from-gray-700 to-gray-800', icon: '📖', image: classics },
  { name: 'Romance', color: 'from-red-900 to-red-800', icon: '❤️', image: romance },
  { name: 'Religion', color: 'from-yellow-800 to-yellow-900', icon: '🕊️', image: religion },
  { name: 'Adventure & Historical Fiction', color: 'from-green-800 to-green-900', icon: '⏳', image: adventure },
  { name: 'Travel & Exploration', color: 'from-sky-800 to-sky-900', icon: '🌍', image: travel },
  { name: 'Fables', color: 'from-gray-700 to-gray-800', icon: '✍️', image: fable },
  { name: 'Children', color: 'from-blue-700 to-blue-800', icon: '🚀', image: children },
  { name: 'Comedy', color: 'from-yellow-700 to-yellow-800', icon: '🎭', image: comedy },
  { name: 'Drama', color: 'from-purple-800 to-purple-900', icon: '🎬', image: drama },
  { name: 'Poetry', color: 'from-indigo-800 to-indigo-900', icon: '📝', image: poetry },
  { name: 'Fantasy', color: 'from-purple-700 to-purple-800', icon: '🔮', image: fantasy }
];

const Categories = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-x-hidden">
      {/* Decorative blurred circle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-4">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            Browse Categories
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Choose the literary world you want to dive into and explore
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, idx) => (
            <Link
              to={`/category/${encodeURIComponent(category.name)}`}
              key={idx}
              className="group relative bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-pink-600 transition duration-300 h-48"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                />
              </div>
              
              <div className="relative h-full w-full flex flex-col items-center justify-center p-4 transition-all group-hover:scale-105 duration-300">
                <span className="text-3xl mb-2">{category.icon}</span>
                <h2 className="text-xl font-bold text-center">
                  {category.name}
                </h2>
              </div>
              
              <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-pink-600 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
