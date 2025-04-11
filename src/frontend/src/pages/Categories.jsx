import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/categories'); // Endpoint to fetch categories
        const data = await response.json();
        console.log('Fetched categories:', data); // Debugging log
        setCategories(data.categories); // Assuming the API returns { categories: [...] }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-gray-800 p-6 rounded-lg cursor-pointer hover:bg-gray-700"
            onClick={() => navigate(`/category/${category}`)} // Navigate to the books page for the selected category
          >
            <h2 className="text-lg font-bold">{category}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;