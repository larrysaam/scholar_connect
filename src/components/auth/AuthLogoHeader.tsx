
import React from "react";
import { Link } from "react-router-dom";

const AuthLogoHeader = () => (
  <div className="flex flex-col items-center mb-6">
    <Link to="/" className="inline-flex items-center space-x-2 mb-2">
      <img 
        src="/lovable-uploads/a2f6a2f6-b795-4e93-914c-2b58648099ff.png" 
        alt="ResearchWhao" 
        className="w-10 h-10"
      />
      <span className="text-2xl font-extrabold text-blue-700">ResearchWhao</span>
    </Link>
  </div>
);

export default AuthLogoHeader;
