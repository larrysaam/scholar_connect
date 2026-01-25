
import React from 'react';

interface ResearchWhoaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  color?: 'white' | 'black';
}

const ResearchWhoaLogo = ({ size = 'md', showText = true, className = '', color= 'white'}: ResearchWhoaLogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-3xl'
  };  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src="/researchwahoo.jpg" 
        alt="Research Wahoo Logo" 
        className={`${sizeClasses[size]} rounded-lg shadow-lg object-contain`}
      />
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]} notranslate`}>
          {color==='white'? <span className='text-white'>Research</span> : <span className="text-black-600">Research</span>}
          <span className="text-blue-600">Tandem</span>
        </span>
      )}
    </div>
  );
};

export default ResearchWhoaLogo;
