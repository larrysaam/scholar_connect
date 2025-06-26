
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users, Star } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Expert Guidance',
      description: 'Get personalized help from experienced researchers in your field.',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Flexible Scheduling',
      description: 'Book consultations at times that work for your schedule.',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Collaborative Environment',
      description: 'Work together with experts and peers in a supportive community.',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Quality Assurance',
      description: 'All our experts are verified and rated by the community.',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose ResearchWhoa?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <benefit.icon className={`w-12 h-12 mx-auto mb-4 ${benefit.color}`} />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
