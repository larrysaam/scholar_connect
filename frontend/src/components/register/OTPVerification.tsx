
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  formData: any;
  otpCode: string;
  setOtpCode: (code: string) => void;
  isLoading: boolean;
  onVerifyOTP: (e: React.FormEvent) => void;
  onResendOTP: () => void;
  onBackToRegistration: () => void;
}

const OTPVerification = ({
  formData,
  otpCode,
  setOtpCode,
  isLoading,
  onVerifyOTP,
  onResendOTP,
  onBackToRegistration
}: OTPVerificationProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 overflow-hidden">
              <img src="/lovable-uploads/3e478490-867e-47d2-9e44-aaef66cf715c.png" alt="ResearchTandem" className="w-full h-full object-contain"/>
            </div>
            <span className="text-2xl font-bold text-blue-600">ResearchTandem</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit code sent to {formData.email}
          </p>
        </div>

        <div className="bg-white p-8 shadow rounded-lg">
          <form onSubmit={onVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
                className="justify-center"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otpCode.length !== 6}>
              {isLoading ? "Verifying..." : "Verify and Create Account"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Didn't receive the code? </span>
              <button
                type="button"
                onClick={onResendOTP}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Resend
              </button>
            </div>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={onBackToRegistration}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
