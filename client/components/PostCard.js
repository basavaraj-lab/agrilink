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
      <div className="mb-4 text-slate-800 leading-relaxed whitespace-pre-wrap">
        {post.text.split(/(#[a-z0-9_]+)/gi).map((part, i) => {
          if (part.match(/#[a-z0-9_]+/i)) {
            return <span key={i} className="text-blue-600 font-medium hover:underline cursor-pointer">{part}</span>;
          }
          return part;
        })}

        {post.image && (
          <div className="mt-4 rounded-xl overflow-hidden border border-slate-100 max-h-[500px]">
            <img src={post.image} alt="Post content" className="w-full h-full object-contain bg-slate-50" />
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
      <div className="flex justify-between items-center pt-1 overflow-x-auto gap-2">
        <button 
          onClick={handleLike}
          className={`flex items-center justify-center flex-1 min-w-[max-content] gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all ${isLiked ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium text-xs sm:text-sm">Like</span>
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center flex-1 min-w-[max-content] gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-xs sm:text-sm">Comment</span>
        </button>
        <button className="flex items-center justify-center flex-1 min-w-[max-content] gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all cursor-pointer hidden sm:flex">
          <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-medium text-xs sm:text-sm">Repost</span>
        </button>
        <a 
          href={`https://wa.me/918217469646?text=${encodeURIComponent('Hi! I am interested in your post on AgriLinked: "' + post.text.substring(0, 50) + '..."')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center flex-1 min-w-[max-content] gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
          <span className="font-bold text-xs sm:text-sm">Apply</span>
        </a>
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
