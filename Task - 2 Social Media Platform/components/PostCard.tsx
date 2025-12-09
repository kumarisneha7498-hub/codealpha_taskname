import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { Post, User } from '../types';
import { mockService } from '../services/mockBackend';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onUserClick: (username: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onUserClick }) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser.id));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const handleLike = async () => {
    // Optimistic UI update
    const previousIsLiked = isLiked;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await mockService.toggleLike(post.id, currentUser.id);
    } catch (error) {
      // Revert if failed
      setIsLiked(previousIsLiked);
      setLikeCount(prev => previousIsLiked ? prev + 1 : prev - 1);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await mockService.addComment(post.id, currentUser.id, commentText);
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center p-4">
        <img 
          src={post.user?.avatarUrl} 
          alt={post.user?.username} 
          className="w-10 h-10 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => post.user && onUserClick(post.user.username)}
        />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <span 
              className="font-semibold text-gray-900 cursor-pointer hover:underline"
              onClick={() => post.user && onUserClick(post.user.username)}
            >
              {post.user?.name}
            </span>
            <span className="mx-1 text-gray-500">·</span>
            <span className="text-gray-500 text-sm">{timeAgo(post.createdAt)}</span>
          </div>
          <p className="text-xs text-gray-500">@{post.user?.username}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>
      
      {post.imageUrl && (
        <div className="mt-2">
          <img src={post.imageUrl} alt="Post content" className="w-full object-cover max-h-[500px]" />
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 mt-2">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium text-sm">{likeCount > 0 ? likeCount : ''}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-medium text-sm">{comments.length > 0 ? comments.length : ''}</span>
          </button>

          <button className="text-gray-600 hover:text-gray-900 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto no-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img src={comment.user?.avatarUrl} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm text-gray-900">{comment.user?.username}</span>
                    <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && <p className="text-center text-gray-400 text-sm">No comments yet. Be the first!</p>}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex items-center space-x-3">
            <img src={currentUser.avatarUrl} alt="" className="w-8 h-8 rounded-full" />
            <div className="relative flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
              />
              <button 
                type="submit" 
                disabled={!commentText.trim() || isSubmittingComment}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary disabled:text-gray-300 hover:scale-110 transition-transform"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;
