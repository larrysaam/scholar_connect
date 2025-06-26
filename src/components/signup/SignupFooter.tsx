
import React from 'react';
import { Link } from 'react-router-dom';

const SignupFooter = () => {
  return (
    <footer className="py-8 text-center">
      <p className="text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in here
        </Link>
      </p>
    </footer>
  );
};

export default SignupFooter;
