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
        router.push('/login');
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <SidebarProfile user={user} />
      </div>

      {/* Main Feed Content */}
      <div className="lg:col-span-2">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { user });
          }
          return child;
        })}
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <RightSidebar />
      </div>
    </div>
  );
}
