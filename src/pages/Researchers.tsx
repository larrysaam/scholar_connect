
import React from 'react';
import Navbar from '@/components/Navbar';

const Researchers = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Find Researchers</h1>
        <p className="text-center text-gray-600">Browse and connect with expert researchers in your field.</p>
      </div>
    </div>
  );
};

export default Researchers;
