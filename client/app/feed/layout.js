"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SidebarProfile from '../../components/SidebarProfile';
import RightSidebar from '../../components/RightSidebar';
import api from '../../utils/api';

export default function FeedLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        const mockUser = { _id: "650c90c9b0101b0000000001", name: "Guest User", role: "farmer" };
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[225px_minmax(0,1fr)_315px] gap-6 max-w-[1128px] mx-auto">
      {/* Left Sidebar */}
      <div className="hidden lg:block">
        <SidebarProfile user={user} />
      </div>

      {/* Main Feed Content */}
      <div className="w-full max-w-[600px] mx-auto lg:max-w-none">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { user });
          }
          return child;
        })}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
