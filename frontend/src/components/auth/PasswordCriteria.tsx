import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordCriteriaProps {
  password: string;
  className?: string;
}

const PasswordCriteria: React.FC<PasswordCriteriaProps> = ({ password, className = "" }) => {
  const criteria = [
    {
      label: "At least 8 characters long",
      test: (pwd: string) => pwd.length >= 8
    },
    {
      label: "Contains at least one uppercase letter",
      test: (pwd: string) => /[A-Z]/.test(pwd)
    },
    {
      label: "Contains at least one lowercase letter", 
      test: (pwd: string) => /[a-z]/.test(pwd)
    },
    {
      label: "Contains at least one number",
      test: (pwd: string) => /\d/.test(pwd)
    },
    {
      label: "Contains at least one special character (!@#$%^&*)",
      test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    }
  ];

  return (
    <div className={`mt-2 p-3 bg-gray-50 rounded-md border ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
      <ul className="space-y-1">
        {criteria.map((criterion, index) => {
          const isValid = criterion.test(password);
          return (
            <li key={index} className="flex items-center text-xs">
              {isValid ? (
                <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
              ) : (
                <X className="h-3 w-3 text-red-500 mr-2 flex-shrink-0" />
              )}
              <span className={isValid ? "text-green-700" : "text-red-600"}>
                {criterion.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className="flex items-center text-xs">
          <div className={`h-2 flex-1 rounded-full bg-gray-200 mr-2`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                criteria.filter(c => c.test(password)).length >= 4 
                  ? 'bg-green-500' 
                  : criteria.filter(c => c.test(password)).length >= 2 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`}
              style={{ 
                width: `${(criteria.filter(c => c.test(password)).length / criteria.length) * 100}%` 
              }}
            />
          </div>
          <span className={`font-medium ${
            criteria.filter(c => c.test(password)).length >= 4 
              ? 'text-green-700' 
              : criteria.filter(c => c.test(password)).length >= 2 
              ? 'text-yellow-700' 
              : 'text-red-600'
          }`}>
            {criteria.filter(c => c.test(password)).length >= 4 
              ? 'Strong' 
              : criteria.filter(c => c.test(password)).length >= 2 
              ? 'Medium' 
              : 'Weak'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordCriteria;
