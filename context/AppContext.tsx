
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
  const [compareList, setCompareList] = useState<Racket[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Hydration Effect (Runs only on client, once)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCompare = localStorage.getItem('compareList');
        const savedReviews = localStorage.getItem('reviews_db');
        
        if (savedCompare) setCompareList(JSON.parse(savedCompare));
        if (savedReviews) setReviews(JSON.parse(savedReviews));
      } catch (e) {
        console.error("Failed to hydrate app state", e);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // 2. Persistence Effects (Run only after initialization)
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('compareList', JSON.stringify(compareList));
    }
  }, [compareList, isInitialized]);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('reviews_db', JSON.stringify(reviews));
    }
  }, [reviews, isInitialized]);

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
    // Guard against server execution
    if (typeof window === 'undefined') return [];

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
