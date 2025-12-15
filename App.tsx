
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import AIAssistant from './components/AIAssistant';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Quiz from './pages/Quiz';
import MatchResults from './pages/MatchResults';
import RacketDetail from './pages/RacketDetail';
import Compare from './pages/Compare';
import BrandLanding from './pages/BrandLanding';
import AllBrands from './pages/AllBrands';
import GearScanner from './pages/GearScanner';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/brands" element={<AllBrands />} />
              <Route path="/brands/:brandName" element={<BrandLanding />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/match" element={<MatchResults />} />
              <Route path="/racket/:id" element={<RacketDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/scanner" element={<GearScanner />} />
            </Routes>
          </main>
          <AIAssistant />
          <CompareBar />
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
