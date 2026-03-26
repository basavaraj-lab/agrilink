"use client";
import React, { useEffect, useState } from 'react';
import { Settings, Save, MapPin, Briefcase, Mail, Phone, Edit3 } from 'lucide-react';
import api from '../../utils/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uRes = await api.get('/auth/me');
        setUser(uRes.data);
        setFormData({
          name: uRes.data.name,
          phone: uRes.data.phone,
          profileImage: uRes.data.profileImage || '',
          coverImage: uRes.data.coverImage || '',
          ...uRes.data.profile
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        profileImage: formData.profileImage,
        coverImage: formData.coverImage,
        profile: {
          skills: formData.skills ? formData.skills.toString().split(',').map(s => s.trim()) : [],
          experience: formData.experience,
          farmSize: formData.farmSize,
          cropTypes: formData.cropTypes ? formData.cropTypes.toString().split(',').map(s => s.trim()) : [],
          location: {
            address: formData.location?.address || '',
            city: formData.location?.city || '',
            state: formData.location?.state || ''
          }
        }
      };

      const res = await api.put('/users/profile', payload);
      setUser(res.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
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
    <div className="max-w-4xl mx-auto pb-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-slate-200 relative">
          {user?.coverImage ? (
            <img src={user.coverImage} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-green-400"></div>
          )}
          {editing && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm border border-white/50 z-10">
               <label className="text-xs font-bold text-slate-800">Cover Image URL</label>
               <input type="text" className="border border-slate-200 rounded px-2 py-1 mt-1 text-sm block" value={formData.coverImage || ''} onChange={e=>setFormData({...formData, coverImage: e.target.value})} />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 md:px-10 pb-10 relative">
          <div className="flex justify-between items-end -mt-16 mb-6">
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl p-1.5 shadow-lg relative z-10">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <div className="w-full h-full rounded-xl bg-emerald-100 flex items-center justify-center text-4xl font-bold text-emerald-700">
                    {user?.name?.charAt(0)}
                  </div>
                )}
              </div>
              {editing && (
                <div className="mt-4 absolute -bottom-16 left-0 bg-white p-2 rounded shadow border border-slate-100 w-64 z-20">
                   <label className="text-xs font-bold text-slate-800">Profile Image URL</label>
                   <input type="text" className="border border-slate-200 rounded px-2 py-1 mt-1 text-sm block w-full" value={formData.profileImage || ''} onChange={e=>setFormData({...formData, profileImage: e.target.value})} />
                </div>
              )}
            </div>
            
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-full transition-colors mb-2">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            ) : (
              <button onClick={handleUpdate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full transition-colors mb-2 shadow-lg shadow-emerald-600/20">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            )}
          </div>

          {!editing ? (
             <div>
               <h1 className="text-3xl font-extrabold text-slate-900 font-heading">{user?.name}</h1>
               <p className="text-xl text-slate-500 capitalize font-medium">{user?.role}</p>
               
               <div className="flex flex-wrap gap-4 mt-6 text-sm font-medium text-slate-600">
                 <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                   <MapPin className="w-4 h-4 text-emerald-600" /> {user?.profile?.location?.city || 'Location not set'}
                 </span>
                 <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                   <Mail className="w-4 h-4 text-emerald-600" /> {user?.email}
                 </span>
                 <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                   <Phone className="w-4 h-4 text-emerald-600" /> {user?.phone}
                 </span>
               </div>
               
               <div className="border-t border-slate-100 my-8"></div>
               
               <h3 className="font-bold text-lg text-slate-900 mb-4 font-heading">About My Professional Experience</h3>
               
               {user?.role === 'laborer' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Skills</p>
                     <p className="text-slate-800 font-medium font-heading text-lg">{user?.profile?.skills?.length > 0 ? user.profile.skills.join(', ') : 'Not set'}</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</p>
                     <p className="text-slate-800 font-medium font-heading text-lg">{user?.profile?.experience || 0} Years</p>
                   </div>
                 </div>
               )}
               
               {user?.role === 'farmer' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Farm Size</p>
                     <p className="text-slate-800 font-medium font-heading text-lg">{user?.profile?.farmSize || 0} Acres</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Crop Types</p>
                     <p className="text-slate-800 font-medium font-heading text-lg">{user?.profile?.cropTypes?.length > 0 ? user.profile.cropTypes.join(', ') : 'Not set'}</p>
                   </div>
                 </div>
               )}
             </div>
          ) : (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.name || ''} onChange={e=>setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.phone || ''} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.location?.city || ''} onChange={e=>setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                   <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.location?.state || ''} onChange={e=>setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
                 </div>
                 
                 {user?.role === 'laborer' && (
                   <>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Skills (comma separated)</label>
                       <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.skills || ''} onChange={e=>setFormData({...formData, skills: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Years of Experience</label>
                       <input type="number" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.experience || ''} onChange={e=>setFormData({...formData, experience: e.target.value})} />
                     </div>
                   </>
                 )}

                 {user?.role === 'farmer' && (
                   <>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Crop Types (comma separated)</label>
                       <input type="text" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.cropTypes || ''} onChange={e=>setFormData({...formData, cropTypes: e.target.value})} />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Farm Size (Acres)</label>
                       <input type="number" className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500/20" value={formData.farmSize || ''} onChange={e=>setFormData({...formData, farmSize: e.target.value})} />
                     </div>
                   </>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
