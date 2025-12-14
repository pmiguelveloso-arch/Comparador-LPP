
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Racket, Review } from '../types';

interface AppContextType {
  compareList: Racket[];
  addToCompare: (racket: Racket) => void;
  removeFromCompare: (racketId: string) => void;
  isInCompare: (racketId: string) => boolean;
  clearCompare: () => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  getUserReviews: () => Review[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [compareList, setCompareList] = useState<Racket[]>(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('reviews_db');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('reviews_db', JSON.stringify(reviews));
  }, [reviews]);

  const addToCompare = (racket: Racket) => {
    if (compareList.length < 3 && !compareList.find(r => r.id === racket.id)) {
      setCompareList([...compareList, racket]);
    }
  };

  const removeFromCompare = (racketId: string) => {
    setCompareList(compareList.filter(r => r.id !== racketId));
  };

  const isInCompare = (racketId: string) => {
    return compareList.some(r => r.id === racketId);
  };

  const clearCompare = () => setCompareList([]);

  const addReview = (review: Review) => {
    setReviews([...reviews, review]);
  };

  const getUserReviews = () => {
    const sessionUserStr = localStorage.getItem('loucos_session_user');
    if (sessionUserStr) {
      try {
        const user = JSON.parse(sessionUserStr);
        return reviews.filter(r => r.userId === user.id);
      } catch (e) {
        console.error("Error parsing session user", e);
        return [];
      }
    }
    return [];
  };

  return (
    <AppContext.Provider value={{ 
      compareList, 
      addToCompare, 
      removeFromCompare, 
      isInCompare, 
      clearCompare,
      reviews,
      addReview,
      getUserReviews
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
