"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Calendar, CheckCircle2, DollarSign } from 'lucide-react';
import api from '../../utils/api';
import { format } from 'date-fns';

export default function JobsFeed() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        const res = await api.get('/jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert("Successfully applied!");
      // Re-fetch to update state
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      alert(err.response?.data?.msg || "Error applying");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent animate-spin rounded-full"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Job Feed</h1>
          <p className="text-slate-500 mt-1">Discover agricultural work opportunities near you</p>
        </div>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No jobs available right now</h3>
            <p className="text-slate-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          jobs.map((job, idx) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                    <p className="text-slate-600 font-medium">{job.farmerId?.name}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.wage}/day
                  </span>
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-6">{job.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6 font-medium">
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location?.city || 'Local Farm'}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> {format(new Date(job.date), 'MMM dd, yyyy')}</div>
                  <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {job.workType}</div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  {user?.role === 'laborer' && (
                    <button 
                      onClick={() => handleApply(job._id)}
                      className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                      disabled={job.applicants.some(a => a.laborerId === user.id)}
                    >
                      {job.applicants.some(a => a.laborerId === user.id) ? 'Applied' : 'Apply Now'}
                    </button>
                  )}
                  {user?.role === 'farmer' && user?.id === job.farmerId?._id && (
                     <span className="text-green-600 font-medium flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5" /> Your Posting
                     </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
