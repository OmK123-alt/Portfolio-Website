import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Works from './pages/Works';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import AdminPortal from './pages/AdminPortal';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

function PublicApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/public/portfolio`);
        setData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎬</div>
          <p style={{ color: 'var(--text-muted)' }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-dark)',
        color: 'var(--text)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--gold)', marginBottom: '1rem' }}>⚠️ Error</h2>
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
            Make sure the backend is reachable at {API_URL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar profile={data?.profile} />
      <main>
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/works" element={<Works works={data?.works} />} />
          <Route path="/skills" element={<Skills skills={data?.skills} />} />
          <Route path="/contact" element={<Contact contact={data?.contact} />} />
        </Routes>
      </main>
      <Footer profile={data?.profile} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/*" element={<PublicApp />} />
      </Routes>
    </Router>
  );
}
