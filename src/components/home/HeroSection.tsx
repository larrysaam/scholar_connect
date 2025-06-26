
import React from 'react';
import { Button } from '@/components/ui/button';
import GetStartedModal from '@/components/GetStartedModal';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Accelerate Your Research with Expert Guidance
        </h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Connect with experienced researchers and get personalized help with your academic projects, 
          from methodology to publication.
        </p>
        <GetStartedModal>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Today
          </Button>
        </GetStartedModal>
      </div>
    </section>
  );
};

export default HeroSection;
