
import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About ResearchWhao</h3>
              <p className="text-gray-400 text-sm">
                Connecting researchers with students and research aids worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Get Started</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="text-gray-400 hover:text-white">Sign In</Link></li>
                <li><Link to="/student-signup" className="text-gray-400 hover:text-white">Join as Student</Link></li>
                <li><Link to="/researcher-signup" className="text-gray-400 hover:text-white">Join as Researcher</Link></li>
                <li><Link to="/research-aid-signup" className="text-gray-400 hover:text-white">Join as Research Aid</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 ResearchWhoa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
