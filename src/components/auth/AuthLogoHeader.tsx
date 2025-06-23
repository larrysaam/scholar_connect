
import React from "react";
import { Link } from "react-router-dom";
import ResearchWhoaLogo from "../ResearchWhoaLogo";

const AuthLogoHeader = () => (
  <div className="flex flex-col items-center mb-6">
    <Link to="/" className="inline-flex items-center mb-2">
      <ResearchWhoaLogo size="lg" showText={true} />
    </Link>
  </div>
);

export default AuthLogoHeader;
