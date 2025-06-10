import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <div className="bg-white p-2 rounded-lg">
                <img 
                  src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
                  alt="ResearchWhao Logo" 
                  className="h-8 w-8"
                />
              </div>
              <span className="text-xl font-bold text-white">ResearchWhao</span>
            </div>
            <p className="mt-3 text-sm">
              Connecting students with leading researchers for personalized academic consultations and collaborative research opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/researchers" className="text-sm hover:text-blue-400 transition-colors">Find Researchers</Link></li>
              <li><Link to="/research-aids" className="text-sm hover:text-blue-400 transition-colors">Research Aids</Link></li>
              <li><Link to="/co-author-workspace" className="text-sm hover:text-blue-400 transition-colors">Co-Author Workspace</Link></li>
              <li><Link to="/blogs" className="text-sm hover:text-blue-400 transition-colors">Blogs</Link></li>
              <li><Link to="/partnerships" className="text-sm hover:text-blue-400 transition-colors">Partnerships</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">1. Search for expert researchers</p>
              <p className="text-gray-400">2. Book personalized consultations</p>
              <p className="text-gray-400">3. Collaborate on research projects</p>
              <p className="text-gray-400">4. Get guidance and support</p>
            </div>
            <Link to="/register" className="inline-block mt-3 text-blue-400 hover:text-blue-300 transition-colors text-sm">
              Get Started →
            </Link>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support & Info</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm hover:text-blue-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="text-sm hover:text-blue-400 transition-colors">Log In</Link></li>
              <li><Link to="/dashboard" className="text-sm hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li>
                <a href="mailto:support@scholarconnect.com" className="text-sm hover:text-blue-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* About Us Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">About ResearchWhao</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Our Mission</h4>
                <p>To democratize access to research expertise, foster academic collaboration, and accelerate knowledge creation through innovative technology and community building.</p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Our Vision</h4>
                <p>To create a thriving academic ecosystem where knowledge flows freely, research barriers are eliminated, and every student has access to expert guidance regardless of their location or institution.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <img 
                src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
                alt="ResearchWhao Logo" 
                className="h-6 w-6"
              />
            </div>
            <p className="text-sm">© {new Date().getFullYear()} ResearchWhao. All rights reserved.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://facebook.com/scholarconnect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://twitter.com/scholarconnect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.232 8.232 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/scholarconnect" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="mailto:support@scholarconnect.com" className="text-gray-400 hover:text-blue-400" aria-label="Email">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
