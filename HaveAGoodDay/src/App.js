import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MoodLogger from './components/MoodLogger';
import History from './components/History';
import Insights from './components/Insights';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<MoodLogger />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 