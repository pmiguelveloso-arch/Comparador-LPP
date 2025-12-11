
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerProfile } from '../types';
import { analyzeProfileWithAI } from '../utils/aiService';
import { ArrowRight, ArrowLeft, Check, AlertCircle, Activity, HeartPulse, Wallet, HelpCircle, Scale, Sun, Wind, Gauge, Target, Cpu, Sword, Shield, Zap } from 'lucide-react';

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState<Partial<PlayerProfile>>({
    experience: '',
    gender: undefined,
    frequency: '',
    injuries: [],
    budget: undefined,
    style: undefined,
    position: undefined,
    court_type: undefined,
    touch_preference: undefined,
    smash_frequency: undefined,
    height: undefined,
    weight: undefined,
    net_style: undefined,
    baseline_style: undefined,
    game_pace: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tooltip Component
  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative flex items-center ml-2">
      <HelpCircle size={14} className="text-zinc-600 hover:text-padel-lime cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 translate-y-2 group-hover:translate-y-0">
        <p className="text-[10px] text-zinc-300 leading-relaxed font-mono">{text}</p>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-b border-r border-zinc-700 rotate-45"></div>
      </div>
    </div>
  );

  // Validation Logic
  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (currentStep === 1) { // The Athlete (Bio)
        if (!formData.gender) newErrors.gender = "Select gender.";
        if (!formData.age || formData.age < 10) newErrors.age = "Invalid age.";
        if (!formData.height) newErrors.height = "Height required for leverage calc.";
        if (!formData.weight) newErrors.weight = "Weight required for stability calc.";
    }

    if (currentStep === 2) { // Medical
        if (formData.injuries?.length === 0) newErrors.injuries = "Select injury status.";
    }

    if (currentStep === 3) { // The Game (Context)
        if (!formData.experience) newErrors.experience = "Select level.";
        if (!formData.frequency) newErrors.frequency = "Select frequency.";
        if (!formData.court_type) newErrors.court_type = "Select court environment.";
    }

    if (currentStep === 4) { // Macro Tactics
        if (!formData.position) newErrors.position = "Select position.";
        if (!formData.style) newErrors.style = "Select archetype.";
        if (!formData.smash_frequency) newErrors.smash_frequency = "Select overhead frequency.";
    }

    if (currentStep === 5) { // Micro Tactics (Advanced)
        if (!formData.net_style) newErrors.net_style = "Select net behavior.";
        if (!formData.baseline_style) newErrors.baseline_style = "Select defense style.";
        if (!formData.game_pace) newErrors.game_pace = "Select preferred pace.";
    }

    if (currentStep === 6) { // Preferences
         if (!formData.touch_preference) newErrors.touch_preference = "Select feel preference.";
         if (!formData.budget) newErrors.budget = "Select budget.";
    }

    setErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
        if (step < totalSteps) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            finishQuiz();
        }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateProfile = (key: keyof PlayerProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    }
  };

  const toggleInjury = (injury: string) => {
      const current = formData.injuries || [];
      let updated;
      
      if (injury === 'None') {
          updated = ['None'];
      } else {
          const withoutNone = current.filter(i => i !== 'None');
          if (withoutNone.includes(injury)) {
              updated = withoutNone.filter(i => i !== injury);
          } else {
              updated = [...withoutNone, injury];
          }
      }
      if (updated.length === 0) updated = [];
      updateProfile('injuries', updated);
  };

  const finishQuiz = async () => {
    setIsAnalyzing(true);
    
    // Call the AI Service to process data and generate profile stats
    try {
        const finalProfile = await analyzeProfileWithAI(formData);
        localStorage.setItem('player_profile', JSON.stringify(finalProfile));
        navigate('/match');
    } catch (error) {
        console.error("Critical Failure in AI Service", error);
        navigate('/match');
    } finally {
        setIsAnalyzing(false);
    }
  };

  // Loading Screen for AI Analysis
  if (isAnalyzing) {
    return (
        <div className="min-h-screen bg-padel-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#a3e635_0%,_transparent_60%)] opacity-5 animate-pulse-slow"></div>
            
            <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-zinc-900 rounded-2xl flex items-center justify-center border border-padel-lime/30 shadow-[0_0_50px_rgba(163,230,53,0.1)] mb-8 animate-bounce">
                    <Cpu size={48} className="text-padel-lime animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                    Neural Engine <span className="text-padel-lime">Processing</span>
                </h2>
                <div className="flex flex-col gap-2 text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4">
                    <span className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>Simulating Game Scenarios...</span>
                    <span className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>Correlating Biometrics...</span>
                    <span className="animate-fade-in-up" style={{animationDelay: '1.5s'}}>Optimizing Gear Match...</span>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-padel-black pt-20 flex flex-col relative overflow-hidden">
      
      {/* Background Tech Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-padel-lime to-transparent opacity-20"></div>

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="max-w-2xl w-full">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-padel-lime">
                 <Activity size={20} />
               </div>
               <div>
                 <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Deep Analysis Module</div>
                 <div className="text-white font-bold uppercase italic">Phase {step} <span className="text-zinc-600">/ {totalSteps}</span></div>
               </div>
             </div>
             
             {/* Progress Bar */}
             <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-padel-lime transition-all duration-500 ease-out shadow-[0_0_10px_#a3e635]" 
                   style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
             </div>
          </div>

          <div className="bg-zinc-950/80 rounded-xl p-6 md:p-10 border border-white/5 shadow-2xl backdrop-blur-sm min-h-[450px] flex flex-col relative">
            
            {/* Validation Banner */}
            {Object.keys(errors).length > 0 && (
                <div className="absolute top-0 left-0 w-full bg-red-500/10 border-b border-red-500/20 px-6 py-2 flex items-center gap-2 animate-fade-in-down rounded-t-xl z-20">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-red-500 text-xs font-bold uppercase tracking-wide">Missing required data points</span>
                </div>
            )}

            {/* STEP 1: THE ATHLETE */}
            {step === 1 && (
              <div className="flex-grow space-y-8 animate-fade-in-up pt-2">
                <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">The Athlete</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">BIOMETRIC DATA FOR LEVERAGE & STABILITY CALCULATION</p>
                </div>
                
                {/* Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center mb-3">
                            <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Gender</label>
                            <Tooltip text="Baseline for grip size and standard weight references." />
                        </div>
                        <div className="flex gap-2">
                            {['M', 'F', 'Outro'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => updateProfile('gender', opt)}
                                className={`flex-1 py-3 px-4 rounded font-bold uppercase text-xs transition-all border ${
                                formData.gender === opt 
                                    ? 'bg-white text-padel-black border-white' 
                                    : errors.gender ? 'border-red-500/50' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'
                                }`}
                            >
                                {opt}
                            </button>
                            ))}
                        </div>
                    </div>

                    <div>
                         <div className="flex items-center mb-3">
                            <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Age</label>
                         </div>
                         <input 
                            type="number" 
                            className={`w-full px-4 py-3 bg-zinc-900 border rounded text-white focus:border-padel-lime outline-none font-mono placeholder-zinc-700 ${errors.age ? 'border-red-500' : 'border-zinc-800'}`}
                            placeholder="Years"
                            value={formData.age || ''}
                            onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                        />
                    </div>
                </div>

                {/* Biometrics */}
                <div>
                     <div className="flex items-center gap-2 mb-4">
                        <Scale size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Physique Analysis</label>
                        <Tooltip text="Heavier players need heavier rackets for stability (Newton's 2nd Law). Taller players have more leverage." />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <input 
                                type="number" 
                                className={`w-full px-4 py-3 bg-zinc-900 border rounded text-white focus:border-padel-lime outline-none font-mono ${errors.height ? 'border-red-500' : 'border-zinc-800'}`}
                                placeholder="Height (cm)"
                                value={formData.height || ''}
                                onChange={(e) => updateProfile('height', parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                             <input 
                                type="number" 
                                className={`w-full px-4 py-3 bg-zinc-900 border rounded text-white focus:border-padel-lime outline-none font-mono ${errors.weight ? 'border-red-500' : 'border-zinc-800'}`}
                                placeholder="Weight (kg)"
                                value={formData.weight || ''}
                                onChange={(e) => updateProfile('weight', parseInt(e.target.value))}
                            />
                        </div>
                     </div>
                </div>
              </div>
            )}

            {/* STEP 2: MEDICAL */}
            {step === 2 && (
              <div className="flex-grow space-y-8 animate-fade-in-up pt-2">
                 <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Medical History</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">SAFETY PROTOCOLS & VIBRATION DAMPENING</p>
                </div>
                
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <HeartPulse size={16} className="text-red-500" />
                        <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">Active Injuries</label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['None', 'Elbow', 'Shoulder', 'Wrist'].map(inj => (
                            <button
                                key={inj}
                                onClick={() => toggleInjury(inj)}
                                className={`py-4 px-4 rounded-lg text-sm font-bold uppercase border transition-all flex items-center justify-between ${
                                    formData.injuries?.includes(inj)
                                     ? 'bg-red-500/10 border-red-500 text-red-400'
                                     : errors.injuries ? 'border-red-500/50 text-zinc-500' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                }`}
                            >
                                {inj}
                                {formData.injuries?.includes(inj) && <Activity size={16} />}
                            </button>
                        ))}
                    </div>
                    <p className="mt-4 text-[10px] text-zinc-500 font-mono border-l-2 border-red-900 pl-3">
                        * Reporting arm injuries will automatically filter out high-balance and high-stiffness rackets to prevent aggravation.
                    </p>
                </div>
              </div>
            )}

            {/* STEP 3: CONTEXT */}
            {step === 3 && (
              <div className="flex-grow space-y-6 animate-fade-in-up pt-2">
                <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Game Context</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">ENVIRONMENT & EXPERIENCE LEVEL</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Experience */}
                    <div>
                        <div className="flex items-center mb-3">
                            <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Level</label>
                        </div>
                        <select 
                            className={`w-full px-4 py-3 bg-zinc-900 border rounded text-white focus:border-padel-lime outline-none text-xs font-bold uppercase ${errors.experience ? 'border-red-500' : 'border-zinc-800'}`}
                            value={formData.experience}
                            onChange={(e) => updateProfile('experience', e.target.value)}
                        >
                            <option value="" disabled>Select Level</option>
                            <option value="Iniciante">Beginner (Class 5/4)</option>
                            <option value="Intermédio">Intermediate (Class 3)</option>
                            <option value="Avançado">Advanced (Class 2/1)</option>
                            <option value="Profissional">Pro Tour</option>
                        </select>
                    </div>

                    {/* Frequency */}
                    <div>
                        <div className="flex items-center mb-3">
                            <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Frequency</label>
                        </div>
                        <select 
                            className={`w-full px-4 py-3 bg-zinc-900 border rounded text-white focus:border-padel-lime outline-none text-xs font-bold uppercase ${errors.frequency ? 'border-red-500' : 'border-zinc-800'}`}
                            value={formData.frequency}
                            onChange={(e) => updateProfile('frequency', e.target.value)}
                        >
                            <option value="" disabled>Select Frequency</option>
                            <option>Ocasional (1x mês)</option>
                            <option>1-2x semana</option>
                            <option>3-4x semana</option>
                            <option>Competição (+4x semana)</option>
                        </select>
                    </div>
                </div>

                {/* Court Type */}
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Sun size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Primary Court Environment</label>
                        <Tooltip text="Outdoor conditions (wind/cold) often require softer or more powerful rackets compared to fast Indoor courts." />
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'indoor', label: 'Indoor', icon: <Target size={14} /> },
                            { id: 'outdoor', label: 'Outdoor', icon: <Wind size={14} /> },
                            { id: 'mixed', label: 'Mixed', icon: <Activity size={14} /> }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => updateProfile('court_type', opt.id)}
                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded border transition-all ${
                                    formData.court_type === opt.id 
                                     ? 'bg-padel-lime/10 border-padel-lime text-white'
                                     : errors.court_type ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                }`}
                            >
                                {opt.icon}
                                <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                            </button>
                        ))}
                     </div>
                </div>
              </div>
            )}

            {/* STEP 4: MACRO TACTICS */}
            {step === 4 && (
              <div className="flex-grow space-y-8 animate-fade-in-up pt-2">
                 <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Macro Strategy</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">POSITIONING & GENERAL ARCHETYPE</p>
                </div>
                
                {/* Position */}
                <div>
                  <label className="block text-xs font-bold text-padel-lime mb-3 uppercase tracking-wider font-mono">Court Side</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: 'esquerda', label: 'Backhand (Left)', sub: 'Aggressive' },
                      { val: 'direita', label: 'Forehand (Right)', sub: 'Tactical' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => updateProfile('position', opt.val)}
                        className={`text-left p-4 rounded border transition-all ${
                          formData.position === opt.val 
                            ? 'border-padel-lime bg-padel-lime/5' 
                            : errors.position ? 'border-red-500/50' : 'border-zinc-800 bg-transparent hover:bg-zinc-900'
                        }`}
                      >
                        <div className={`font-black text-sm uppercase mb-1 ${formData.position === opt.val ? 'text-white' : 'text-zinc-400'}`}>{opt.label}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Archetype */}
                <div>
                  <label className="block text-xs font-bold text-padel-lime mb-3 uppercase tracking-wider font-mono">Playstyle Archetype</label>
                  <div className="flex gap-2">
                    {[
                      { val: 'ofensivo', label: 'Attacker' },
                      { val: 'equilibrado', label: 'Hybrid' },
                      { val: 'consistente', label: 'Defender' }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => updateProfile('style', opt.val)}
                        className={`flex-1 py-3 px-2 rounded border text-[10px] md:text-xs font-bold uppercase transition-all ${
                          formData.style === opt.val 
                            ? 'bg-white text-padel-black border-white' 
                            : errors.style ? 'border-red-500/50' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smash Frequency */}
                <div>
                     <div className="flex items-center gap-2 mb-3">
                        <Gauge size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Smash Frequency</label>
                        <Tooltip text="How often do you attempt a smash to finish the point? High frequency demands specific head-heavy balances." />
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'low', label: 'Low', sub: 'Placement' },
                            { id: 'medium', label: 'Med', sub: 'Mixed' },
                            { id: 'high', label: 'High', sub: 'Power' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => updateProfile('smash_frequency', opt.id)}
                                className={`p-3 rounded border transition-all ${
                                    formData.smash_frequency === opt.id 
                                     ? 'bg-padel-lime/10 border-padel-lime text-white'
                                     : errors.smash_frequency ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                }`}
                            >
                                <div className="font-bold uppercase text-xs">{opt.label}</div>
                            </button>
                        ))}
                     </div>
                </div>
              </div>
            )}

             {/* STEP 5: TACTICAL DNA (NEW) */}
             {step === 5 && (
              <div className="flex-grow space-y-8 animate-fade-in-up pt-2">
                 <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Tactical DNA</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">MICRO-STRATEGY & SITUATIONAL PREFERENCES</p>
                </div>
                
                {/* Net Style */}
                <div>
                   <div className="flex items-center gap-2 mb-3">
                        <Sword size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Net Behavior</label>
                        <Tooltip text="How do you handle volleys? Do you punch through them or place them?" />
                    </div>
                   <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'aggressive', label: 'Aggressive', desc: 'Punch Volleys' },
                        { id: 'control', label: 'Placement', desc: 'Surgical Setup' },
                        { id: 'blocking', label: 'Blocker', desc: 'Defensive Net' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateProfile('net_style', opt.id)}
                          className={`p-3 rounded border text-left transition-all ${
                            formData.net_style === opt.id 
                              ? 'bg-zinc-800 border-padel-lime text-white' 
                              : errors.net_style ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="font-bold uppercase text-[10px] mb-1">{opt.label}</div>
                          <div className="text-[9px] font-mono opacity-60">{opt.desc}</div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Baseline Style */}
                <div>
                   <div className="flex items-center gap-2 mb-3">
                        <Shield size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Defense Style</label>
                    </div>
                   <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'lob', label: 'Lob Master', desc: 'High Balloons' },
                        { id: 'counter', label: 'Counter', desc: 'Chiquitas/Fast' },
                        { id: 'power', label: 'Power Def', desc: 'Hard blocks' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateProfile('baseline_style', opt.id)}
                          className={`p-3 rounded border text-left transition-all ${
                            formData.baseline_style === opt.id 
                              ? 'bg-zinc-800 border-padel-lime text-white' 
                              : errors.baseline_style ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="font-bold uppercase text-[10px] mb-1">{opt.label}</div>
                          <div className="text-[9px] font-mono opacity-60">{opt.desc}</div>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Game Pace */}
                <div>
                   <div className="flex items-center gap-2 mb-3">
                        <Zap size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Preferred Pace</label>
                    </div>
                   <div className="flex gap-3">
                      {[
                        { id: 'fast', label: 'Explosive / Fast' },
                        { id: 'variable', label: 'Variable / Adaptive' },
                        { id: 'slow', label: 'Slow / Strategic' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => updateProfile('game_pace', opt.id)}
                          className={`flex-1 p-3 rounded border text-center transition-all ${
                            formData.game_pace === opt.id 
                              ? 'bg-zinc-800 border-padel-lime text-white' 
                              : errors.game_pace ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                          }`}
                        >
                          <div className="font-bold uppercase text-[10px]">{opt.label}</div>
                        </button>
                      ))}
                   </div>
                </div>

              </div>
            )}

            {/* STEP 6: PREFERENCES */}
            {step === 6 && (
               <div className="flex-grow space-y-8 animate-fade-in-up pt-2">
                 <div className="border-b border-zinc-800 pb-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Final Config</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">SENSORIAL PREFERENCES & INVESTMENT</p>
                </div>

                {/* Touch */}
                <div>
                     <div className="flex items-center gap-2 mb-4">
                        <Activity size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Touch Preference</label>
                        <Tooltip text="Do you prefer the ball to exit fast (Soft/Comfort) or do you prefer to feel the impact (Hard/Control)?" />
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'soft', label: 'Soft', sub: 'Comfort & Exit' },
                            { id: 'medium', label: 'Medium', sub: 'Balanced' },
                            { id: 'hard', label: 'Hard', sub: 'Dry & Control' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => updateProfile('touch_preference', opt.id)}
                                className={`text-left p-3 rounded border transition-all ${
                                    formData.touch_preference === opt.id 
                                     ? 'bg-white text-padel-black border-white'
                                     : errors.touch_preference ? 'border-red-500/50' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                }`}
                            >
                                <div className="font-bold uppercase text-xs mb-1">{opt.label}</div>
                                <div className="text-[9px] font-mono opacity-60 leading-tight">{opt.sub}</div>
                            </button>
                        ))}
                     </div>
                </div>

                {/* Budget */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Wallet size={14} className="text-padel-lime" />
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider font-mono">Budget Tier</label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'economy', label: 'Economy', sub: '< 160€' },
                            { id: 'performance', label: 'Performance', sub: '160€ - 260€' },
                            { id: 'premium', label: 'Premium', sub: '> 260€' },
                            { id: 'unlimited', label: 'Unlimited', sub: 'Any Price' }
                        ].map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => updateProfile('budget', opt.id)}
                                className={`text-left p-3 rounded border transition-all ${
                                    formData.budget === opt.id 
                                     ? 'bg-padel-lime/10 border-padel-lime text-white'
                                     : errors.budget ? 'border-red-500/50' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                                }`}
                            >
                                <div className="font-bold uppercase text-xs">{opt.label}</div>
                                <div className="text-[10px] font-mono opacity-70">{opt.sub}</div>
                            </button>
                        ))}
                    </div>
                </div>

               </div>
            )}

            {/* Footer Nav */}
            <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${step === 1 ? 'text-zinc-800' : 'text-zinc-400 hover:text-white'}`}
              >
                <ArrowLeft size={14} /> Back
              </button>
              
              <button 
                onClick={handleNext}
                disabled={isAnalyzing}
                className="bg-white hover:bg-zinc-200 text-padel-black px-8 py-3 rounded font-black uppercase tracking-wide text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-lg shadow-white/10"
              >
                {step === totalSteps ? 'Process with AI' : 'Next Phase'}
                {step !== totalSteps && <ArrowRight size={14} />}
                {step === totalSteps && <Cpu size={14} />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
