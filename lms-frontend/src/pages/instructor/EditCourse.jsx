import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EditCourse = () => {
  return (
    <div className="space-y-6">
      <Link to="/instructor/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to My Courses
      </Link>

      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Edit Course Feature</h3>
        <p className="text-gray-600">This feature is under development</p>
      </div>
    </div>
  );
};

export default EditCourse;