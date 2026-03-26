"use client";
import React from 'react';
import Link from 'next/link';
import { User, Settings, Users, Briefcase } from 'lucide-react';

export default function SidebarProfile({ user }) {
  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-center items-center h-48">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-100 sticky top-24">
      {/* Cover Image Placeholder */}
      <div className="h-24 bg-gradient-to-r from-emerald-500 to-green-400"></div>
      
      <div className="px-6 pb-6 relative">
        <div className="relative -mt-12 mb-4 flex justify-between items-end">
          <div className="p-1 bg-white rounded-2xl inline-block shadow-sm">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                <User className="w-10 h-10" />
              </div>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold font-heading text-slate-900">{user.name}</h2>
        <p className="text-slate-500 text-sm capitalize mb-4">{user.role}</p>
        
        <div className="border-t border-slate-100 my-4"></div>
        
        <div className="space-y-3">
          <Link href="/network" className="flex items-center justify-between text-sm text-slate-600 hover:text-green-600 transition-colors">
            <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Connections</span>
            <span className="font-medium">{user.connections?.length || 0}</span>
          </Link>
          <Link href="/jobs" className="flex items-center justify-between text-sm text-slate-600 hover:text-green-600 transition-colors">
            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> My Jobs</span>
          </Link>
          <Link href="/profile" className="flex items-center justify-between text-sm text-slate-600 hover:text-green-600 transition-colors">
            <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
