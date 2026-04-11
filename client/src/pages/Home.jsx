import React from 'react';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to South Sudanese eLearning</h1>
      <p className="text-lg mb-8">Learn and grow with interactive lessons tailored for South Sudanese education.</p>
      <a href="/subjects" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Start Learning</a>
    </div>
  );
};

export default Home;