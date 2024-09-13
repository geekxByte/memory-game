import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Game from './components/Game';
import PrivateRoute from './components/PrivateRoute';

function App() {
  // Here we are using PrivateRoute component to check if user is authenticated or not and redirect to login page if needed
  // We are using AuthProvider to provide user state to all child components
  // We are using Router and Routes from react-router-dom to handle routing
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={<PrivateRoute element={<Game />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
