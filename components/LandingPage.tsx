
import React, { useEffect, useState } from 'react';
import { Shield, Lock, Activity, ArrowRight, Zap, Globe, Server } from 'lucide-react';
import { SaifLogo } from './Logo';
import { TranslationSet } from '../types';

interface LandingPageProps {
  t: TranslationSet;
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ t, onEnter }) => {
  const [mounted, setMounted] = useState(false);
  const [threatCount, setThreatCount] = useState(12430);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setThreatCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] opacity-80"></div>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-600/50 to-transparent"></div>
        
        {/* Floating Nodes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-blue-500 rounded-full animate-ping delay-1000 opacity-20"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <SaifLogo className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tighter text-white">SAIF-AI</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-cyan-400">SYSTEM ONLINE</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10">
        
        <div className={`transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-cyan-400 text-xs font-mono mb-8 backdrop-blur-md">
            <Shield className="w-3 h-3" />
            <span>UAE NATIONAL CYBER DEFENSE</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
            {t.landing_title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t.landing_subtitle}
          </p>

          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all hover:shadow-[0_0_40px_rgba(8,145,178,0.4)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/20 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span>{t.landing_cta}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Live Stats */}
        <div className={`mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl transition-all duration-1000 delay-300 transform ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
           <StatCard icon={<Zap className="text-yellow-500" />} label={t.live_stat_1} value={threatCount.toLocaleString()} />
           <StatCard icon={<Globe className="text-blue-500" />} label="MONITORED REGIONS" value="7" />
           <StatCard icon={<Server className="text-purple-500" />} label={t.live_stat_2} value="4,210" />
           <StatCard icon={<Lock className="text-green-500" />} label="SUCCESS RATE" value="99.9%" />
        </div>

      </main>
      
      {/* Ticker */}
      <div className="relative z-10 bg-slate-900/50 border-t border-slate-800 backdrop-blur-sm py-2 overflow-hidden">
        <div className="flex animate-[infinite-scroll_30s_linear_infinite] whitespace-nowrap gap-12 px-4">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 text-xs font-mono text-slate-500">
                    <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-red-500" /> [ALERT] Phishing Attempt Blocked in Dubai Marina</span>
                    <span className="flex items-center gap-2"><Activity className="w-3 h-3 text-orange-500" /> [WARN] Fake Rental Agent Report - JLT</span>
                    <span className="flex items-center gap-2"><Shield className="w-3 h-3 text-green-500" /> [SECURE] 450 New Safe Nodes Added</span>
                </div>
             ))}
        </div>
      </div>

       <style>{`
        @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center hover:border-cyan-500/30 transition-colors backdrop-blur-sm">
        <div className="mb-2 p-2 bg-slate-800 rounded-lg">{icon}</div>
        <div className="text-2xl font-mono font-bold text-white mb-1">{value}</div>
        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</div>
    </div>
);

export default LandingPage;
