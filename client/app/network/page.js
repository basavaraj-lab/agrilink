"use client";
import React, { useEffect, useState } from 'react';
import { UserPlus, UserCheck, Search, Users } from 'lucide-react';
import api from '../../utils/api';

export default function NetworkPage() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
        
        // Fetch full user data to get connections
        const fullUserRes = await api.get(`/users/${userRes.data._id}`);
        setUser(fullUserRes.data);

        const reqsRes = await api.get('/users/requests/pending');
        setRequests(reqsRes.data);
      } catch (err) {
        console.error('Failed to fetch network data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await api.post(`/users/connect/accept/${requestId}`);
      setRequests(requests.filter(req => req._id !== requestId));
      // Re-fetch user to update connections list
      const fullUserRes = await api.get(`/users/${user._id}`);
      setUser(fullUserRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar - Network Stats */}
      <div className="lg:col-span-1">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
          <h2 className="font-bold text-slate-900 font-heading text-lg mb-4">Manage my network</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-slate-600 hover:text-emerald-600 cursor-pointer">
              <span className="flex items-center gap-2"><Users className="w-5 h-5" /> Connections</span>
              <span className="font-semibold">{user?.connections?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 hover:text-blue-600 cursor-pointer">
              <span className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Pending</span>
              <span className="font-semibold">{requests.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Pending Requests */}
        {requests.length > 0 && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-bold text-slate-900 font-heading text-xl mb-4 text-emerald-700">Invitations</h2>
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req._id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    {req.sender.profileImage ? (
                      <img src={req.sender.profileImage} alt={req.sender.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
                        {req.sender.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{req.sender.name}</h3>
                      <p className="text-slate-500 capitalize">{req.sender.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 font-medium text-slate-500 hover:text-slate-900 transition-colors">Ignore</button>
                    <button 
                      onClick={() => handleAccept(req._id)}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4" /> Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connections List */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900 font-heading text-xl">My Connections</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search connections..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          {user?.connections && user.connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.connections.map(conn => (
                <div key={conn._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow relative text-center pb-6">
                  <div className="h-16 bg-gradient-to-r from-emerald-500 to-green-400 w-full absolute top-0 left-0"></div>
                  <div className="flex justify-center mt-6 relative z-10 mb-3">
                    {conn.profileImage ? (
                      <img src={conn.profileImage} alt={conn.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-white shadow-sm flex items-center justify-center text-emerald-700 font-bold text-2xl">
                        {conn.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 leading-tight">{conn.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 capitalize">{conn.role}</p>
                  <button className="text-emerald-600 font-semibold border border-emerald-600 rounded-full px-6 py-1.5 hover:bg-emerald-50 transition-colors">
                    Message
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">You don&apos;t have any connections yet.</p>
              <button className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 shadow-sm">
                Find people to connect with
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
