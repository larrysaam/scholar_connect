
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import UnifiedSignupForm from '@/components/signup/UnifiedSignupForm';
import SignupHeader from '@/components/signup/SignupHeader';
import SignupFooter from '@/components/signup/SignupFooter';

const ConsolidatedSignup = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') as 'student' | 'expert' | 'aid' || 'student';

  const getHeaderContent = () => {
    switch (userType) {
      case 'expert':
        return {
          title: 'Join as an Expert',
          subtitle: 'Share your knowledge and help students excel in their research'
        };
      case 'aid':
        return {
          title: 'Join as a Research Aid',
          subtitle: 'Provide professional research assistance and grow your expertise'
        };
      default:
        return {
          title: 'Join as a Student',
          subtitle: 'Get expert help and accelerate your research journey'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <SignupHeader 
        title={headerContent.title}
        subtitle={headerContent.subtitle}
      />
      <main className="container mx-auto px-4 py-8">
        <UnifiedSignupForm defaultUserType={userType} />
      </main>
      <SignupFooter />
    </div>
  );
};

export default ConsolidatedSignup;
