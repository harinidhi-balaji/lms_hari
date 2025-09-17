import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, Clock, Target, Award } from 'lucide-react';
import { coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const LearningPath = ({ category }) => {
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  useEffect(() => {
    loadLearningPath();
  }, [category]);

  const loadLearningPath = async () => {
    try {
      setLoading(true);
      const [pathResponse, enrollmentsResponse] = await Promise.all([
        coursesAPI.getLearningPath(category),
        coursesAPI.getMyEnrollments({ page: 0, size: 100 })
      ]);

      setPathData(pathResponse.data);
      setEnrolledCourses(new Set(enrollmentsResponse.data.content.map(e => e.courseId)));
    } catch (error) {
      console.error('Error loading learning path:', error);
      toast.error('Failed to load learning path');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!pathData) return null;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2">{pathData.title}</h2>
        <p className="text-primary-100">{pathData.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary-200" />
            <span>{pathData.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary-200" />
            <span>{pathData.difficulty} Level</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-primary-200" />
            <span>{pathData.courses.length} Courses</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {pathData.stages.map((stage, stageIndex) => (
          <div key={stageIndex} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Stage {stageIndex + 1}: {stage.title}
              </h3>
              <p className="text-gray-600">{stage.description}</p>
            </div>

            <div className="divide-y">
              {stage.courses.map((course, courseIndex) => (
                <div
                  key={course.id}
                  className={`p-4 ${
                    enrolledCourses.has(course.id)
                      ? 'bg-green-50'
                      : courseIndex === 0 || enrolledCourses.has(stage.courses[courseIndex - 1]?.id)
                      ? 'bg-white'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        enrolledCourses.has(course.id)
                          ? 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {enrolledCourses.has(course.id) ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Target className="h-5 w-5 text-gray-600" />
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">{course.description}</p>
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className={`btn ${
                        enrolledCourses.has(course.id)
                          ? 'btn-secondary'
                          : courseIndex === 0 || enrolledCourses.has(stage.courses[courseIndex - 1]?.id)
                          ? 'btn-primary'
                          : 'btn-disabled'
                      }`}
                    >
                      {enrolledCourses.has(course.id)
                        ? 'Continue'
                        : courseIndex === 0 || enrolledCourses.has(stage.courses[courseIndex - 1]?.id)
                        ? 'Start Course'
                        : 'Locked'}
                    </Link>
                  </div>

                  {course.skills && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-700">Skills you'll learn:</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {course.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;
