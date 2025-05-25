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
                  alt="ScholarConnect Logo" 
                  className="h-8 w-8"
                />
              </div>
              <span className="text-xl font-bold text-white">ScholarConnect</span>
            </div>
            <p className="mt-3 text-sm">
              Connecting students with leading researchers for personalized academic consultations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/researchers" className="text-sm hover:text-blue-400 transition-colors">Find Researchers</Link></li>
              <li><Link to="/research-aides" className="text-sm hover:text-blue-400 transition-colors">Research Aids</Link></li>
              <li><Link to="/how-it-works" className="text-sm hover:text-blue-400 transition-colors">How It Works</Link></li>
              <li><Link to="/pricing" className="text-sm hover:text-blue-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Join Us</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-sm hover:text-blue-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="text-sm hover:text-blue-400 transition-colors">Log In</Link></li>
              <li><Link to="/become-researcher" className="text-sm hover:text-blue-400 transition-colors">Become a Researcher</Link></li>
              <li><Link to="/about-us" className="text-sm hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm hover:text-blue-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="text-sm hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg">
              <img 
                src="/lovable-uploads/83e0a07d-3527-4693-8172-d7d181156044.png" 
                alt="ScholarConnect Logo" 
                className="h-6 w-6"
              />
            </div>
            <p className="text-sm">© {new Date().getFullYear()} ScholarConnect. All rights reserved.</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.232 8.232 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="LinkedIn">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.02.43a5.49 5.49 0 00-1.99 1.295A5.49 5.49 0 00.735 3.717c-.226.5-.348 1.074-.382 2.021C.013 6.686 0 7.093 0 12.017s.013 5.331.048 6.279c.034.947.156 1.521.382 2.021a5.49 5.49 0 001.295 1.99 5.49 5.49 0 001.992 1.295c.5.226 1.074.348 2.021.382.948.035 1.355.048 6.279.048s5.331-.013 6.279-.048c.947-.034 1.521-.156 2.021-.382a5.49 5.49 0 001.99-1.295 5.49 5.49 0 001.295-1.99c.226-.5.348-1.074.382-2.021.035-.948.048-1.355.048-6.279s-.013-5.331-.048-6.279c-.034-.947-.156-1.521-.382-2.021a5.49 5.49 0 00-1.295-1.99A5.49 5.49 0 0018.997.43c-.5-.226-1.074-.348-2.021-.382C16.028.013 15.621 0 12.017 0zM12.017 2.163c3.204 0 3.584.012 4.85.07.847.038 1.17.16 1.446.272.524.204.898.449 1.292.843.394.394.639.768.843 1.292.112.276.234.599.272 1.446.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.038.847-.16 1.17-.272 1.446a3.331 3.331 0 01-.843 1.292 3.331 3.331 0 01-1.292.843c-.276.112-.599.234-1.446.272-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-.847-.038-1.17-.16-1.446-.272a3.331 3.331 0 01-.843-1.292 3.331 3.331 0 01-.843-1.292c-.112-.276-.234-.599-.272-1.446-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.038-.847.16-1.17.272-1.446.204-.524.449-.898.843-1.292a3.331 3.331 0 011.292-.843c.276-.112.599-.234 1.446-.272 1.266-.058 1.646-.07 4.85-.07z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM12.017 16a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
                <path d="M18.206 5.594a1.444 1.444 0 11-2.889 0 1.444 1.444 0 012.889 0z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="YouTube">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12L10 15V9l5.194 3z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400" aria-label="WhatsApp">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.488"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
