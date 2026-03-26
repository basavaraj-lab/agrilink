"use client";
import React, { useState } from 'react';
import { Image as ImageIcon, Video, Calendar, Type } from 'lucide-react';
import api from '../utils/api';

export default function CreatePost({ user, onPostCreated }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      // Extract hashtags using a simple regex
      const hashtags = text.match(/#[a-z0-9]+/gi)?.map(tag => tag.slice(1).toLowerCase()) || [];
      
      const res = await api.post('/posts', {
        text,
        hashtags
      });
      
      setText('');
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
          {user?.profileImage ? (
             <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-emerald-700 font-bold text-lg">{user?.name?.charAt(0) || 'U'}</span>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            rows="2"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Start a post, ${user?.name?.split(' ')[0] || 'User'}...`}
            className="w-full resize-none border-none outline-none focus:ring-0 bg-transparent text-slate-800 placeholder-slate-400 text-lg sm:text-base mb-2"
          ></textarea>
          
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-2">
            <div className="flex gap-2 sm:gap-4 text-slate-500">
              <button type="button" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <span className="hidden sm:inline">Media</span>
              </button>
              <button type="button" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                <Video className="w-5 h-5 text-emerald-500" />
                <span className="hidden sm:inline">Video</span>
              </button>
              <button type="button" className="flex items-center gap-2 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span className="hidden sm:inline">Event</span>
              </button>
            </div>
            <button 
              type="submit" 
              disabled={!text.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all disabled:opacity-50 shadow-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
