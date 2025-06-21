import jsPDF from 'jspdf';

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    professionalSummary: string;
    profileImageUrl?: string;
  };
  experiences: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    graduationYear: string;
    description?: string;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
}

export function exportToPDF(cvData: CVData, cvName: string = 'CV'): void {
  const pdf = new jsPDF();
  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.4));
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, y: number): number => {
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, margin, y);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);
    return y + 10;
  };

  // Header Section
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(cvData.personalInfo.fullName || 'Your Name', margin, yPosition);
  yPosition += 10;

  // Contact Information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location
  ].filter(Boolean).join(' | ');
  
  pdf.text(contactInfo, margin, yPosition);
  yPosition += 15;

  // Professional Summary
  if (cvData.personalInfo.professionalSummary) {
    yPosition = addSectionHeader('Professional Summary', yPosition);
    pdf.setFont('helvetica', 'normal');
    yPosition = addWrappedText(cvData.personalInfo.professionalSummary, margin, yPosition, contentWidth) + 10;
  }

  // Work Experience
  if (cvData.experiences.length > 0) {
    yPosition = addSectionHeader('Work Experience', yPosition);
    
    cvData.experiences.forEach((exp, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(exp.title, margin, yPosition);
      yPosition += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const companyInfo = `${exp.company}${exp.location ? ` | ${exp.location}` : ''}`;
      pdf.text(companyInfo, margin, yPosition);
      
      const dateRange = `${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}`;
      pdf.text(dateRange, pageWidth - margin - pdf.getTextWidth(dateRange), yPosition);
      yPosition += 8;

      if (exp.description) {
        // Split description into bullet points
        const bulletPoints = exp.description.split('\n').filter(line => line.trim());
        bulletPoints.forEach(point => {
          const cleanPoint = point.replace(/^[•\-\*]\s*/, '').trim();
          if (cleanPoint) {
            pdf.text('•', margin, yPosition);
            yPosition = addWrappedText(cleanPoint, margin + 8, yPosition, contentWidth - 8) + 2;
          }
        });
      }
      yPosition += 8;
    });
  }

  // Education
  if (cvData.education.length > 0) {
    // Check if we need a new page
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition = addSectionHeader('Education', yPosition);
    
    cvData.education.forEach((edu) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(edu.degree, margin, yPosition);
      yPosition += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      const eduInfo = `${edu.institution}${edu.location ? ` | ${edu.location}` : ''}`;
      pdf.text(eduInfo, margin, yPosition);
      pdf.text(edu.graduationYear, pageWidth - margin - pdf.getTextWidth(edu.graduationYear), yPosition);
      yPosition += 10;
    });
  }

  // Skills
  if (cvData.skills.length > 0) {
    // Check if we need a new page
    if (yPosition > 220) {
      pdf.addPage();
      yPosition = 20;
    }

    yPosition = addSectionHeader('Skills', yPosition);
    
    // Group skills by level
    const skillsByLevel = cvData.skills.reduce((acc, skill) => {
      if (!acc[skill.level]) acc[skill.level] = [];
      acc[skill.level].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByLevel).forEach(([level, skills]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`${level}:`, margin, yPosition);
      
      pdf.setFont('helvetica', 'normal');
      const skillsText = skills.join(', ');
      yPosition = addWrappedText(skillsText, margin + 40, yPosition, contentWidth - 40) + 5;
    });
  }

  // Save the PDF
  const fileName = `${cvName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cv.pdf`;
  pdf.save(fileName);
}