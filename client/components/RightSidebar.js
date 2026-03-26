"use client";
import React from 'react';
import { TrendingUp, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function RightSidebar() {
  const trendingTags = [
    { tag: 'harvesting', count: '1.2k' },
    { tag: 'agriculture', count: '940' },
    { tag: 'tractors', count: '542' },
    { tag: 'labor', count: '310' },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      {/* Trending Topics */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 font-heading">Trending Now</h3>
        </div>
        <div className="space-y-4">
          {trendingTags.map((t, idx) => (
            <Link href={`/search?q=${t.tag}`} key={idx} className="block group">
              <p className="text-sm font-medium text-slate-800 group-hover:text-emerald-600 transition-colors">#{t.tag}</p>
              <p className="text-xs text-slate-500">{t.count} posts</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 font-heading">Suggested</h3>
        </div>
        <div className="space-y-4">
          {/* Mock suggestions */}
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">Farmer User</p>
                  <p className="text-xs text-slate-500">Agriculture Lead</p>
                </div>
              </div>
              <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
