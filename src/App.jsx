// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Popular from './pages/Popular';
import YeniCikanlar from "./pages/YeniCikanlar";
import Kesfet from './pages/Kesfet';
import Upcoming from './pages/Upcoming';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/populer" element={<Popular />} />
        <Route path="/yeni" element={<YeniCikanlar />} />
        <Route path="/kesfet" element={<Kesfet />} />
        <Route path="/upcoming" element={<Upcoming />} />
      </Routes>
    </Router>
  );
};

export default App;
