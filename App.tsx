
import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Loader2, Menu, X, 
  Info, Phone, FileText, Image as ImageIcon, Send, Copy,
  MapPin, Users, Mic, Landmark, ExternalLink, Activity, Zap, Eye,
  Package, Box, Gamepad2, Award, Mail, ArrowLeft, Home, Globe
} from 'lucide-react';
import { Language, AppView, TranslationSet } from './types';
import { TRANSLATIONS } from './constants';
import LanguageSelector from './components/LanguageSelector';
import FileUploader from './components/FileUploader';
import { analyzeContent } from './services/geminiService';
import { fetchDynamicTranslations } from './services/lingoService';
import { SaifLogo } from './components/Logo';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('English');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Translation State
  const [t, setT] = useState<TranslationSet>(TRANSLATIONS['English']);
  const [isTranslating, setIsTranslating] = useState(false);

  // Scanner States
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Result State
  const [analysisData, setAnalysisData] = useState<{
    verdict: string;
    risk_score: number;
    short_sms_draft: string;
    detailed_analysis: string[];
    evidence_extracted: any;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Map Simulation Logic
  const [reports, setReports] = useState([
    { id: 1, loc: 'Dubai Marina', type: 'Fake Rental Agent', risk: 'High', time: '12m ago' },
    { id: 2, loc: 'Deira City Centre', type: 'Phishing SMS', risk: 'Critical', time: '5m ago' },
  ]);
  const [liveLogs, setLiveLogs] = useState<string[]>(["[SYSTEM] Initialization Complete", "[NETWORK] Connected to UAE Cyber-Grid"]);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MODERATE' | 'HIGH'>('MODERATE');

  // Game State
  const [gameScore, setGameScore] = useState(0);
  const [gameQuestion, setGameQuestion] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);

  // Translation Effect
  useEffect(() => {
    // 1. Immediate update from constants (fallback/cache)
    const fallback = TRANSLATIONS[language] || TRANSLATIONS['English'];
    setT(fallback);

    // 2. Fetch dynamic translations from Lingo.dev API if not English
    if (language !== 'English') {
      setIsTranslating(true);
      fetchDynamicTranslations(TRANSLATIONS['English'], language)
        .then((dynamicTranslations) => {
          if (dynamicTranslations) {
            setT(dynamicTranslations);
          }
        })
        .finally(() => setIsTranslating(false));
    }
  }, [language]);

  // Simulation Effects
  useEffect(() => {
    if (currentView === 'map' || currentView === 'scanner') {
      const interval = setInterval(() => {
        // Log simulation
        const locations = ['Business Bay', 'JLT', 'Sharjah Waterfront', 'Khalifa City', 'Downtown Dubai'];
        const threats = ['Fake Delivery SMS', 'UAE Pass Phishing', 'Bank OTP Scam', 'Crypto Fraud'];
        const newLoc = locations[Math.floor(Math.random() * locations.length)];
        const newThreat = threats[Math.floor(Math.random() * threats.length)];
        
        setLiveLogs(prev => [`[ALERT] ${newThreat} reported in ${newLoc}`, ...prev].slice(0, 5));
        
        // Random threat level change
        const levels: ('LOW' | 'MODERATE' | 'HIGH')[] = ['LOW', 'MODERATE', 'HIGH'];
        if (Math.random() > 0.8) setThreatLevel(levels[Math.floor(Math.random() * 3)]);

      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentView]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
        resolve(base64 || '');
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAnalysisData(null);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisData(null);
  };

  const handleAnalyze = async (context: 'general' | 'delivery' = 'general') => {
    if (activeTab === 'image' && !selectedFile) return;
    if (activeTab === 'text' && !textInput.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisData(null);

    try {
      let analysisJsonString = '';
      if (activeTab === 'image' && selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        analysisJsonString = await analyzeContent('image', base64, selectedFile.type, language, context);
      } else {
        analysisJsonString = await analyzeContent('text', textInput, 'text/plain', language, context);
      }
      
      const parsedData = JSON.parse(analysisJsonString);
      setAnalysisData(parsedData);

    } catch (err: any) {
      console.error(err);
      setError(t.error_high_traffic);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendSMS = () => {
    if (!analysisData?.short_sms_draft) return;
    const number = "8004888";
    const body = analysisData.short_sms_draft;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIOS ? '&' : '?';
    window.location.href = `sms:${number}${separator}body=${encodeURIComponent(body)}`;
  };

  const handleCopySMS = () => {
    if (analysisData?.short_sms_draft) {
      navigator.clipboard.writeText(analysisData.short_sms_draft);
      alert("Report copied!");
    }
  };

  const goHome = () => {
      setCurrentView('landing');
      setAnalysisData(null);
      setTextInput('');
      clearFile();
      setIsSidebarOpen(false);
  }

  if (currentView === 'landing') {
    return <LandingPage t={t} onEnter={() => setCurrentView('scanner')} />;
  }

  const isScam = analysisData?.verdict === 'SCAM';

  // --- VIEW RENDERERS ---

  const renderScanner = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 opacity-50"></div>
        <div className="flex border-b border-slate-800 bg-[#020617]/50">
          <button onClick={() => setActiveTab('image')} className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'image' ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>
            <ImageIcon className="w-4 h-4" /> {t.tab_image}
          </button>
          <button onClick={() => setActiveTab('text')} className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${activeTab === 'text' ? 'text-cyan-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}>
            <FileText className="w-4 h-4" /> {t.tab_text}
          </button>
        </div>
        <div className="p-6 md:p-8">
          {activeTab === 'image' ? (
            <FileUploader onFileSelect={handleFileSelect} previewUrl={previewUrl} onClear={clearFile} label={t.upload_text} />
          ) : (
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t.text_input_placeholder} className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 font-mono text-sm transition-all resize-none" />
          )}
          <button onClick={() => handleAnalyze('general')} disabled={isAnalyzing || (activeTab === 'image' ? !selectedFile : !textInput)} className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]">
            {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
            {isAnalyzing ? t.investigating : t.analyze_btn}
          </button>
        </div>
      </div>
      {renderResults()}
    </div>
  );

  const renderDelivery = () => (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-orange-900/40 to-slate-900 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
            <Package className="absolute right-4 top-4 w-24 h-24 text-orange-500/10 rotate-12" />
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Box className="text-orange-500" /> {t.delivery_title}
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mb-6">
                Specialized scanner for Logistics Fraud. Detects fake Emirates Post, Aramex, and DHL SMS messages claiming "address updates" or "small fees".
            </p>
            <div className="bg-slate-950/50 rounded-xl border border-slate-700 p-4">
                <textarea 
                    value={textInput} 
                    onChange={(e) => setTextInput(e.target.value)} 
                    placeholder="Paste the SMS or Tracking Link here..." 
                    className="w-full h-32 bg-transparent border-none text-slate-200 focus:ring-0 font-mono text-sm placeholder-slate-600 resize-none" 
                />
            </div>
            <button onClick={() => { setActiveTab('text'); handleAnalyze('delivery'); }} disabled={isAnalyzing || !textInput} className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                SCAN FOR DELIVERY FRAUD
            </button>
        </div>
        {renderResults()}
    </div>
  );

  const renderResults = () => (
    analysisData && (
        <div className={`rounded-2xl border overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-700 ${isScam ? 'bg-red-950/20 border-red-500/30' : 'bg-green-950/20 border-green-500/30'}`}>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
              <div className={`p-3 rounded-full ${isScam ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                {isScam ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>
              <div>
                <h3 className={`text-2xl font-black uppercase tracking-tight ${isScam ? 'text-red-400' : 'text-green-400'}`}>
                  {isScam ? t.threat_detected : t.safe_verdict}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-xs font-mono text-slate-400">{t.risk_score_label}:</span>
                   <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${isScam ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${analysisData.risk_score}%`}}></div>
                   </div>
                   <span className="text-xs font-mono text-white">{analysisData.risk_score}/100</span>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t.tactical_analysis}</h4>
                <ul className="space-y-3">
                  {analysisData.detailed_analysis.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-cyan-500 rounded-full shrink-0"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {isScam && (
                <div className="bg-slate-900/50 p-6 rounded-xl border border-red-500/20">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 mb-4"><Phone className="w-3 h-3" /> {t.police_report_label}</h4>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-700 mb-4 font-mono text-xs text-slate-400 break-words">{analysisData.short_sms_draft}</div>
                  <div className="flex gap-3">
                    <button onClick={handleSendSMS} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"><Send className="w-3 h-3" /> {t.send_sms_btn}</button>
                    <button onClick={handleCopySMS} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"><Copy className="w-3 h-3" /> {t.copy_btn}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    )
  );

  const renderTraining = () => {
    const questions = [
        { q: "SMS: 'EmiratesPost: Package held at warehouse. Click link to pay 12.50 AED customs fee.'", isScam: true },
        { q: "Email: 'Dubai Police: Fine payment receipt #9923 for 200 AED.' (No link, just PDF)", isScam: false },
        { q: "WhatsApp: 'Hello dear, I am from Dubai Rental. I have 1BHK in Marina for 20k/year.'", isScam: true },
    ];
    
    const currentQ = questions[gameQuestion % questions.length];

    const handleAnswer = (userSaysScam: boolean) => {
        const correct = userSaysScam === currentQ.isScam;
        setLastAnswerCorrect(correct);
        if(correct) setGameScore(s => s + 100);
        setTimeout(() => {
            setLastAnswerCorrect(null);
            setGameQuestion(q => q + 1);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 flex flex-col items-center max-w-4xl mx-auto">
            <div className="w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-slate-600">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-mono font-bold text-yellow-400">{gameScore} XP</span>
                </div>
                <Gamepad2 className="w-16 h-16 text-cyan-500 mx-auto mb-4 opacity-80" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">{t.training_title}</h2>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">Test your instincts. Is the following message REAL or a SCAM?</p>

                <div className="bg-slate-900 p-6 rounded-xl border border-slate-600 mb-8 max-w-xl mx-auto shadow-inner min-h-[120px] flex items-center justify-center">
                    <p className="font-mono text-lg text-slate-200">"{currentQ.q}"</p>
                </div>

                {lastAnswerCorrect === null ? (
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => handleAnswer(false)} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> REAL
                        </button>
                        <button onClick={() => handleAnswer(true)} className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> SCAM
                        </button>
                    </div>
                ) : (
                    <div className={`text-2xl font-black uppercase animate-bounce ${lastAnswerCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        {lastAnswerCorrect ? "CORRECT! +100 XP" : "WRONG! SECURITY BREACHED!"}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-3 gap-4 w-full text-center">
                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800"><div className="text-2xl font-bold text-white">Novice</div><div className="text-[10px] text-slate-500 uppercase">Current Rank</div></div>
                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800"><div className="text-2xl font-bold text-cyan-400">92%</div><div className="text-[10px] text-slate-500 uppercase">Accuracy</div></div>
                <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800"><div className="text-2xl font-bold text-yellow-500">3</div><div className="text-[10px] text-slate-500 uppercase">Streak</div></div>
            </div>
        </div>
    );
  };

  const renderMap = () => (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-red-500" /> {t.map_title}
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live Feed</span>
          </div>
        </div>
        <div className="aspect-video bg-[#020617] rounded-xl relative overflow-hidden border border-slate-800">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.3011839799!2d55.22748795!3d25.07638145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sae!4v1709665487654!5m2!1sen!2sae" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(0%) invert(0%)' }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          <div className="bg-black/80 absolute top-0 w-full h-8 flex items-center overflow-hidden border-b border-slate-800 pointer-events-none">
             <div className="flex animate-[infinite-scroll_20s_linear_infinite] gap-8 whitespace-nowrap px-4 text-[10px] font-mono text-cyan-400">
                {liveLogs.map((log, i) => (<span key={i} className="flex items-center gap-2"><Zap className="w-3 h-3" /> {log}</span>))}
             </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4">
        {reports.map(report => (
          <div key={report.id} className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-600 transition-all group">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${report.risk === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}><AlertTriangle className="w-5 h-5" /></div>
              <div><h4 className="font-bold text-slate-200 text-sm">{report.type}</h4><p className="text-xs text-slate-500 font-mono">{report.loc} • {report.time}</p></div>
            </div>
            <div className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${report.risk === 'Critical' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-orange-400 bg-orange-500/10 border border-orange-500/20'}`}>{report.risk}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGov = () => (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-800/50 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Landmark className="text-emerald-500 w-8 h-8" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{t.gov_status}</h2>
                <p className="text-emerald-400 text-xs font-mono uppercase">Official Protocol: Verified Security</p>
            </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-black/20 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <h4 className="font-bold text-white mb-2 group-hover:text-emerald-400">Emirates ID Scam Scan</h4>
                <p className="text-xs text-slate-400 mb-4">Upload SMS claiming ID suspension. We verify font, link structure, and source domain.</p>
                <button className="text-emerald-500 text-xs font-bold flex items-center gap-1">ACTIVATE SCAN <ExternalLink className="w-3 h-3" /></button>
            </div>
            <div className="bg-black/20 p-6 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                <h4 className="font-bold text-white mb-2 group-hover:text-blue-400">UAE Pass URL Verifier</h4>
                <p className="text-xs text-slate-400 mb-4">Paste URL to check if it's the official uaepass.ae or a phishing clone.</p>
                <button className="text-blue-500 text-xs font-bold flex items-center gap-1">ACTIVATE SCAN <ExternalLink className="w-3 h-3" /></button>
            </div>
            </div>
        </div>
      </div>
  );

  // --- MAIN LAYOUT ---

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-200 flex flex-col md:flex-row h-screen overflow-hidden ${language === 'Arabic' ? 'font-arabic' : 'font-sans'}`} dir={language === 'Arabic' ? 'rtl' : 'ltr'}>
      <style>{`@keyframes infinite-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#020617] border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 flex flex-col h-full">
          <div onClick={goHome} className="flex items-center gap-3 mb-8 cursor-pointer hover:opacity-80 transition-opacity">
            <SaifLogo className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter italic">SAIF-AI</h1>
              <p className="text-[9px] text-cyan-500 font-mono tracking-widest uppercase">{t.sidebar_subtitle}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto pr-2">
            {[
                { id: 'scanner', icon: Eye, label: t.nav_scanner },
                { id: 'delivery', icon: Package, label: t.nav_delivery, special: true },
                { id: 'map', icon: MapPin, label: t.nav_map },
                { id: 'training', icon: Gamepad2, label: t.nav_training },
                { id: 'gov', icon: Landmark, label: t.nav_gov },
                { id: 'voice', icon: Mic, label: t.nav_voice },
            ].map((item) => (
                <button 
                    key={item.id}
                    onClick={() => { setCurrentView(item.id as AppView); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all relative overflow-hidden group 
                    ${currentView === item.id 
                        ? (item.special ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' : 'text-white bg-slate-800') 
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                >
                    {currentView === item.id && !item.special && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"></div>}
                    <item.icon className={`w-4 h-4 ${currentView === item.id ? (item.special ? 'text-orange-400' : 'text-cyan-400') : 'text-slate-500 group-hover:text-cyan-400'}`} />
                    {item.label}
                </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-800 space-y-6">
            <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">{t.police_section}</p>
                <a href="tel:901" className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors group">
                    <Phone className="w-4 h-4 text-blue-500 group-hover:animate-bounce" />
                    <span className="text-xs font-bold text-slate-300">{t.call_police}</span>
                </a>
                <a href="mailto:mail@dubaipolice.gov.ae" className="flex items-center gap-3 px-4 py-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-slate-300">{t.email_police}</span>
                </a>
            </div>
            <div className="relative">
              {isTranslating && (
                <div className="absolute -top-6 right-0 text-[10px] text-cyan-500 flex items-center gap-1 animate-pulse">
                   <Globe className="w-3 h-3" /> Updating translations...
                </div>
              )}
              <LanguageSelector current={language} onSelect={setLanguage} label={t.select_lang_label} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative bg-gradient-to-b from-[#020617] to-[#0f172a]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#020617] border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md bg-opacity-90">
            <div className="flex items-center gap-2" onClick={goHome}>
                <SaifLogo className="w-6 h-6" />
                <span className="font-bold text-white">SAIF-AI</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400"><Menu /></button>
        </div>

        {/* Mobile Menu Overlay */}
        {isSidebarOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}

        <div className="max-w-6xl mx-auto p-6 md:p-10 pb-32">
          {/* Revised Top Header */}
          <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800/50 pb-8 relative">
            
            {/* Left: Big Back Button */}
            <div className="w-full md:w-1/3 flex justify-start order-2 md:order-1">
                 <button 
                    onClick={goHome} 
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500 transition-all group w-full md:w-auto justify-center md:justify-start"
                 >
                     <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                        <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-cyan-400" />
                     </div>
                     <div className="text-left">
                        <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest">Return</span>
                        <span className="block text-sm font-bold text-slate-200 group-hover:text-white">TO LANDING</span>
                     </div>
                 </button>
            </div>

            {/* Center: Big Logo & Name */}
            <div 
                onClick={goHome}
                className="w-full md:w-1/3 flex flex-col items-center justify-center cursor-pointer group order-1 md:order-2"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <SaifLogo className="w-20 h-20 mb-3 relative z-10 drop-shadow-2xl" />
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter italic group-hover:text-cyan-400 transition-colors text-center">SAIF-AI</h1>
                <div className="flex items-center gap-2 mt-1 opacity-60">
                    <Shield className="w-3 h-3 text-cyan-500" />
                    <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-500 uppercase">DEFENSE CORE</span>
                </div>
            </div>

            {/* Right: Threat Level & Status */}
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-end order-3">
                <div className="flex items-center gap-3 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-700 backdrop-blur-md">
                     <span className={`w-3 h-3 rounded-full animate-pulse ${threatLevel === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_red]' : threatLevel === 'MODERATE' ? 'bg-orange-500 shadow-[0_0_10px_orange]' : 'bg-green-500 shadow-[0_0_10px_green]'}`}></span>
                     <span className="text-xs font-mono font-bold text-slate-300">
                        THREAT LEVEL: <span className={`${threatLevel === 'HIGH' ? 'text-red-500' : threatLevel === 'MODERATE' ? 'text-orange-500' : 'text-green-500'}`}>{threatLevel}</span>
                     </span>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono text-center md:text-right">
                    <span className="block mb-1">SYSTEM STATUS: <span className="text-green-500 font-bold">OPTIMAL</span></span>
                    <span className="block">SECURE CONNECTION: <span className="text-cyan-500 font-bold">ENCRYPTED</span></span>
                </div>
            </div>

          </header>

          <div className="min-h-[500px]">
            {currentView === 'scanner' && renderScanner()}
            {currentView === 'delivery' && renderDelivery()}
            {currentView === 'map' && renderMap()}
            {currentView === 'training' && renderTraining()}
            {currentView === 'gov' && renderGov()}
            {currentView === 'voice' && (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-slate-700 rounded-2xl text-slate-500 max-w-4xl mx-auto">
                    <Mic className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-sm uppercase tracking-widest">{t.voice_status}</p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
