import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function WorksEditor({ data, token, onUpdate, onMessage }) {
  const [works, setWorks] = useState(data.works);
  const [newWork, setNewWork] = useState({
    title: '',
    category: 'Educational Content',
    description: '',
    thumbnail: '',
    videoUrl: '',
    duration: '',
    year: new Date().getFullYear()
  });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleNewWorkChange = (field, value) => {
    setNewWork({ ...newWork, [field]: value });
  };

  const handleWorkChange = (id, field, value) => {
    const updated = works.map(w => w.id === id ? { ...w, [field]: value } : w);
    setWorks(updated);
  };

  const addWork = async () => {
    if (!newWork.title || !newWork.videoUrl) {
      onMessage('❌ Title and video URL are required');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/admin/works`, newWork, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Work added successfully!');
      setNewWork({
        title: '',
        category: 'Educational Content',
        description: '',
        thumbnail: '',
        videoUrl: '',
        duration: '',
        year: new Date().getFullYear()
      });
      onUpdate();
    } catch (error) {
      onMessage('❌ Error adding work: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveWork = async (id) => {
    const work = works.find(w => w.id === id);
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/works/${id}`, work, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Work updated successfully!');
      setEditingId(null);
      onUpdate();
    } catch (error) {
      onMessage('❌ Error updating work: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteWork = async (id) => {
    if (confirm('Are you sure you want to delete this work?')) {
      setSaving(true);
      try {
        await axios.delete(`${API_URL}/admin/works/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onMessage('✅ Work deleted successfully!');
        onUpdate();
      } catch (error) {
        onMessage('❌ Error deleting work: ' + error.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="editor-container">
      {/* Add New Work */}
      <div className="editor-section">
        <h2>Add New Work</h2>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={newWork.title}
            onChange={(e) => handleNewWorkChange('title', e.target.value)}
            placeholder="Work title"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              value={newWork.category}
              onChange={(e) => handleNewWorkChange('category', e.target.value)}
            >
              <option>Educational Content</option>
              <option>Motion Graphics</option>
              <option>Social Media</option>
              <option>Commercial</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              value={newWork.duration}
              onChange={(e) => handleNewWorkChange('duration', e.target.value)}
              placeholder="e.g. 2 min 15 sec"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={newWork.description}
            onChange={(e) => handleNewWorkChange('description', e.target.value)}
            placeholder="Brief description of the work"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Thumbnail URL</label>
          <input
            type="text"
            value={newWork.thumbnail}
            onChange={(e) => handleNewWorkChange('thumbnail', e.target.value)}
            placeholder="https://via.placeholder.com/400x300"
          />
        </div>

        <div className="form-group">
          <label>YouTube Video URL (embed) *</label>
          <input
            type="text"
            value={newWork.videoUrl}
            onChange={(e) => handleNewWorkChange('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <button onClick={addWork} className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding...' : '+ Add New Work'}
        </button>
      </div>

      {/* Existing Works */}
      <div className="editor-section">
        <h2>Existing Works ({works.length})</h2>

        {works.map((work) => (
          <div key={work.id} className="work-edit-card">
            <div className="work-header">
              <h3>{work.title}</h3>
              <span className="work-category-badge">{work.category}</span>
            </div>

            {editingId === work.id ? (
              <div className="work-edit-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={work.title}
                    onChange={(e) => handleWorkChange(work.id, 'title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={work.category}
                    onChange={(e) => handleWorkChange(work.id, 'category', e.target.value)}
                  >
                    <option>Educational Content</option>
                    <option>Motion Graphics</option>
                    <option>Social Media</option>
                    <option>Commercial</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={work.description}
                    onChange={(e) => handleWorkChange(work.id, 'description', e.target.value)}
                    rows="2"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Video URL</label>
                  <input
                    type="text"
                    value={work.videoUrl}
                    onChange={(e) => handleWorkChange(work.id, 'videoUrl', e.target.value)}
                  />
                </div>

                <div className="work-actions">
                  <button
                    onClick={() => saveWork(work.id)}
                    className="btn btn-success btn-small"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="btn btn-secondary btn-small"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="work-view">
                <p><strong>Category:</strong> {work.category}</p>
                <p><strong>Description:</strong> {work.description}</p>
                <p><strong>Duration:</strong> {work.duration}</p>
                <p><strong>Year:</strong> {work.year}</p>

                <div className="work-actions">
                  <button
                    onClick={() => setEditingId(work.id)}
                    className="btn btn-primary btn-small"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteWork(work.id)}
                    className="btn btn-danger btn-small"
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
