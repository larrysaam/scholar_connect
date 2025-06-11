
import { Link } from "react-router-dom";

const SignupFooter = () => {
  return (
    <>
      <div className="text-center text-sm">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
          Sign in
        </Link>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to home
        </Link>
      </div>
    </>
  );
};

export default SignupFooter;
