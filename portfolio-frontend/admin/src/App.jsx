import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Verify token is still valid by fetching data
      axios.get(`${API_URL}/admin/data`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {
        setToken(null);
        localStorage.removeItem('admin_token');
      });
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('admin_token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
