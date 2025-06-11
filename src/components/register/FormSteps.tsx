
import React from 'react';
import BasicInfoStep from './BasicInfoStep';
import InstitutionInfoStep from './InstitutionInfoStep';
import ResearchInfoStep from './ResearchInfoStep';
import TermsStep from './TermsStep';
import { StepProps } from './types';

interface FormStepsProps extends StepProps {
  currentStep: number;
}

const FormSteps = ({ currentStep, ...stepProps }: FormStepsProps) => {
  switch (currentStep) {
    case 1:
      return <BasicInfoStep {...stepProps} />;
    case 2:
      return <InstitutionInfoStep {...stepProps} />;
    case 3:
      return <ResearchInfoStep {...stepProps} />;
    case 4:
      return <TermsStep {...stepProps} />;
    default:
      return <BasicInfoStep {...stepProps} />;
  }
};

export default FormSteps;
