
import { Link } from "react-router-dom";

interface SignupHeaderProps {
  title: string;
  subtitle: string;
}

const SignupHeader = ({ title, subtitle }: SignupHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center space-x-2">
        <img 
          src="/lovable-uploads/3e478490-867e-47d2-9e44-aaef66cf715c.png" 
          alt="ResearchWow" 
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-blue-600">ResearchWow</span>
      </Link>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default SignupHeader;
