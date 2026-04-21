import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default function ProfileEditor({ data, token, onUpdate, onMessage }) {
  const [profile, setProfile] = useState(data.profile);
  const [hero, setHero] = useState(data.hero);
  const [saving, setSaving] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleHeroChange = (field, value) => {
    setHero({ ...hero, [field]: value });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/profile`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Profile updated successfully!');
      onUpdate();
    } catch (error) {
      onMessage('❌ Error updating profile: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveHero = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/hero`, hero, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Hero section updated successfully!');
      onUpdate();
    } catch (error) {
      onMessage('❌ Error updating hero: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-section">
        <h2>Profile Information</h2>
        
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            placeholder="Your full name"
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={profile.title}
            onChange={(e) => handleProfileChange('title', e.target.value)}
            placeholder="Your professional title"
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => handleProfileChange('bio', e.target.value)}
            placeholder="Short biography"
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label>WhatsApp Number</label>
          <input
            type="text"
            value={profile.whatsapp}
            onChange={(e) => handleProfileChange('whatsapp', e.target.value)}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => handleProfileChange('location', e.target.value)}
            placeholder="City, Country"
          />
        </div>

        <button onClick={saveProfile} className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="editor-section">
        <h2>Hero Section</h2>

        <div className="form-group">
          <label>Main Headline</label>
          <textarea
            value={hero.headline}
            onChange={(e) => handleHeroChange('headline', e.target.value)}
            placeholder="Main headline for homepage"
            rows="2"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Subheadline</label>
          <textarea
            value={hero.subheadline}
            onChange={(e) => handleHeroChange('subheadline', e.target.value)}
            placeholder="Supporting tagline"
            rows="2"
          ></textarea>
        </div>

        <button onClick={saveHero} className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Hero Section'}
        </button>
      </div>
    </div>
  );
}
