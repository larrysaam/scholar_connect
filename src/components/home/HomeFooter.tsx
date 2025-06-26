
import React from 'react';
import { Link } from 'react-router-dom';

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">ResearchWhoa</h3>
            <p className="text-gray-400">
              Accelerating research through expert collaboration and guidance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Students</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/researchers" className="hover:text-white">Find Researchers</Link></li>
              <li><Link to="/research-aids" className="hover:text-white">Find Research Aids</Link></li>
              <li><Link to="/student-signup" className="hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">For Experts</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/researcher-signup" className="hover:text-white">Join as Researcher</Link></li>
              <li><Link to="/research-aid-signup" className="hover:text-white">Join as Research Aid</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ResearchWhoa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
