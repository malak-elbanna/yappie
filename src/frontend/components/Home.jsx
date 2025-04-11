import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="flex gap-2">
        <Link to="/category/popular">
          <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
            Popular
          </button>
        </Link>
        <Link to="/category/new-releases">
          <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
            New Releases
          </button>
        </Link>
        <Link to="/category/trending">
          <button className="px-4 py-2 text-sm bg-gray-800 text-white rounded-full hover:bg-gray-700">
            Trending
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;