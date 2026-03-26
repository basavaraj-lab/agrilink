"use client";
import React, { useState } from 'react';
import { Heart, MessageSquare, Repeat, Send, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

export default function PostCard({ post, currentUserId, onLike, onComment }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const isLiked = post.likes?.includes(currentUserId);

  const handleLike = () => {
    if (onLike) onLike(post._id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (onComment) onComment(post._id, commentText);
    setCommentText('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 transition-all hover:shadow-md"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {post.author?.profileImage ? (
            <img src={post.author.profileImage} alt={post.author.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
              {post.author?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{post.author?.name || 'Unknown User'}</h4>
            <p className="text-xs text-slate-500 capitalize">{post.author?.role || 'User'}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{post.text}</p>
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.hashtags.map((tag, idx) => (
              <span key={idx} className="text-emerald-600 text-sm font-medium cursor-pointer hover:underline">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 max-h-96">
            <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-xs text-slate-500 mb-3 px-1 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1">
          <span className="bg-emerald-100 text-emerald-600 rounded-full p-0.5"><Heart className="w-3 h-3 fill-current" /></span>
          <span>{post.likes?.length || 0}</span>
        </div>
        <div>
          <span>{post.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-1">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${isLiked ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium text-sm">Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium text-sm">Comment</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer hidden sm:flex">
          <Repeat className="w-5 h-5" />
          <span className="font-medium text-sm">Repost</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer">
          <Send className="w-5 h-5" />
          <span className="font-medium text-sm">Send</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <form onSubmit={handleComment} className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button type="submit" disabled={!commentText.trim()} className="text-emerald-600 font-semibold text-sm disabled:opacity-50 pr-2">Post</button>
          </form>

          <div className="space-y-3">
            {post.comments?.map((comment, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                  {comment.user?.profileImage ? (
                    <img src={comment.user.profileImage} alt={comment.user.name} className="w-full h-full object-cover"/>
                  ) : null}
                </div>
                <div className="bg-slate-50 rounded-2xl rounded-tl-none p-3 flex-1 border border-slate-100">
                  <p className="font-bold text-slate-800 text-xs">{comment.user?.name || 'User'}</p>
                  <p className="text-slate-700 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
