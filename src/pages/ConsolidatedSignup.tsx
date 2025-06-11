
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import UnifiedSignupForm from '@/components/signup/UnifiedSignupForm';
import SignupHeader from '@/components/signup/SignupHeader';
import SignupFooter from '@/components/signup/SignupFooter';

const ConsolidatedSignup = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') as 'student' | 'expert' | 'aid' || 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <SignupHeader />
      <main className="container mx-auto px-4 py-8">
        <UnifiedSignupForm defaultUserType={userType} />
      </main>
      <SignupFooter />
    </div>
  );
};

export default ConsolidatedSignup;
