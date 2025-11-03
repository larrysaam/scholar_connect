
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Briefcase } from 'lucide-react';

interface GetStartedModalProps {
  children: React.ReactNode;
}

const GetStartedModal = ({ children }: GetStartedModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-2">Join ResearchTandem</DialogTitle>
          <p className="text-center text-gray-600">Choose how you'd like to get started</p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Student</CardTitle>
              <CardDescription>
                Get expert help and guidance for your research projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student-signup" onClick={() => setOpen(false)}>
                <Button className="w-full">Join as Student</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Researcher</CardTitle>
              <CardDescription>
                Share your expertise and earn additional income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/researcher-signup" onClick={() => setOpen(false)}>
                <Button className="w-full">Join as Researcher</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Research Aid</CardTitle>
              <CardDescription>
                Provide professional research assistance services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/research-aid-signup" onClick={() => setOpen(false)}>
                <Button className="w-full">Join as Research Aid</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetStartedModal;
