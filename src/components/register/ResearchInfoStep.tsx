
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepProps } from './types';

const ResearchInfoStep = ({ formData, onInputChange, onSelectChange, onMultiSelectChange, isLoading, onNext, onPrev }: StepProps) => {
  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="researchAreas">Research Areas</Label>
          <Select value={formData.researchAreas[0] || ""} onValueChange={(value) => onMultiSelectChange('researchAreas', [value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select research areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
              <SelectItem value="Biotechnology">Biotechnology</SelectItem>
              <SelectItem value="Climate Change">Climate Change</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="topicTitle">Topic Title</Label>
          <Input type="text" id="topicTitle" name="topicTitle" value={formData.topicTitle} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="researchStage">Research Stage</Label>
          <Input type="text" id="researchStage" name="researchStage" value={formData.researchStage} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studyLevel">Study Level</Label>
          <Select value={formData.studyLevel} onValueChange={(value) => onSelectChange('studyLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select study level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="masters">Masters</SelectItem>
              <SelectItem value="phd">PhD</SelectItem>
              <SelectItem value="postdoc">Postdoc</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select value={formData.sex} onValueChange={(value) => onSelectChange('sex', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={onInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="languages">Languages</Label>
          <Select value={formData.languages[0] || ""} onValueChange={(value) => onMultiSelectChange('languages', [value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select languages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="French">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={onPrev} disabled={isLoading}>
          Previous
        </Button>
        <Button onClick={onNext} disabled={isLoading}>
          {isLoading ? "Loading..." : "Next"}
        </Button>
      </div>
    </>
  );
};

export default ResearchInfoStep;
