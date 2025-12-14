import React from 'react';
import { Review } from '../types';
import { User as UserIcon, Clock, Zap, MessageSquare, Calendar } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  racketModel: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, racketModel }) => {
  if (reviews.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-center">
        <MessageSquare size={32} className="text-zinc-700 mb-4" />
        <h5 className="text-white font-bold uppercase italic">Ainda sem Avaliações</h5>
        <p className="text-zinc-500 text-xs max-w-xs mt-2">
          Sê o primeiro a analisar a {racketModel} e ajuda a comunidade.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
          
          {/* Header: User Info & Rating */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800">
                <UserIcon size={20} className="text-zinc-600" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">{review.userName}</div>
                <div className="text-[10px] text-zinc-500 font-mono uppercase flex items-center gap-2">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(review.date).toLocaleDateString()}</span>
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
                  <div className="text-[8px] text-zinc-500 uppercase tracking-wider mb-1">
                    {key === 'rigidity' ? 'Dura' : key.substring(0, 4)}
                  </div>
                  <div className="text-xs font-bold text-zinc-300 font-mono">{val}</div>
                  <div className="h-0.5 w-full bg-zinc-800 rounded mt-1 overflow-hidden">
                    <div className="h-full bg-zinc-500" style={{ width: `${val * 10}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment */}
          <p className="text-zinc-300 text-sm leading-relaxed italic">
            "{review.comment}"
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;