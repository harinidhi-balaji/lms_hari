import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, ThumbsUp, Flag, MoreVertical } from 'lucide-react';
import { coursesAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Discussion = ({ courseId }) => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadDiscussions();
  }, [courseId, sortBy]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getCourseDiscussions(courseId, { sortBy });
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error loading discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      const response = await coursesAPI.createDiscussion(courseId, {
        content: newQuestion
      });
      setDiscussions([response.data, ...discussions]);
      setNewQuestion('');
      toast.success('Question posted successfully!');
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error('Failed to post question');
    }
  };

  const handleReply = async (discussionId) => {
    if (!replyText.trim()) return;

    try {
      const response = await coursesAPI.replyToDiscussion(courseId, discussionId, {
        content: replyText
      });
      
      setDiscussions(discussions.map(d => 
        d.id === discussionId 
          ? { ...d, replies: [...d.replies, response.data] }
          : d
      ));
      
      setReplyText('');
      setReplyingTo(null);
      toast.success('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  const handleLike = async (discussionId, isReply = false) => {
    try {
      await coursesAPI.likeDiscussion(courseId, discussionId);
      
      setDiscussions(discussions.map(d => {
        if (!isReply && d.id === discussionId) {
          return { ...d, likes: d.likes + 1, isLiked: true };
        }
        if (isReply) {
          return {
            ...d,
            replies: d.replies.map(r => 
              r.id === discussionId
                ? { ...r, likes: r.likes + 1, isLiked: true }
                : r
            )
          };
        }
        return d;
      }));
    } catch (error) {
      console.error('Error liking discussion:', error);
      toast.error('Failed to like discussion');
    }
  };

  const handleReport = async (discussionId) => {
    try {
      await coursesAPI.reportDiscussion(courseId, discussionId);
      toast.success('Discussion reported successfully');
    } catch (error) {
      console.error('Error reporting discussion:', error);
      toast.error('Failed to report discussion');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Ask Question Form */}
      <form onSubmit={handleAskQuestion} className="space-y-4">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="input min-h-[100px]"
          required
        />
        <button type="submit" className="btn-primary">
          Post Question
        </button>
      </form>

      {/* Sort Options */}
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
        >
          <option value="recent">Most Recent</option>
          <option value="likes">Most Liked</option>
          <option value="replies">Most Discussed</option>
        </select>
      </div>

      {/* Discussions List */}
      <div className="space-y-6">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            {/* Question */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="font-medium text-gray-900">{discussion.userName}</div>
                  <span className="text-sm text-gray-500">
                    {new Date(discussion.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => handleReport(discussion.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
              <p className="text-gray-700">{discussion.content}</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleLike(discussion.id)}
                  className={`flex items-center space-x-1 text-sm ${
                    discussion.isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={discussion.isLiked}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{discussion.likes}</span>
                </button>
                <button
                  onClick={() => setReplyingTo(discussion.id)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{discussion.replies.length} replies</span>
                </button>
              </div>
            </div>

            {/* Reply Form */}
            {replyingTo === discussion.id && (
              <div className="pl-8 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  className="input min-h-[80px]"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleReply(discussion.id)}
                    className="btn-primary"
                  >
                    Post Reply
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {discussion.replies.length > 0 && (
              <div className="pl-8 space-y-4">
                {discussion.replies.map((reply) => (
                  <div key={reply.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900">{reply.userName}</div>
                        <span className="text-sm text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReport(reply.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Flag className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-700">{reply.content}</p>
                    <button
                      onClick={() => handleLike(reply.id, true)}
                      className={`flex items-center space-x-1 text-sm ${
                        reply.isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                      disabled={reply.isLiked}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>{reply.likes}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {discussions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600">
              Be the first to start a discussion about this course!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussion;
