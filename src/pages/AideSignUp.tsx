
import AuthLogoHeader from "@/components/auth/AuthLogoHeader";
import { Button } from "@/components/ui/button";

const AideSignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        <AuthLogoHeader />
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-center mb-2">
            Join ResearchWhao as a Research Aide
          </h2>
          <p className="text-center text-gray-700 font-semibold">
            Give Students the Right Academic Support at Every Step of their Research Journey
          </p>
          <p className="text-center text-gray-600 mb-6">
            Connect with students at all academic levels, give expert assistance, and elevate their thesis or dissertation.
          </p>
          {/* TODO: Add form fields and logic for aide signup */}
          <form className="space-y-6">
            {/* ...form fields would go here... */}
            <Button type="submit" className="w-full mt-2">
              Create My Research Aid Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AideSignUp;
