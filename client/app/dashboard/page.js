"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, User as UserIcon, Calendar, Briefcase, Award } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Job Modal state
  const [showModal, setShowModal] = useState(false);
  const [jobForm, setJobForm] = useState({ title: '', description: '', workType: '', date: '', wage: '', location: { city: '' } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
          currentUser = { _id: "650c90c9b0101b0000000001", name: "Guest User", role: "farmer", profile: {} };
          localStorage.setItem('user', JSON.stringify(currentUser));
          localStorage.setItem('token', 'guest_token');
        }
        setUser(currentUser);
        
        // Fetch User profile & their jobs
        const jobsRes = await api.get('/jobs/myjobs');
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', jobForm);
      setShowModal(false);
      const jobsRes = await api.get('/jobs/myjobs');
      setJobs(jobsRes.data);
    } catch (err) {
      alert("Error creating job");
    }
  }

  if (loading) return null;

  return (
    <div className="grid lg:grid-cols-4 gap-8 py-8">
      {/* Sidebar Profile */}
      <div className="lg:col-span-1 border border-slate-200 bg-white rounded-2xl p-6 shadow-sm h-fit">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden mb-4">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-green-600 font-semibold mb-6 capitalize">{user?.role}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center text-sm text-slate-600">
            <Award className="w-4 h-4 mr-3 text-slate-400" />
            <span>Profile complete</span>
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
            <span>{jobs.length} Jobs active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Your Hub</h2>
          {user?.role === 'farmer' && (
            <button 
              onClick={() => setShowModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Post Job
            </button>
          )}
        </div>

        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center shadow-sm">
              <p className="text-slate-500">You don't have any jobs yet.</p>
            </div>
          ) : (
             jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                    <p className="text-slate-500 text-sm">{format(new Date(job.date), 'MMM dd, yyyy')} • {job.workType}</p>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-sm font-medium capitalize flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${job.status === 'open' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                    {job.status}
                  </div>
                </div>
             ))
          )}
        </div>
      </div>

      {/* New Job Modal (Simplified) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold mb-4">Post a new Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <input type="text" placeholder="Job Title" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setJobForm({...jobForm, title: e.target.value})} />
              <textarea placeholder="Description" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none" onChange={(e) => setJobForm({...jobForm, description: e.target.value})}></textarea>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Work Type (e.g., Harvesting)" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setJobForm({...jobForm, workType: e.target.value})} />
                <input type="number" placeholder="Wage (per day)" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setJobForm({...jobForm, wage: e.target.value})} />
              </div>
              <input type="date" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" onChange={(e) => setJobForm({...jobForm, date: e.target.value})} />
              <input type="text" placeholder="City" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none" onChange={(e) => setJobForm({...jobForm, location: { city: e.target.value }})} />
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
