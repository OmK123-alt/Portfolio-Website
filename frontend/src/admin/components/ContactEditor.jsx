import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function ContactEditor({ data, token, onUpdate, onMessage }) {
  const [contact, setContact] = useState(data.contact);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setContact({ ...contact, [field]: value });
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...contact.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContact({ ...contact, links: newLinks });
  };

  const addLink = () => {
    const newLinks = [...contact.links, {
      name: 'New Link',
      value: '',
      icon: '🔗',
      url: ''
    }];
    setContact({ ...contact, links: newLinks });
  };

  const removeLink = (index) => {
    const newLinks = contact.links.filter((_, i) => i !== index);
    setContact({ ...contact, links: newLinks });
  };

  const saveContact = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/contact`, contact, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Contact information updated successfully!');
      onUpdate();
    } catch (error) {
      onMessage('❌ Error updating contact: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-section">
        <h2>Contact Section</h2>

        <div className="form-group">
          <label>Heading</label>
          <input
            type="text"
            value={contact.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            placeholder="Contact heading"
          />
        </div>

        <div className="form-group">
          <label>Subheading</label>
          <textarea
            value={contact.subheading}
            onChange={(e) => handleChange('subheading', e.target.value)}
            placeholder="Contact subheading"
            rows="2"
          ></textarea>
        </div>
      </div>

      <div className="editor-section">
        <h2>Contact Links</h2>

        {contact.links.map((link, index) => (
          <div key={index} className="link-editor">
            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <input
                  type="text"
                  value={link.icon}
                  onChange={(e) => handleLinkChange(index, 'icon', e.target.value)}
                  placeholder="Emoji icon"
                  maxLength="2"
                />
              </div>

              <div className="form-group">
                <label>Platform Name</label>
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                  placeholder="e.g. Email, WhatsApp, LinkedIn"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Display Value</label>
              <input
                type="text"
                value={link.value}
                onChange={(e) => handleLinkChange(index, 'value', e.target.value)}
                placeholder="What users will see"
              />
            </div>

            <div className="form-group">
              <label>URL/Link</label>
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                placeholder="https://... or mailto: or https://wa.me/..."
              />
            </div>

            <button
              onClick={() => removeLink(index)}
              className="btn btn-danger btn-small"
              style={{ marginBottom: '1.5rem' }}
            >
              Remove Link
            </button>
          </div>
        ))}

        <button
          onClick={addLink}
          className="btn btn-success btn-small"
          style={{ marginTop: '1rem' }}
        >
          + Add Contact Link
        </button>
      </div>

      <div className="editor-section" style={{ marginTop: '2rem' }}>
        <button onClick={saveContact} className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Contact Information'}
        </button>
      </div>

      <div style={{ 
        background: 'rgba(74, 222, 128, 0.1)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        padding: '1rem',
        borderRadius: '8px',
        marginTop: '2rem',
        color: '#4ade80',
        fontSize: '0.9rem'
      }}>
        <strong>💡 Tips:</strong>
        <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>WhatsApp URL format: https://wa.me/91XXXXXXXXXX (replace with actual number)</li>
          <li>Email format: mailto:your@email.com</li>
          <li>Use emoji icons to make links visually appealing</li>
        </ul>
      </div>
    </div>
  );
}
