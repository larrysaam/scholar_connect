import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuthActions } from '@/hooks/auth/useAuthActions';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthActions();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const userData = {
        fullName: 'Admin',
        role: 'admin',
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Admin account created successfully! Please sign in to continue.',
        });
        navigate('/admin/login');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to create admin account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;