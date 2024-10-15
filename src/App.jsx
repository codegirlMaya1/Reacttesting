import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import CreateMeal from './pages/CreateMeal';
import Training from './pages/Training';
import Meal from './pages/Meal';
import EditMeal from './pages/EditMeal'; // Import the EditMeal page
import LoginForm from './components/LoginForm';
import ExitPage from './pages/ExitPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));

  const handleLogin = (username, password) => {
    // Add your login logic here
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn && <NavigationBar onLogout={handleLogout} />}
      <div className="container">
        <Routes>
          {!isLoggedIn ? (
            <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/" element={<Navigate to="/training" />} />
              <Route path="/create-meal" element={<CreateMeal />} />
              <Route path="/training" element={<Training />} />
              <Route path="/meal" element={<Meal />} />
              <Route path="/edit-meal/:index" element={<EditMeal />} /> {/* Add the route for EditMeal */}
              <Route path="/exit" element={<ExitPage />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
