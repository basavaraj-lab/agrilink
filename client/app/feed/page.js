"use client";
import React, { useEffect, useState } from 'react';
import CreatePost from '../../components/CreatePost';
import PostCard from '../../components/PostCard';
import api from '../../utils/api';

export default function FeedPage({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts(posts.map(p => {
        if (p._id === postId) {
          return { ...p, likes: res.data };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map(p => {
        if (p._id === postId) {
          return { ...p, comments: res.data };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePost user={user} onPostCreated={handlePostCreated} />
      
      <div className="space-y-1">
        {posts.map(post => (
          <PostCard 
            key={post._id} 
            post={post} 
            currentUserId={user?._id}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        {posts.length === 0 && (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center text-slate-500 border border-slate-100">
            No posts found. Be the first to post something!
          </div>
        )}
      </div>
    </div>
  );
}
