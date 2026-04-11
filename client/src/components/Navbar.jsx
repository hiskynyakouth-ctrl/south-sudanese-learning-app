import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">South Sudanese eLearning</Link>
        <div className="space-x-4">
          <Link to="/subjects" className="hover:underline">Subjects</Link>
          <Link to="/chat" className="hover:underline">Chat AI</Link>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;