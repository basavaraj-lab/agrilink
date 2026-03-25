"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Users, Briefcase, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center pt-10 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Leaf className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
          The Professional Network for <span className="text-green-600">Agriculture</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10">
          Connect with verified farmers and skilled laborers. Find jobs, manage teams, and build your professional agricultural profile.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=farmer" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-green-500/30 flex items-center justify-center gap-2">
            Hire Labor <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/register?role=laborer" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
            Find Work
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-24 grid md:grid-cols-3 gap-8 w-full max-w-5xl"
      >
        <FeatureCard 
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="Profile Matching"
          desc="AI-driven recommendations to match the right laborer with the right farm."
        />
        <FeatureCard 
          icon={<Briefcase className="w-6 h-6 text-green-600" />}
          title="Job Feed"
          desc="LinkedIn-style job feed for discovering nearby agricultural opportunities."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
          title="Verified Reviews"
          desc="Two-way rating system ensuring trust and reliability in every transaction."
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="h-12 w-12 bg-slate-50 flex items-center justify-center rounded-xl mb-4 border border-slate-100">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
