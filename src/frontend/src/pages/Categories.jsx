import React from "react";

const Categories = () => {
  const categories = [
    { id: 1, name: "Children", description: "Books for young readers with magical and fun stories." },
    { id: 2, name: "Comedy", description: "Laugh out loud with these humorous books." },
    { id: 3, name: "Classic", description: "Timeless literature that has shaped the world." },
    { id: 4, name: "Romance", description: "Heartwarming tales of love and relationships." },
    { id: 5, name: "Adventure & Historical Fiction", description: "Explore imaginative and historical stories." },
    { id: 6, name: "Travel & Exploration", description: "Discover new places and cultures." },
    { id: 7, name: "Religion", description: "Books exploring faith, spirituality, and beliefs." },
    { id: 8, name: "Fables", description: "Stories with moral lessons and timeless wisdom." },
    { id: 9, name: "Philosophy", description: "Dive into the world of ideas and critical thinking." },
    { id: 10, name: "Fantasy", description: "Enter magical realms and epic adventures." },
    { id: 11, name: "Drama", description: "Engaging stories full of emotions and conflicts." },
    { id: 12, name: "Poetry", description: "Beautiful verses that touch the soul." },
    { id: 13, name: "Mathematics", description: "Books exploring the beauty of numbers and logic." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
              <p className="text-gray-400">{category.description}</p>
              <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;