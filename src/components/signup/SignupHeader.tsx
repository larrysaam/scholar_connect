
import React from 'react';

interface SignupHeaderProps {
  title: string;
  subtitle: string;
}

const SignupHeader = ({ title, subtitle }: SignupHeaderProps) => {
  return (
    <div className="text-center py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
};

export default SignupHeader;
