import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from '../admin/pages/Login';
import Dashboard from '../admin/pages/Dashboard';
import '../admin/styles.css';
import '../admin/components/Editor.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function AdminPortal() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  useEffect(() => {
    if (!token) {
      return;
    }

    axios
      .get(`${API_URL}/admin/data`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('admin_token');
      });
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
