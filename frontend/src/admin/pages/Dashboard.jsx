import { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import ProfileEditor from '../components/ProfileEditor';
import SkillsEditor from '../components/SkillsEditor';
import WorksEditor from '../components/WorksEditor';
import ContactEditor from '../components/ContactEditor';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/data`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (error) {
      setMessage('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>Please try refreshing the page or logging out and back in.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Portfolio Admin</h1>
          <p>Manage your portfolio content in real-time</p>
        </div>
        <button onClick={onLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      {/* Alert */}
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          💪 Skills
        </button>
        <button
          className={`tab-btn ${activeTab === 'works' ? 'active' : ''}`}
          onClick={() => setActiveTab('works')}
        >
          🎬 Works
        </button>
        <button
          className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          📞 Contact
        </button>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <ProfileEditor data={data} token={token} onUpdate={fetchData} onMessage={setMessage} />
        )}
        {activeTab === 'skills' && (
          <SkillsEditor data={data} token={token} onUpdate={fetchData} onMessage={setMessage} />
        )}
        {activeTab === 'works' && (
          <WorksEditor data={data} token={token} onUpdate={fetchData} onMessage={setMessage} />
        )}
        {activeTab === 'contact' && (
          <ContactEditor data={data} token={token} onUpdate={fetchData} onMessage={setMessage} />
        )}
      </div>
    </div>
  );
}
