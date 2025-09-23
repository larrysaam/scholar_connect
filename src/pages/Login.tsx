
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import FormField from '@/components/auth/FormField';
import { useSecurityValidation } from '@/hooks/useSecurityValidation';
import { useEnhancedAuth } from '@/hooks/useEnhancedAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { validateFormData, validationErrors, clearValidationErrors } = useSecurityValidation();
  const { logSecurityEvent } = useEnhancedAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearValidationErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting on client side
    if (loginAttempts >= 5) {
      toast.error('Too many login attempts. Please wait before trying again.');
      logSecurityEvent(`Rate limited login attempt for ${formData.email}`);
      return;
    }

    // Validate form data
    if (!validateFormData(formData)) {
      return;
    }

    setLoading(true);
    setLoginAttempts(prev => prev + 1);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        logSecurityEvent(`Failed login: ${error.message}`);
        toast.error(error.message);
      } else {
        logSecurityEvent(`Successful login for ${formData.email}`);
        toast.success('Login successful!');
        
        // Reset login attempts on success
        setLoginAttempts(0);
        
        // Get user profile to determine redirect
        setTimeout(async () => {
          try {
            const { data: profile } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.user.id)
              .single();

            console.log('User profile:', profile);
            
            // Redirect based on user role
            if (profile?.role === 'admin') {
              navigate('/admin');
            } else if (profile?.role === 'expert') {
              navigate('/researcher-dashboard');
            } else if (profile?.role === 'aid') {
              navigate('/research-aids-dashboard');
            } else {
              navigate('/dashboard');
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (error) {
      logSecurityEvent(`Login system error: ${error.message}`);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!validateFormData({ email: formData.email })) {
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        logSecurityEvent(`Password reset failed for ${formData.email}: ${error.message}`);
        toast.error(error.message);
      } else {
        logSecurityEvent(`Password reset requested for ${formData.email}`);
        toast.success('Password reset email sent! Check your inbox.');
        setShowForgotPassword(false);
      }
    } catch (error) {
      logSecurityEvent(`Password reset error: ${error.message}`);
      toast.error('An error occurred while sending reset email');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        <AuthHeader
          title="Welcome to ResearchWhoa"
          subtitle="Sign in to your account to continue your research journey"
        />
        
        <Card>
          <CardHeader>
            {/* Security indicator */}
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded mb-4">
              <Shield className="h-4 w-4" />
              <span>Secure login with enhanced protection</span>
            </div>
            <h3 className="text-xl font-semibold text-center">
              {showForgotPassword ? 'Reset Password' : 'Sign In'}
            </h3>
          </CardHeader>
          <CardContent>
            {/* Rate limiting warning */}
            {loginAttempts >= 3 && (
              <Alert className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Multiple login attempts detected. {5 - loginAttempts} attempts remaining.
                </AlertDescription>
              </Alert>
            )}

            {/* Validation errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {validationErrors.map((error, index) => (
                    <div key={index}>{error.message}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {!showForgotPassword ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                />

                <FormField
                  label="Password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || loginAttempts >= 5} 
                  className="w-full"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Don't have an account?
                  </p>
                  <div className="space-x-2">
                    <a href="/student-signup" className="text-blue-600 hover:underline text-sm">
                      Student
                    </a>
                    <span className="text-gray-400">|</span>
                    <a href="/researcher-signup" className="text-blue-600 hover:underline text-sm">
                      Researcher
                    </a>
                    <span className="text-gray-400">|</span>
                    <a href="/research-aid-signup" className="text-blue-600 hover:underline text-sm">
                      Research Aid
                    </a>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <p className="text-sm text-gray-600 text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <FormField
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                />

                <div className="space-y-3">
                  <Button type="submit" disabled={resetLoading} className="w-full">
                    {resetLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
