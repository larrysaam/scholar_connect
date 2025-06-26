
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

const JoinSection = () => {
  const userTypes = [
    {
      title: 'Students',
      description: 'Get expert guidance for your research projects and accelerate your academic journey.',
      icon: GraduationCap,
      link: '/student-signup',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Researchers',
      description: 'Share your expertise, mentor students, and earn income through consultations.',
      icon: BookOpen,
      link: '/researcher-signup', 
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Research Aids',
      description: 'Offer your research assistance services and help students with their projects.',
      icon: Users,
      link: '/research-aid-signup',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Join ResearchWhoa</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className={`w-16 h-16 rounded-full ${type.color} flex items-center justify-center mx-auto mb-4`}>
                  <type.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{type.title}</h3>
                <p className="text-gray-600 mb-6">{type.description}</p>
                <Link to={type.link}>
                  <Button className="w-full">Join as {type.title.slice(0, -1)}</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
