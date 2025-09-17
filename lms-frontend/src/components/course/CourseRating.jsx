import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const CourseRating = ({ courseId, initialRating, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await coursesAPI.submitReview(courseId, {
        rating,
        review
      });
      toast.success('Review submitted successfully!');
      if (onRatingSubmit) {
        onRatingSubmit({ rating, review });
      }
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`focus:outline-none ${
              (hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className="input min-h-[100px]"
          required
        />
        <button
          type="submit"
          disabled={!rating || isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default CourseRating;
