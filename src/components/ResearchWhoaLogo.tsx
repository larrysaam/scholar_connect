
import React from 'react';

interface ResearchWhoaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const ResearchWhoaLogo = ({ size = 'md', showText = true, className = '' }: ResearchWhoaLogoProps) => {
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
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg`}>
        <svg viewBox="0 0 24 24" className="w-3/4 h-3/4 text-white" fill="currentColor">
          <path d="M12 2L13.09 6.26L18 4L16.74 9.09L22 10L17.26 12L22 14L16.74 14.91L18 20L13.09 17.74L12 22L10.91 17.74L6 20L7.26 14.91L2 14L6.74 12L2 10L7.26 9.09L6 4L10.91 6.26L12 2Z"/>
        </svg>
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Research<span className="text-blue-600">Whoa</span>
        </span>
      )}
    </div>
  );
};

export default ResearchWhoaLogo;
