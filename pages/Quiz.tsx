
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayerProfile } from '../types';
import { analyzeProfileWithAI } from '../utils/aiService';
import { ArrowRight, ArrowLeft, Activity, Loader2, AlertCircle } from 'lucide-react';

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
    game_pace: undefined,
    age: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) { 
        if (!formData.gender) newErrors.gender = "Escolhe o teu género.";
        if (!formData.age || formData.age < 5) newErrors.age = "Diz-nos a tua idade.";
        if (!formData.height) newErrors.height = "Indica a tua altura.";
        if (!formData.weight) newErrors.weight = "Indica o teu peso.";
    }
    if (currentStep === 2) { 
        if (!formData.injuries || formData.injuries.length === 0) newErrors.injuries = "Escolhe pelo menos uma opção.";
    }
    if (currentStep === 3) { 
        if (!formData.experience) newErrors.experience = "Diz-nos o teu nível.";
        if (!formData.frequency) newErrors.frequency = "Quantas vezes jogas?";
        if (!formData.court_type) newErrors.court_type = "Onde costumas jogar?";
    }
    if (currentStep === 4) { 
        if (!formData.position) newErrors.position = "Em que lado jogas?";
        if (!formData.style) newErrors.style = "Qual o teu estilo?";
    }
    if (currentStep === 5) { 
        if (!formData.smash_frequency) newErrors.smash_frequency = "Gostas de smashar?";
        if (!formData.net_style) newErrors.net_style = "Como és na rede?";
        if (!formData.baseline_style) newErrors.baseline_style = "Como és no fundo?";
        if (!formData.game_pace) newErrors.game_pace = "Qual o ritmo do jogo?";
    }
    if (currentStep === 6) { 
         if (!formData.touch_preference) newErrors.touch_preference = "Que toque preferes?";
         if (!formData.budget) newErrors.budget = "Qual o teu orçamento?";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (step > 1) {
        setStep(step - 1);
        setErrors({});
    }
  };

  const updateProfile = (key: keyof PlayerProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Limpar erro do campo quando preenchido
    if (errors[key]) {
        const newErrors = { ...errors };
        delete newErrors[key];
        setErrors(newErrors);
    }
  };

  const toggleInjury = (injury: string) => {
      const current = formData.injuries || [];
      let updated;
      if (injury === 'None') {
          updated = ['None'];
      } else {
          const withoutNone = current.filter(i => i !== 'None');
          updated = withoutNone.includes(injury) 
            ? withoutNone.filter(i => i !== injury) 
            : [...withoutNone, injury];
          if (updated.length === 0) updated = [];
      }
      updateProfile('injuries', updated);
  };

  const finishQuiz = async () => {
    setIsAnalyzing(true);
    try {
        const finalProfile = await analyzeProfileWithAI(formData);
        localStorage.setItem('player_profile', JSON.stringify(finalProfile));
        navigate('/match');
    } catch (error) {
        console.error("Erro na análise IA", error);
        navigate('/match');
    } finally {
        setIsAnalyzing(false);
    }
  };

  const ErrorMsg = ({ field }: { field: string }) => errors[field] ? (
    <div className="flex items-center gap-1 mt-1 text-red-500 text-[10px] font-bold uppercase animate-pulse">
        <AlertCircle size={12} /> {errors[field]}
    </div>
  ) : null;

  if (isAnalyzing) {
    return (
        <div className="min-h-screen bg-padel-black flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <Loader2 size={48} className="text-padel-lime animate-spin mx-auto mb-6" />
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    A preparar as tuas <span className="text-padel-lime">Recomendações</span>
                </h2>
                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4">
                    Estamos a cruzar o teu perfil com a nossa base de dados...
                </p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-padel-black pt-20 flex flex-col relative overflow-hidden">
      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="max-w-2xl w-full">
          
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-padel-lime">
                 <Activity size={20} />
               </div>
               <div>
                 <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Avaliação de Equipamento</div>
                 <div className="text-white font-bold uppercase italic">Passo {step} <span className="text-zinc-600">/ {totalSteps}</span></div>
               </div>
             </div>
             
             <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-padel-lime transition-all duration-500 ease-out" 
                   style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
             </div>
          </div>

          <div className="bg-zinc-950/80 rounded-xl p-6 md:p-10 border border-white/5 shadow-2xl backdrop-blur-sm min-h-[500px] flex flex-col">
            
            {step === 1 && (
              <div className="flex-grow space-y-8 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Fala-nos de ti</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">QUEREMOS CONHECER O TEU PERFIL FÍSICO</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Género</label>
                        <div className="flex gap-2">
                            {['M', 'F'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => updateProfile('gender', opt)}
                                className={`flex-1 py-3 px-4 rounded font-bold text-xs border transition-all ${
                                formData.gender === opt 
                                    ? 'bg-padel-lime text-padel-black border-padel-lime' 
                                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'
                                }`}
                            >
                                {opt === 'M' ? 'Masculino' : 'Feminino'}
                            </button>
                            ))}
                        </div>
                        <ErrorMsg field="gender" />
                    </div>

                    <div>
                         <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Idade</label>
                         <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white focus:border-padel-lime outline-none"
                            placeholder="Ex: 30"
                            value={formData.age || ''}
                            onChange={(e) => updateProfile('age', parseInt(e.target.value))}
                        />
                        <ErrorMsg field="age" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                         <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Altura (cm)</label>
                         <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white focus:border-padel-lime outline-none"
                            placeholder="Ex: 175"
                            value={formData.height || ''}
                            onChange={(e) => updateProfile('height', parseInt(e.target.value))}
                        />
                        <ErrorMsg field="height" />
                    </div>
                    <div>
                         <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Peso (kg)</label>
                         <input 
                            type="number" 
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white focus:border-padel-lime outline-none"
                            placeholder="Ex: 75"
                            value={formData.weight || ''}
                            onChange={(e) => updateProfile('weight', parseInt(e.target.value))}
                        />
                        <ErrorMsg field="weight" />
                    </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex-grow space-y-8 animate-fade-in-up">
                 <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Sentes alguma dor?</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">PARA TE RECOMENDARMOS UMA RAQUETE CONFORTÁVEL</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { id: 'None', label: 'Estou impecável' },
                        { id: 'Elbow', label: 'Cotovelo (Epicondilite)' },
                        { id: 'Shoulder', label: 'Dores no Ombro' },
                        { id: 'Wrist', label: 'Dores no Pulso' }
                    ].map(inj => (
                        <button
                            key={inj.id}
                            onClick={() => toggleInjury(inj.id)}
                            className={`py-4 px-4 rounded-lg text-sm font-bold uppercase border transition-all text-left ${
                                formData.injuries?.includes(inj.id)
                                 ? 'bg-red-500/10 border-red-500 text-red-400'
                                 : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                        >
                            {inj.label}
                        </button>
                    ))}
                </div>
                <ErrorMsg field="injuries" />
              </div>
            )}

            {step === 3 && (
              <div className="flex-grow space-y-6 animate-fade-in-up">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">O teu percurso</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">NÍVEL E FREQUÊNCIA DE JOGO</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Qual o teu nível?</label>
                        <select 
                            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded text-white focus:border-padel-lime outline-none text-xs font-bold uppercase"
                            value={formData.experience}
                            onChange={(e) => updateProfile('experience', e.target.value)}
                        >
                            <option value="">Escolher nível...</option>
                            <option value="Iniciante">Acabei de começar</option>
                            <option value="Intermédio">Jogo 1-2 vezes por semana</option>
                            <option value="Avançado">Jogo torneios / Nível alto</option>
                            <option value="Profissional">Pro / Treinador</option>
                        </select>
                        <ErrorMsg field="experience" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Quantas vezes jogas por semana?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['1x', '2-3x', '4x+'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateProfile('frequency', opt)}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.frequency === opt 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="frequency" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Onde costumas jogar?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Indoor', 'Outdoor', 'Misto'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateProfile('court_type', opt.toLowerCase())}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.court_type === opt.toLowerCase() 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="court_type" />
                    </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex-grow space-y-8 animate-fade-in-up">
                 <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">O teu jogo</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">POSIÇÃO E ESTILO</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-padel-lime mb-3 uppercase tracking-wider">Lado do Campo</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { val: 'esquerda', label: 'Esquerda', sub: 'Ataque' },
                          { val: 'direita', label: 'Direita', sub: 'Tática/Defesa' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => updateProfile('position', opt.val)}
                            className={`text-left p-4 rounded border transition-all ${
                              formData.position === opt.val 
                                ? 'border-padel-lime bg-padel-lime/5' 
                                : 'border-zinc-800 bg-transparent hover:bg-zinc-900'
                            }`}
                          >
                            <div className="font-black text-sm uppercase text-white">{opt.label}</div>
                            <div className="text-[10px] text-zinc-500 font-mono">{opt.sub}</div>
                          </button>
                        ))}
                      </div>
                      <ErrorMsg field="position" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-padel-lime mb-3 uppercase tracking-wider">Estilo de Jogo</label>
                      <div className="flex gap-2">
                        {[
                          { val: 'ofensivo', label: 'Agressivo' },
                          { val: 'equilibrado', label: 'Híbrido' },
                          { val: 'consistente', label: 'Controlo' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => updateProfile('style', opt.val)}
                            className={`flex-1 py-3 px-2 rounded border text-[10px] font-bold uppercase transition-all ${
                              formData.style === opt.val 
                                ? 'bg-white text-padel-black border-white' 
                                : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <ErrorMsg field="style" />
                    </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="flex-grow space-y-8 animate-fade-in-up overflow-y-auto max-h-[500px] pr-2 no-scrollbar">
                 <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Como bates na bola?</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">DETALHES TÁCTICOS</p>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-2 block">Smash (Remate)?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['low', 'medium', 'high'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateProfile('smash_frequency', opt)}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.smash_frequency === opt 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt === 'low' ? 'Pouco' : opt === 'medium' ? 'Normal' : 'Muito'}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="smash_frequency" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-2 block">Na rede (Voleio)?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'aggressive', label: 'Bato forte' },
                                { id: 'control', label: 'Coloco a bola' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => updateProfile('net_style', opt.id)}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.net_style === opt.id 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="net_style" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-2 block">No fundo do campo?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'lob', label: 'Lançar balões' },
                                { id: 'counter', label: 'Contra-ataque' },
                                { id: 'power', label: 'Bater forte' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => updateProfile('baseline_style', opt.id)}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.baseline_style === opt.id 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="baseline_style" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-2 block">Ritmo de jogo?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['fast', 'slow', 'variable'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => updateProfile('game_pace', opt)}
                                    className={`p-3 rounded border text-[10px] font-bold uppercase transition-all ${
                                        formData.game_pace === opt 
                                         ? 'bg-padel-lime text-padel-black border-padel-lime'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                                    }`}
                                >
                                    {opt === 'fast' ? 'Rápido' : opt === 'slow' ? 'Lento' : 'Misto'}
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="game_pace" />
                    </div>
                </div>
              </div>
            )}

            {step === 6 && (
               <div className="flex-grow space-y-8 animate-fade-in-up">
                 <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Últimas preferências</h2>
                    <p className="text-zinc-500 font-mono text-xs mt-1">TOQUE E ORÇAMENTO</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Como gostas do toque da raquete?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'soft', label: 'Macio', sub: 'Mais saída' },
                                { id: 'medium', label: 'Médio', sub: 'Híbrido' },
                                { id: 'hard', label: 'Duro', sub: 'Mais força' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => updateProfile('touch_preference', opt.id)}
                                    className={`text-left p-3 rounded border transition-all ${
                                        formData.touch_preference === opt.id 
                                         ? 'bg-white text-padel-black border-white'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                    }`}
                                >
                                    <div className="font-bold uppercase text-xs">{opt.label}</div>
                                    <div className="text-[9px] font-mono opacity-60">{opt.sub}</div>
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="touch_preference" />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-padel-lime uppercase tracking-wider mb-3 block">Orçamento?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'economy', label: 'Económico', sub: 'Até 160€' },
                                { id: 'performance', label: 'Performance', sub: 'Até 260€' },
                                { id: 'premium', label: 'Premium', sub: 'Top Gama' },
                                { id: 'unlimited', label: 'Qualquer Preço' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => updateProfile('budget', opt.id)}
                                    className={`text-left p-3 rounded border transition-all ${
                                        formData.budget === opt.id 
                                         ? 'bg-padel-lime/10 border-padel-lime text-white'
                                         : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-900'
                                    }`}
                                >
                                    <div className="font-bold uppercase text-xs">{opt.label}</div>
                                    <div className="text-[10px] font-mono opacity-70">{opt.sub}</div>
                                </button>
                            ))}
                        </div>
                        <ErrorMsg field="budget" />
                    </div>
                </div>
               </div>
            )}

            <div className="mt-8 flex justify-between items-center border-t border-white/5 pt-6">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${step === 1 ? 'text-zinc-800' : 'text-zinc-400 hover:text-white'}`}
              >
                <ArrowLeft size={14} /> Voltar
              </button>
              
              <button 
                onClick={handleNext}
                className="bg-white hover:bg-zinc-200 text-padel-black px-8 py-3 rounded font-black uppercase tracking-wide text-xs flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
              >
                {step === totalSteps ? 'Finalizar' : 'Continuar'}
                <ArrowRight size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
