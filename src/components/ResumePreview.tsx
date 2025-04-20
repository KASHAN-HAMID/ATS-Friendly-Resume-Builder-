
import React, { useRef } from 'react';
import { ResumeData } from '../types/resume';
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ResumePreviewProps {
  data: ResumeData;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (resumeRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = resumeRef.current.innerHTML;
      
      // Create a new window with just the resume content
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Resume</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 8.5in;
                height: 11in;
                margin: 0 auto;
                padding: 0.5in;
                box-sizing: border-box;
              }
              .resume {
                width: 100%;
                height: 100%;
                color: black;
                background-color: white;
              }
              h1, h2, h3, h4, h5, h6 {
                color: black;
                margin-top: 0.5rem;
                margin-bottom: 0.5rem;
              }
              h1 {
                font-size: 24px;
                text-align: center;
                margin-bottom: 0.3rem;
              }
              h2 {
                font-size: 18px;
                border-bottom: 1px solid black;
                padding-bottom: 0.2rem;
                margin-top: 0.8rem;
              }
              .contact-info {
                text-align: center;
                margin-bottom: 1rem;
                font-size: 12px;
              }
              .section {
                margin-bottom: 0.8rem;
              }
              .item {
                margin-bottom: 0.5rem;
              }
              .item-header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: 14px;
              }
              .item-subheader {
                display: flex;
                justify-content: space-between;
                font-style: italic;
                font-size: 12px;
              }
              .item-content {
                margin-top: 0.3rem;
                font-size: 12px;
              }
              .skills-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                font-size: 12px;
              }
              .skill-item {
                margin-right: 1rem;
              }
              .summary {
                font-size: 12px;
                margin-bottom: 1rem;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div class="resume">
              ${printContents}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      // Optimize canvas creation with reduced scale and quality
      const canvas = await html2canvas(resumeRef.current, {
        scale: 1.5, // Reduced from 2 to 1.5
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        onclone: (document) => {
          // Remove any unnecessary elements that might increase file size
          const clonedResume = document.querySelector('[data-html2canvas-clone-id]');
          const images = clonedResume?.querySelectorAll('img');
          if (images) {
            images.forEach(img => img.remove());
          }
        }
      });
      
      // Create a compressed JPEG image from the canvas
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality instead of PNG
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        compress: true // Enable PDF compression
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'JPEG', imgX, 0, imgWidth * ratio, imgHeight * ratio);
      
      // Set PDF properties for optimization
      pdf.setProperties({
        title: `${data.personalInfo.name} - Resume`,
        subject: 'Resume',
        creator: 'Resume Builder',
        producer: 'Resume Builder'
      });
      
      pdf.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Check if resume has content
  const hasContent = !!data.personalInfo.name 
    || !!data.personalInfo.email 
    || data.experience.length > 0 
    || data.education.length > 0 
    || data.skills.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-4">
        <Button 
          variant="secondary" 
          onClick={handlePrint}
          disabled={!hasContent}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button 
          variant="default" 
          onClick={handleDownloadPDF}
          disabled={!hasContent}
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      
      <div className="bg-white text-black p-8 shadow-lg max-w-[8.5in] mx-auto overflow-auto">
        <div ref={resumeRef} className="min-h-[11in] max-h-[11in] overflow-hidden" style={{ fontSize: '12px' }}>
          {!hasContent ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Start filling out your resume information to see a preview</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">{data.personalInfo.name || 'Your Name'}</h1>
                <div className="contact-info">
                  {[
                    data.personalInfo.email,
                    data.personalInfo.phone,
                    data.personalInfo.location
                  ].filter(Boolean).join(' • ')}
                </div>
              </div>
              
              {data.personalInfo.summary && (
                <div className="mb-4 summary">
                  <p>{data.personalInfo.summary}</p>
                </div>
              )}
              
              {data.experience.length > 0 && (
                <div className="section">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Professional Experience</h2>
                  {data.experience.map((exp) => (
                    <div key={exp.id} className="item mb-3">
                      <div className="item-header flex justify-between">
                        <span>{exp.position}</span>
                        <span>
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {exp.isPresent ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                        </span>
                      </div>
                      <div className="item-subheader">
                        <span>{exp.company}</span>
                      </div>
                      <div className="item-content mt-1">
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {data.education.length > 0 && (
                <div className="section">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Education</h2>
                  {data.education.map((edu) => (
                    <div key={edu.id} className="item mb-3">
                      <div className="item-header flex justify-between">
                        <span>{edu.degree} in {edu.field}</span>
                        <span>
                          {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {' - '}
                          {edu.isPresent ? 'Present' : (edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))}
                        </span>
                      </div>
                      <div className="item-subheader">
                        <span>{edu.institution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {data.skills.length > 0 && (
                <div className="section">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2">Skills</h2>
                  <div className="skills-list">
                    {data.skills.map((skill) => (
                      <span key={skill.id} className="skill-item">
                        • {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
