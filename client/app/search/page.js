"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search as SearchIcon, Briefcase, FileText, Users } from 'lucide-react';
import api from '../../utils/api';
import PostCard from '../../components/PostCard';
import { Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(rawQuery);
  const [results, setResults] = useState({ users: [], posts: [], jobs: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (rawQuery) {
      handleSearch(rawQuery);
    }
  }, [rawQuery]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${searchQuery}`);
      setResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100">
        <form onSubmit={onSubmit} className="relative">
          <SearchIcon className="w-6 h-6 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for people, jobs, or posts..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-sm">
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && (results.users.length > 0 || results.posts.length > 0 || results.jobs.length > 0) && (
        <div className="flex gap-2 overflow-x-auto pb-4">
          <button onClick={() => setActiveTab('all')} className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>All Results</button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'users' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
            <Users className="w-4 h-4" /> People ({results.users.length})
          </button>
          <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'posts' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
            <FileText className="w-4 h-4" /> Posts ({results.posts.length})
          </button>
          <button onClick={() => setActiveTab('jobs')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-colors ${activeTab === 'jobs' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
            <Briefcase className="w-4 h-4" /> Jobs ({results.jobs.length})
          </button>
        </div>
      )}

      {/* Results View */}
      {!loading && (
        <div className="space-y-8">
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <div>
               <h3 className="font-bold text-slate-900 font-heading text-xl mb-4 border-b border-slate-100 pb-2">People</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {results.users.map(user => (
                   <div key={user._id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm group hover:border-emerald-200 transition-colors">
                     <div className="w-16 h-16 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center font-bold text-2xl text-emerald-700">
                        {user.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                       <h4 className="font-bold text-slate-900 truncate">{user.name}</h4>
                       <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                       <div className="flex gap-2 mt-2">
                         <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">⭐ {user.profile?.rating || 0}</span>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
            <div>
               <h3 className="font-bold text-slate-900 font-heading text-xl mb-4 border-b border-slate-100 pb-2">Posts</h3>
               <div className="space-y-4">
                 {results.posts.map(post => (
                   <PostCard key={post._id} post={post} />
                 ))}
               </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
            <div>
               <h3 className="font-bold text-slate-900 font-heading text-xl mb-4 border-b border-slate-100 pb-2">Jobs</h3>
               <div className="space-y-4">
                 {results.jobs.map(job => (
                   <div key={job._id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                     <h4 className="font-bold text-lg text-slate-900">{job.title}</h4>
                     <p className="text-sm text-slate-500 flex gap-4 mt-2"><span>📍 {job.location}</span><span>💰 ₹{job.wage}/day</span></p>
                     <p className="text-slate-700 mt-4 line-clamp-2">{job.description}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {!loading && results.users.length === 0 && results.posts.length === 0 && results.jobs.length === 0 && query && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <SearchIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-900 text-xl mb-2">No results found for &quot;{query}&quot;</h3>
              <p className="text-slate-500">Try using different keywords or checking for typos.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
