import './App.css'; 
import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (status) => {
    setIsAuthenticated(status);
  };

  return (
    <div className="">
      {isAuthenticated ? (
        <Dashboard userData={userData} isLoading={isLoading} setIsLoading={setIsLoading} /> // Pass userData to Dashboard
      ) : (
        <Login onLogin={handleLogin} setUserData={setUserData} setIsAuthenticated={setIsAuthenticated} /> // Pass setUserData to Login
      )}
    </div>
  );
}

export default App;
