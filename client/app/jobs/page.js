"use client";
import React, { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Map } from 'lucide-react';
import api from '../../utils/api';

export default function JobsPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('explore'); // explore or myjobs
  const [loading, setLoading] = useState(true);
  
  // Post Job form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', workType: '', date: '', wage: 0, location: ''
  });

  useEffect(() => {
    let active = true;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const uRes = await api.get('/auth/me');
        if (active) setUser(uRes.data);

        const endpoint = activeTab === 'explore' ? '/jobs' : '/jobs/myjobs';
        const jRes = await api.get(endpoint);
        if (active) setJobs(jRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchJobs();
    return () => { active = false; };
  }, [activeTab]);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Applied successfully!');
      // Refresh to show status
      const jRes = await api.get('/jobs');
      setJobs(jRes.data);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error applying to job');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/jobs', formData);
      setJobs([res.data, ...jobs]);
      setShowForm(false);
      setFormData({ title: '', description: '', workType: '', date: '', wage: 0, location: '' });
      alert('Job posted successfully!');
    } catch (err) {
      console.error(err);
      alert('Error posting job');
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar */}
      <div className="lg:col-span-1 space-y-6 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-slate-900 font-heading text-lg mb-2">Job Portal</h2>
          <p className="text-slate-500 text-sm mb-6">Find agricultural opportunities or hire skilled laborers.</p>
          
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('explore')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'explore' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Explore Jobs
            </button>
            <button 
              onClick={() => setActiveTab('myjobs')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'myjobs' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              My Jobs
            </button>
          </div>
          
          {user?.role === 'farmer' && (
            <button 
              onClick={() => setShowForm(!showForm)}
              className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-sm"
            >
              {showForm ? 'Cancel' : 'Post a Job'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Mobile controls */}
        <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'explore' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
          >
            Explore
          </button>
          <button 
            onClick={() => setActiveTab('myjobs')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${activeTab === 'myjobs' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
          >
            My Jobs
          </button>
          {user?.role === 'farmer' && (
             <button 
             onClick={() => setShowForm(!showForm)}
             className="px-4 py-2 rounded-full text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 whitespace-nowrap"
           >
             Post Job
           </button>
          )}
        </div>

        {/* Search Bar */}
        {!showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-6 flex">
            <div className="flex-1 flex items-center px-4 border-r border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-2" />
              <input type="text" placeholder="Search title or skills" className="w-full h-10 outline-none text-slate-700 font-medium" />
            </div>
            <div className="flex-1 flex items-center px-4">
              <Map className="w-5 h-5 text-slate-400 mr-2" />
              <input type="text" placeholder="Location" className="w-full h-10 outline-none text-slate-700 font-medium" />
            </div>
          </div>
        )}

        {/* Post Form */}
        {showForm && user?.role === 'farmer' && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-green-200 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10"></div>
            <h2 className="font-bold text-2xl text-slate-900 mb-6 font-heading">Post a New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500/20" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="e.g. Tractor Driver Needed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Work Type</label>
                  <select required className="w-full border border-slate-200 rounded-lg px-4 py-2.5" value={formData.workType} onChange={e=>setFormData({...formData, workType: e.target.value})}>
                    <option value="">Select type</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="planting">Planting</option>
                    <option value="tractoring">Tractor Driving</option>
                    <option value="general">General Labor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Wage (Daily)</label>
                  <input required type="number" className="w-full border border-slate-200 rounded-lg px-4 py-2.5" value={formData.wage} onChange={e=>setFormData({...formData, wage: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input required type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2.5" value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                  <input required type="text" className="w-full border border-slate-200 rounded-lg px-4 py-2.5" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} placeholder="Farm address or city" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                  <textarea required rows="3" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 resize-none" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Describe the job duties and requirements..."></textarea>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">Submit Post</button>
              </div>
            </form>
          </div>
        )}

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs found</h3>
            <p className="text-slate-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                  <Briefcase className="w-24 h-24 text-emerald-600" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{job.title}</h3>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4 font-medium">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                    <MapPin className="w-4 h-4 text-emerald-600" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                    <DollarSign className="w-4 h-4 text-emerald-600" /> ₹{job.wage}/day
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                    <Calendar className="w-4 h-4 text-emerald-600" /> {new Date(job.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-slate-700 mb-6 leading-relaxed relative z-10">{job.description}</p>
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center font-bold text-emerald-700">
                      {job.farmerId?.name?.charAt(0) || 'F'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{job.farmerId?.name || 'Local Farm'}</p>
                      <p className="text-xs text-slate-500">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {user?.role === 'laborer' && activeTab === 'explore' && (
                    <button 
                      onClick={() => handleApply(job._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm"
                    >
                      Apply Now
                    </button>
                  )}
                  {user?.role === 'farmer' && activeTab === 'myjobs' && (
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-bold">{job.applicants?.length || 0} applicants</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
