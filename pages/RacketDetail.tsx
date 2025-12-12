
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RACKETS } from '../data/rackets';
import { ArrowLeft, Check, ShoppingCart, ExternalLink, Zap, Activity, Info, Scale, Box, Layers, Ruler, Users, Target, FileText, MessageSquare, Star, Send, User as UserIcon, Clock } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { getRacketMatch } from '../utils/matchLogic';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Review, RacketCharacteristics } from '../types';

const RacketDetail = () => {
  const { id } = useParams();
  const { addToCompare, isInCompare, reviews, addReview } = useApp();
  const { user, isAuthenticated } = useAuth();
  const racket = RACKETS.find(r => r.id === id);

  // Detailed Review State
  const [specs, setSpecs] = useState<RacketCharacteristics>({
    power: 5,
    control: 5,
    comfort: 5,
    maneuverability: 5,
    sweetspot: 5,
    rigidity: 5
  });
  
  const [comment, setComment] = useState('');
  const [playtime, setPlaytime] = useState('1 Month');
  const [overallRating, setOverallRating] = useState(5);

  // Recalculate overall rating whenever specs change
  useEffect(() => {
    const values = Object.values(specs);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    setOverallRating(parseFloat(avg.toFixed(1)));
  }, [specs]);

  if (!racket) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-padel-black text-white">
        <h2 className="text-2xl font-black uppercase italic mb-4">404 - Gear Not Found</h2>
        <Link to="/explore" className="text-padel-lime hover:underline font-mono text-xs uppercase">Return to Database</Link>
      </div>
    );
  }

  const matchScore = getRacketMatch(racket);
  const isCompared = isInCompare(racket.id);

  // Get User Reviews for this racket, sorted by newest first
  const racketReviews = reviews
    .filter(r => r.racketId === racket.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const avgRating = racketReviews.length > 0
    ? (racketReviews.reduce((acc, r) => acc + r.rating, 0) / racketReviews.length).toFixed(1)
    : null;

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAuthenticated || !user) return;

      const newReview: Review = {
          id: Date.now().toString(),
          racketId: racket.id,
          userId: user.id,
          userName: user.name,
          date: new Date().toISOString(),
          rating: overallRating,
          characteristics: { ...specs },
          comment: comment,
          playtime: playtime
      };
      
      addReview(newReview);
      
      // Reset Form
      setComment('');
      setSpecs({
        power: 5, control: 5, comfort: 5, maneuverability: 5, sweetspot: 5, rigidity: 5
      });
      setPlaytime('1 Month');
  };

  const updateSpec = (key: keyof RacketCharacteristics, value: number) => {
      setSpecs(prev => ({ ...prev, [key]: value }));
  };

  const chartData = [
    { subject: 'Power', A: racket.characteristics.power, fullMark: 10 },
    { subject: 'Control', A: racket.characteristics.control, fullMark: 10 },
    { subject: 'Comfort', A: racket.characteristics.comfort, fullMark: 10 },
    { subject: 'Maneuver.', A: racket.characteristics.maneuverability, fullMark: 10 },
    { subject: 'Sweetspot', A: racket.characteristics.sweetspot, fullMark: 10 },
    { subject: 'Rigidity', A: racket.characteristics.rigidity, fullMark: 10 },
  ];

  // Helper for Spec Item
  const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-padel-lime/30 transition-colors">
      <div className="p-2 bg-zinc-950 rounded text-zinc-500">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{label}</div>
        <div className="text-white font-bold text-sm uppercase">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      
      {/* Breadcrumb & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
         <div className="flex justify-between items-center">
           <Link to="/explore" className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors">
             <ArrowLeft size={14} /> Back to Gear Lab
           </Link>
           
           <button 
             onClick={() => !isCompared && addToCompare(racket)}
             disabled={isCompared}
             className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest border transition-all ${
               isCompared 
                 ? 'border-padel-lime text-padel-lime bg-padel-lime/10 cursor-default'
                 : 'border-zinc-700 text-zinc-300 hover:border-white hover:text-white'
             }`}
           >
             {isCompared ? 'Added to Compare' : '+ Add to Compare'}
           </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Visuals & Key Stats (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Main Image Card */}
            <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 p-8 flex items-center justify-center min-h-[500px] overflow-hidden group shadow-2xl">
               {/* Background Tech Graphics */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#27272a_0%,_transparent_70%)] opacity-50"></div>
               <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Activity className="text-padel-lime" size={120} strokeWidth={0.5} />
               </div>

               {/* Match Score Badge */}
               {matchScore > 0 && (
                 <div className="absolute top-6 left-6 z-20 animate-fade-in-up">
                    <div className="bg-padel-black/90 backdrop-blur border border-padel-lime text-padel-lime px-4 py-2 rounded text-sm font-bold shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center gap-2 font-mono">
                      <Zap size={14} fill="currentColor" />
                      MATCH INDEX: {matchScore}%
                    </div>
                 </div>
               )}

               <img 
                 src={racket.image_url} 
                 alt={racket.model} 
                 className="relative z-10 w-full max-h-[420px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2" 
               />
            </div>

            {/* Radar Chart Panel */}
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white uppercase italic flex items-center gap-2">
                     <Activity size={16} className="text-padel-lime" /> Performance Radar
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    V2.0 ANALYTICS
                  </span>
                </div>
                <div className="h-[250px] w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#3f3f46" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar
                        name={racket.model}
                        dataKey="A"
                        stroke="#a3e635"
                        strokeWidth={2}
                        fill="#a3e635"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
            </div>
          </div>

          {/* Right Column: Info & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
             
             {/* Header Info */}
             <div>
                <div className="flex items-center gap-3 mb-4">
                    <Link to={`/brands/${racket.brand}`} className="text-padel-black font-bold tracking-wider uppercase text-[10px] bg-padel-lime px-2 py-1 rounded hover:bg-white transition-colors">
                      {racket.brand}
                    </Link>
                    <span className="text-zinc-500 text-xs font-mono font-bold border border-zinc-800 px-2 py-1 rounded">
                      MODEL YEAR {racket.year}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-[0.9]">
                  {racket.model}
                </h1>
                
                {/* NEW: Player Profile & Summary Section */}
                <div className="bg-zinc-900/50 border-l-2 border-padel-lime rounded-r-xl overflow-hidden">
                   
                   {/* Target Audience & Style Row */}
                   {(racket.targetPlayer || racket.gameStyle) && (
                      <div className="flex flex-col sm:flex-row border-b border-zinc-800">
                          {racket.targetPlayer && (
                             <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-zinc-800 flex items-center gap-3">
                                <div className="p-2 bg-zinc-950 rounded text-blue-400">
                                   <Users size={18} />
                                </div>
                                <div>
                                   <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Destinado a</div>
                                   <div className="text-white text-xs font-bold uppercase">{racket.targetPlayer}</div>
                                </div>
                             </div>
                          )}
                          {racket.gameStyle && (
                             <div className="flex-1 p-4 flex items-center gap-3">
                                <div className="p-2 bg-zinc-950 rounded text-padel-lime">
                                   <Target size={18} />
                                </div>
                                <div>
                                   <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Tipo de Jogo</div>
                                   <div className="text-white text-xs font-bold uppercase">{racket.gameStyle}</div>
                                </div>
                             </div>
                          )}
                      </div>
                   )}

                   {/* Generic Summary */}
                   <div className="p-6">
                      <div className="flex items-center gap-2 mb-2 text-zinc-500">
                         <FileText size={14} />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Resumo & Análise</span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed font-light text-sm md:text-base">
                        {racket.review_summary}
                      </p>
                   </div>
                </div>
             </div>

             {/* Tech Specs Grid */}
             <div>
               <h3 className="text-lg font-black text-white uppercase italic mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-padel-lime skew-x-[-12deg]"></span> Technical Specs
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <SpecItem icon={Box} label="Shape Geometry" value={racket.shape} />
                  <SpecItem icon={Scale} label="Balance Point" value={racket.balance} />
                  <SpecItem icon={Ruler} label="Weight Range" value={`${racket.weight_min} - ${racket.weight_max}g`} />
                  <SpecItem icon={Layers} label="Core Material" value={racket.core_type} />
               </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Technologies */}
                <div>
                   <h3 className="text-lg font-black text-white uppercase italic mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-violet-500 skew-x-[-12deg]"></span> Technologies
                   </h3>
                   <div className="space-y-3">
                     {racket.technologies.map((tech, idx) => (
                       <div key={idx} className="flex items-start gap-3 group">
                         <div className="mt-1 w-4 h-4 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-padel-lime group-hover:text-padel-black transition-colors text-zinc-500">
                            <Check size={10} strokeWidth={4} />
                         </div>
                         <div>
                           <div className="font-bold text-sm text-zinc-200 group-hover:text-padel-lime transition-colors uppercase">{tech.label}</div>
                           <div className="text-[10px] text-zinc-500 font-mono leading-relaxed mt-0.5">{tech.note}</div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Characteristics Bars */}
                <div>
                   <h3 className="text-lg font-black text-white uppercase italic mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-blue-500 skew-x-[-12deg]"></span> Characteristics
                   </h3>
                   <div className="space-y-4">
                      {[
                        { l: 'Power Output', v: racket.characteristics.power },
                        { l: 'Control', v: racket.characteristics.control },
                        { l: 'Comfort', v: racket.characteristics.comfort },
                      ].map((stat, i) => (
                        <div key={i}>
                           <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-zinc-500">
                              <span>{stat.l}</span>
                              <span className="text-white font-mono">{stat.v}/10</span>
                           </div>
                           <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-white" style={{ width: `${stat.v * 10}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Market Data (Prices) */}
             <div className="pt-6 border-t border-zinc-800">
                <h3 className="text-lg font-black text-white uppercase italic mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} className="text-zinc-600" /> Market Data
                </h3>
                
                <div className="space-y-2">
                  {racket.prices.length > 0 ? racket.prices.map((price, idx) => (
                    <a 
                      key={idx} 
                      href={price.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-padel-lime hover:bg-zinc-800 transition-all group"
                    >
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-white flex items-center justify-center text-black font-bold text-xs uppercase">
                             {price.store ? price.store.substring(0,2) : '??'}
                          </div>
                          <div>
                             <div className="font-bold text-zinc-200 text-sm uppercase tracking-wide">{price.store || 'Unknown'}</div>
                             <div className="text-[10px] text-zinc-500 font-mono">IN STOCK</div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className="text-xl font-bold text-padel-lime font-mono">{price.price}€</span>
                          <ExternalLink size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                       </div>
                    </a>
                  )) : (
                    <div className="p-4 bg-zinc-900 rounded-xl text-zinc-500 text-xs font-mono border border-dashed border-zinc-800 flex items-center gap-2">
                      <Info size={14} /> NO LIVE PRICE DATA. ESTIMATED RANGE: <span className="text-white">{racket.price_range}</span>
                    </div>
                  )}
                </div>
             </div>

          </div>
        </div>
        
        {/* REVIEWS SECTION */}
        <div className="mt-16 border-t border-zinc-800 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic flex items-center gap-3">
                      <span className="w-2 h-6 bg-padel-lime skew-x-[-12deg] block"></span>
                      Community Reviews
                   </h3>
                   <p className="text-zinc-500 text-xs font-mono mt-1 uppercase tracking-wide">
                      {racketReviews.length} Verified Player Reports
                   </p>
                </div>
                {avgRating && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <div className="text-right">
                           <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Avg. Score</div>
                           <div className="text-2xl font-black text-white">{avgRating}<span className="text-zinc-600 text-sm">/10</span></div>
                        </div>
                        <div className="h-10 w-px bg-zinc-800"></div>
                        <div className="flex gap-1 text-padel-lime">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={16} fill={parseFloat(avgRating) >= i * 2 ? "currentColor" : "none"} strokeWidth={3} className={parseFloat(avgRating) < i * 2 && parseFloat(avgRating) > (i*2)-2 ? 'opacity-50' : ''} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Review Form */}
                <div className="lg:col-span-4">
                   <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 sticky top-24">
                       <h4 className="font-bold text-white uppercase italic mb-4 flex items-center gap-2">
                          <MessageSquare size={16} className="text-padel-lime" /> Submit Analysis
                       </h4>
                       
                       {!isAuthenticated ? (
                           <div className="text-center py-6">
                               <p className="text-zinc-500 text-xs mb-4">Log in to share your technical analysis.</p>
                               <Link to="/login" className="block w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase text-xs rounded transition-colors">
                                   Login to Review
                               </Link>
                           </div>
                       ) : (
                           <form onSubmit={handleSubmitReview} className="space-y-5">
                               
                               <div className="space-y-3">
                                   <div className="flex justify-between items-center mb-1">
                                       <span className="text-[10px] font-bold text-white uppercase tracking-wider">Overall Rating</span>
                                       <span className="text-lg font-black text-padel-lime">{overallRating}/10</span>
                                   </div>
                                   
                                   {/* Characteristic Sliders */}
                                   {(['power', 'control', 'comfort', 'maneuverability', 'sweetspot', 'rigidity'] as Array<keyof RacketCharacteristics>).map((stat) => (
                                     <div key={stat}>
                                        <div className="flex justify-between mb-1">
                                            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{stat === 'rigidity' ? 'Hardness' : stat}</label>
                                            <span className="text-[9px] font-mono text-white">{specs[stat]}</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="10" 
                                            step="0.5"
                                            value={specs[stat]}
                                            onChange={(e) => updateSpec(stat, parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-padel-lime hover:accent-lime-300"
                                        />
                                     </div>
                                   ))}
                               </div>

                               <div>
                                   <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Playtime Duration</label>
                                   <select 
                                     value={playtime}
                                     onChange={(e) => setPlaytime(e.target.value)}
                                     className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs p-3 rounded focus:border-padel-lime outline-none font-mono"
                                   >
                                       <option>Demo / Test</option>
                                       <option>1 Month</option>
                                       <option>3 Months</option>
                                       <option>6 Months+</option>
                                       <option>1 Year+</option>
                                   </select>
                               </div>

                               <div>
                                   <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Detailed Comments</label>
                                   <textarea 
                                     rows={4}
                                     value={comment}
                                     onChange={(e) => setComment(e.target.value)}
                                     placeholder="Describe the sensations, output, and feel..."
                                     className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm p-3 rounded focus:border-padel-lime outline-none resize-none"
                                   />
                               </div>

                               <button 
                                 type="submit"
                                 className="w-full py-3 bg-white hover:bg-zinc-200 text-padel-black font-black uppercase text-xs rounded transition-colors flex items-center justify-center gap-2"
                               >
                                   Submit Report <Send size={14} />
                               </button>
                           </form>
                       )}
                   </div>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-8 space-y-4">
                    {racketReviews.length > 0 ? (
                        racketReviews.map((review) => (
                            <div key={review.id} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800">
                                            <UserIcon size={20} className="text-zinc-600" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">{review.userName}</div>
                                            <div className="text-[10px] text-zinc-500 font-mono uppercase flex items-center gap-2">
                                                <span>{new Date(review.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1"><Clock size={10} /> {review.playtime}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-padel-lime/10 px-3 py-1.5 rounded border border-padel-lime/20 flex items-center gap-1.5">
                                        <Zap size={12} className="text-padel-lime fill-current" />
                                        <span className="text-sm font-black text-padel-lime font-mono">{review.rating}</span>
                                    </div>
                                </div>
                                
                                {/* Characteristics Mini-Grid */}
                                {review.characteristics && (
                                    <div className="mb-4 grid grid-cols-3 sm:grid-cols-6 gap-2 border-y border-white/5 py-3">
                                        {(Object.entries(review.characteristics) as [string, number][]).map(([key, val]) => (
                                            <div key={key} className="text-center">
                                                <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-1">{key === 'rigidity' ? 'Hard' : key.substring(0,4)}</div>
                                                <div className="text-xs font-bold text-zinc-300 font-mono">{val}</div>
                                                <div className="h-0.5 w-full bg-zinc-800 rounded mt-1 overflow-hidden">
                                                    <div className="h-full bg-zinc-500" style={{ width: `${val * 10}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <p className="text-zinc-300 text-sm leading-relaxed italic">
                                    "{review.comment}"
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
                            <MessageSquare size={32} className="text-zinc-700 mb-4" />
                            <h5 className="text-white font-bold uppercase italic">No Reviews Yet</h5>
                            <p className="text-zinc-500 text-xs max-w-xs mt-2">
                                Be the first to analyze the {racket.model} and help the community.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RacketDetail;
