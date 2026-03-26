"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../../utils/api';
import Link from 'next/link';
import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'laborer';

  const [formData, setFormData] = useState({
    role: initialRole,
    name: '',
    email: '',
    password: '',
    phone: '',
    experience: 0,
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      role: formData.role,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      profile: {
        experience: formData.role === 'laborer' ? Number(formData.experience) : undefined,
        skills: formData.role === 'laborer' ? formData.skills.split(',').map(s => s.trim()) : []
      }
    };

    try {
      const res = await api.post('/auth/register', payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Join AgriLinked</h2>
          <p className="text-slate-500 mt-2">Create your professional profile today</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">{error}</div>}

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'laborer' })}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.role === 'laborer' ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            I am a Laborer
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, role: 'farmer' })}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${formData.role === 'farmer' ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            I am a Farmer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="John Doe" onChange={handleChange} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" name="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="john@example.com" onChange={handleChange} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input type="text" name="phone" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="+1234567890" onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" name="password" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="••••••••" onChange={handleChange} />
            </div>
            
            {formData.role === 'laborer' && (
              <>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
                  <input type="number" name="experience" min="0" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="3" onChange={handleChange} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                  <input type="text" name="skills" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white text-slate-900 placeholder:text-slate-400" placeholder="Harvesting, Plowing" onChange={handleChange} />
                </div>
              </>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 mt-4 text-white rounded-lg py-3 font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>


      </motion.div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center py-8"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
