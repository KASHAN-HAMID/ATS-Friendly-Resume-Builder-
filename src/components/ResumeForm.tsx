
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, X } from "lucide-react";
import { ResumeData, Experience, Education, Skill } from '../types/resume';

interface ResumeFormProps {
  data: ResumeData;
  onUpdate: (data: Partial<ResumeData>) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onUpdate }) => {
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({
      personalInfo: {
        ...data.personalInfo,
        [name]: value
      }
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      isPresent: false
    };
    
    onUpdate({
      experience: [...data.experience, newExperience]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    const updatedExperience = data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    
    onUpdate({ experience: updatedExperience });
  };

  const removeExperience = (id: string) => {
    onUpdate({
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      isPresent: false
    };
    
    onUpdate({
      education: [...data.education, newEducation]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    const updatedEducation = data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    
    onUpdate({ education: updatedEducation });
  };

  const removeEducation = (id: string) => {
    onUpdate({
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: ''
    };
    
    onUpdate({
      skills: [...data.skills, newSkill]
    });
  };

  const updateSkill = (id: string, value: string) => {
    const updatedSkills = data.skills.map(skill => 
      skill.id === id ? { ...skill, name: value } : skill
    );
    
    onUpdate({ skills: updatedSkills });
  };

  const removeSkill = (id: string) => {
    onUpdate({
      skills: data.skills.filter(skill => skill.id !== id)
    });
  };

  return (
    <div className="space-y-6 text-white">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={data.personalInfo.name}
                onChange={handlePersonalInfoChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={data.personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                name="phone"
                value={data.personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                name="location"
                value={data.personalInfo.location}
                onChange={handlePersonalInfoChange}
                className="bg-gray-700 border-gray-600"
                placeholder="City, State"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea 
              id="summary"
              name="summary"
              value={data.personalInfo.summary}
              onChange={handlePersonalInfoChange}
              className="bg-gray-700 border-gray-600"
              rows={3}
              placeholder="Write a brief professional summary (2-3 sentences)"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addExperience}
            className="border-gray-600 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.length === 0 && (
            <p className="text-center text-gray-400 py-4">No work experience added yet</p>
          )}
          
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="space-y-4 relative">
              {index > 0 && <Separator className="my-6 bg-gray-700" />}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 text-gray-400 hover:text-white"
                onClick={() => removeExperience(exp.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`company-${exp.id}`}>Company</Label>
                  <Input 
                    id={`company-${exp.id}`}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor={`position-${exp.id}`}>Position</Label>
                  <Input 
                    id={`position-${exp.id}`}
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`start-date-${exp.id}`}>Start Date</Label>
                  <Input 
                    id={`start-date-${exp.id}`}
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor={`end-date-${exp.id}`}>End Date</Label>
                  <Input 
                    id={`end-date-${exp.id}`}
                    type="month"
                    value={exp.isPresent ? '' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.isPresent}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="flex items-center justify-start pt-7">
                  <input 
                    type="checkbox" 
                    id={`present-${exp.id}`}
                    checked={exp.isPresent}
                    onChange={(e) => {
                      updateExperience(exp.id, 'isPresent', e.target.checked);
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`present-${exp.id}`}>Current Job</Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor={`description-${exp.id}`}>Job Description & Achievements</Label>
                <Textarea 
                  id={`description-${exp.id}`}
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  rows={3}
                  placeholder="Describe your responsibilities and achievements. Use action verbs and quantify results when possible."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addEducation}
            className="border-gray-600 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.education.length === 0 && (
            <p className="text-center text-gray-400 py-4">No education added yet</p>
          )}
          
          {data.education.map((edu, index) => (
            <div key={edu.id} className="space-y-4 relative">
              {index > 0 && <Separator className="my-6 bg-gray-700" />}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 text-gray-400 hover:text-white"
                onClick={() => removeEducation(edu.id)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
                  <Input 
                    id={`institution-${edu.id}`}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                  <Input 
                    id={`degree-${edu.id}`}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                <Input 
                  id={`field-${edu.id}`}
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  className="bg-gray-700 border-gray-600"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`edu-start-date-${edu.id}`}>Start Date</Label>
                  <Input 
                    id={`edu-start-date-${edu.id}`}
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor={`edu-end-date-${edu.id}`}>End Date</Label>
                  <Input 
                    id={`edu-end-date-${edu.id}`}
                    type="month"
                    value={edu.isPresent ? '' : edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                    disabled={edu.isPresent}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div className="flex items-center justify-start pt-7">
                  <input 
                    type="checkbox" 
                    id={`edu-present-${edu.id}`}
                    checked={edu.isPresent}
                    onChange={(e) => {
                      updateEducation(edu.id, 'isPresent', e.target.checked);
                    }}
                    className="mr-2"
                  />
                  <Label htmlFor={`edu-present-${edu.id}`}>In Progress</Label>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Skills</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addSkill}
            className="border-gray-600 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          {data.skills.length === 0 && (
            <p className="text-center text-gray-400 py-4">No skills added yet</p>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {data.skills.map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <Input 
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, e.target.value)}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Skill name"
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white"
                  onClick={() => removeSkill(skill.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;
