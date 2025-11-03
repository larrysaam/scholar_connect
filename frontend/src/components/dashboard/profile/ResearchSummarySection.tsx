
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ResearchSummaryData {
  level: string;
  customLevel: string;
  researchTitle: string;
  projectLocation: string;
  problemStatement: string;
  researchQuestions: string;
  objectives: string;
  hypotheses: string;
  methodology: string;
  comments: string;
}

interface ResearchSummarySectionProps {
  researchSummary: ResearchSummaryData;
  isEditing: boolean;
  onUpdate: (field: keyof ResearchSummaryData, value: string) => void;
}

const ResearchSummarySection = ({ researchSummary, isEditing, onUpdate }: ResearchSummarySectionProps) => {
  const levels = [
    "Post Doctorate",
    "PhD",
    "Master's",
    "Undergraduate", 
    "HND",
    "DIPES",
    "Other"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="level">Level</Label>
            <Select
              value={researchSummary.level}
              onValueChange={(value) => onUpdate('level', value)}
              disabled={!isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {researchSummary.level === "Other" && (
            <div>
              <Label htmlFor="customLevel">Custom Level</Label>
              <Input
                id="customLevel"
                value={researchSummary.customLevel}
                onChange={(e) => onUpdate('customLevel', e.target.value)}
                disabled={!isEditing}
                placeholder="Specify your level"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="researchTitle">Research Title</Label>
            <Input
              id="researchTitle"
              value={researchSummary.researchTitle}
              onChange={(e) => onUpdate('researchTitle', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <Label htmlFor="projectLocation">Project Location</Label>
            <Input
              id="projectLocation"
              value={researchSummary.projectLocation}
              onChange={(e) => onUpdate('projectLocation', e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="problemStatement">Problem Statement (Brief)</Label>
          <Textarea
            id="problemStatement"
            value={researchSummary.problemStatement}
            onChange={(e) => onUpdate('problemStatement', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="researchQuestions">Research Questions</Label>
          <Textarea
            id="researchQuestions"
            value={researchSummary.researchQuestions}
            onChange={(e) => onUpdate('researchQuestions', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="objectives">Objectives</Label>
          <Textarea
            id="objectives"
            value={researchSummary.objectives}
            onChange={(e) => onUpdate('objectives', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="hypotheses">Hypotheses</Label>
          <Textarea
            id="hypotheses"
            value={researchSummary.hypotheses}
            onChange={(e) => onUpdate('hypotheses', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="methodology">Methodology</Label>
          <Textarea
            id="methodology"
            value={researchSummary.methodology}
            onChange={(e) => onUpdate('methodology', e.target.value)}
            disabled={!isEditing}
            rows={4}
          />
        </div>
        
        <div>
          <Label htmlFor="comments">Comments</Label>
          <Textarea
            id="comments"
            value={researchSummary.comments}
            onChange={(e) => onUpdate('comments', e.target.value)}
            disabled={!isEditing}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchSummarySection;
