import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Certificate = ({ course, completionDate, studentName, onDownload }) => {
  const certificateRef = React.useRef();

  const downloadCertificate = async () => {
    try {
      const canvas = await html2canvas(certificateRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${course.title}-Certificate.pdf`);
      
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  return (
    <div className="p-4">
      <div 
        ref={certificateRef}
        className="relative w-[800px] h-[600px] mx-auto bg-white border-8 border-double border-gray-300 p-8"
      >
        <div className="absolute inset-0 bg-primary-50/20" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-serif text-gray-900 mb-8">Certificate of Completion</div>
          
          <div className="text-lg text-gray-600 mb-8">
            This is to certify that
          </div>
          
          <div className="text-3xl font-bold text-primary-600 mb-8">
            {studentName}
          </div>
          
          <div className="text-lg text-gray-600 mb-8">
            has successfully completed the course
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-8">
            {course.title}
          </div>
          
          <div className="text-lg text-gray-600 mb-8">
            on {new Date(completionDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          
          <div className="flex items-center justify-between w-full mt-12">
            <div className="text-center">
              <div className="w-40 h-px bg-gray-400 mb-2" />
              <div className="text-sm text-gray-600">Course Instructor</div>
              <div className="font-medium">{course.instructorName}</div>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-px bg-gray-400 mb-2" />
              <div className="text-sm text-gray-600">Platform Director</div>
              <div className="font-medium">LMS Director</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <button
          onClick={downloadCertificate}
          className="btn-primary"
        >
          Download Certificate (PDF)
        </button>
      </div>
    </div>
  );
};

export default Certificate;
