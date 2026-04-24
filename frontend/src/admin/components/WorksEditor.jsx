import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');
const MAX_OPTIONAL_VIDEO_LINKS = 5;
const MAX_THUMBNAIL_SIZE_BYTES = 2 * 1024 * 1024;

const EMPTY_WORK = {
  title: '',
  category: 'Educational Content',
  description: '',
  thumbnail: '',
  primaryVideoUrl: '',
  optionalVideoUrls: [],
  duration: '',
  year: new Date().getFullYear()
};

function normalizeOptionalVideoUrls(optionalVideoUrls) {
  if (!Array.isArray(optionalVideoUrls)) {
    return [];
  }

  return optionalVideoUrls
    .map((link) => (typeof link === 'string' ? link.trim() : ''))
    .filter(Boolean)
    .slice(0, MAX_OPTIONAL_VIDEO_LINKS);
}

function buildEditableWork(work) {
  const primaryVideoUrl = (work.primaryVideoUrl || work.videoUrl || '').trim();
  const optionalVideoUrls = normalizeOptionalVideoUrls(work.optionalVideoUrls || work.videoLinks || []);

  return {
    ...work,
    primaryVideoUrl,
    optionalVideoUrls,
    videoUrl: primaryVideoUrl
  };
}

export default function WorksEditor({ data, token, onUpdate, onMessage }) {
  const [works, setWorks] = useState((data.works || []).map(buildEditableWork));
  const [newWork, setNewWork] = useState(EMPTY_WORK);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setWorks((data.works || []).map(buildEditableWork));
  }, [data.works]);

  const handleNewWorkChange = (field, value) => {
    setNewWork({ ...newWork, [field]: value });
  };

  const handleWorkChange = (id, field, value) => {
    const updated = works.map((w) => (w.id === id ? { ...w, [field]: value } : w));
    setWorks(updated);
  };

  const handleOptionalVideoChange = (workId, index, value, isNewWork = false) => {
    if (isNewWork) {
      const updated = [...newWork.optionalVideoUrls];
      updated[index] = value;
      setNewWork({ ...newWork, optionalVideoUrls: updated });
      return;
    }

    const updatedWorks = works.map((work) => {
      if (work.id !== workId) {
        return work;
      }
      const nextOptional = [...(work.optionalVideoUrls || [])];
      nextOptional[index] = value;
      return { ...work, optionalVideoUrls: nextOptional };
    });
    setWorks(updatedWorks);
  };

  const fileToDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const uploadThumbnailImage = async (fileData) => {
    const response = await axios.post(
      `${API_URL}/admin/upload/image`,
      { fileData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.url;
  };

  const handleNewThumbnailFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      onMessage('❌ Please select an image file');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      onMessage('❌ Thumbnail is too large. Please use an image under 2 MB.');
      event.target.value = '';
      return;
    }

    try {
      setSaving(true);
      const dataUrl = await fileToDataUrl(file);
      const uploadedUrl = await uploadThumbnailImage(dataUrl);
      setNewWork((prev) => ({ ...prev, thumbnail: uploadedUrl }));
      onMessage('✅ Thumbnail uploaded successfully');
    } catch (error) {
      onMessage('❌ Could not upload thumbnail image');
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  };

  const handleEditThumbnailFileChange = async (id, event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      onMessage('❌ Please select an image file');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
      onMessage('❌ Thumbnail is too large. Please use an image under 2 MB.');
      event.target.value = '';
      return;
    }

    try {
      setSaving(true);
      const dataUrl = await fileToDataUrl(file);
      const uploadedUrl = await uploadThumbnailImage(dataUrl);
      handleWorkChange(id, 'thumbnail', uploadedUrl);
      onMessage('✅ Thumbnail uploaded successfully');
    } catch (error) {
      onMessage('❌ Could not upload thumbnail image');
    } finally {
      setSaving(false);
      event.target.value = '';
    }
  };

  const validateWork = (work) => {
    if (!work.title || !work.title.trim()) {
      return '❌ Title is required';
    }

    if (!work.primaryVideoUrl || !work.primaryVideoUrl.trim()) {
      return '❌ Primary video link is required for every work';
    }

    return null;
  };

  const buildPayload = (work) => {
    const optionalVideoUrls = normalizeOptionalVideoUrls(work.optionalVideoUrls);
    const primaryVideoUrl = work.primaryVideoUrl.trim();

    return {
      ...work,
      primaryVideoUrl,
      optionalVideoUrls,
      videoUrl: primaryVideoUrl
    };
  };

  const addWork = async () => {
    const validationError = validateWork(newWork);
    if (validationError) {
      onMessage(validationError);
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_URL}/admin/works`, buildPayload(newWork), {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Work added successfully!');
      setNewWork(EMPTY_WORK);
      onUpdate();
    } catch (error) {
      onMessage('❌ Error adding work: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveWork = async (id) => {
    const work = works.find((w) => w.id === id);
    const validationError = validateWork(work);
    if (validationError) {
      onMessage(validationError);
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/works/${id}`, buildPayload(work), {
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
        setWorks((prev) => prev.filter((work) => work.id !== id));
        if (editingId === id) {
          setEditingId(null);
        }
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
              <option>Photography</option>
              <option>Event Photography</option>
              <option>Video Editing</option>
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
            placeholder="https://..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleNewThumbnailFileChange}
            disabled={saving}
            style={{ marginTop: '0.75rem' }}
          />
        </div>

        <div className="form-group">
          <label>Primary Video Link *</label>
          <input
            type="text"
            value={newWork.primaryVideoUrl}
            onChange={(e) => handleNewWorkChange('primaryVideoUrl', e.target.value)}
            placeholder="https://www.youtube.com/embed/..."
          />
        </div>

        <div className="form-group">
          <label>Optional Video Links (up to 5)</label>
          <div className="optional-links-grid">
            {Array.from({ length: MAX_OPTIONAL_VIDEO_LINKS }).map((_, index) => (
              <input
                key={`new-work-optional-${index}`}
                type="text"
                value={newWork.optionalVideoUrls[index] || ''}
                onChange={(e) => handleOptionalVideoChange(null, index, e.target.value, true)}
                placeholder={`Optional video link ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <button onClick={addWork} className="btn btn-primary" disabled={saving}>
          {saving ? 'Adding...' : '+ Add New Work'}
        </button>
      </div>

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
                  <label>Title *</label>
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
                    <option>Photography</option>
                    <option>Event Photography</option>
                    <option>Video Editing</option>
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
                  <label>Thumbnail URL</label>
                  <input
                    type="text"
                    value={work.thumbnail || ''}
                    onChange={(e) => handleWorkChange(work.id, 'thumbnail', e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleEditThumbnailFileChange(work.id, e)}
                    disabled={saving}
                    style={{ marginTop: '0.75rem' }}
                  />
                </div>

                <div className="form-group">
                  <label>Primary Video Link *</label>
                  <input
                    type="text"
                    value={work.primaryVideoUrl || ''}
                    onChange={(e) => handleWorkChange(work.id, 'primaryVideoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                <div className="form-group">
                  <label>Optional Video Links (up to 5)</label>
                  <div className="optional-links-grid">
                    {Array.from({ length: MAX_OPTIONAL_VIDEO_LINKS }).map((_, index) => (
                      <input
                        key={`${work.id}-optional-${index}`}
                        type="text"
                        value={work.optionalVideoUrls?.[index] || ''}
                        onChange={(e) => handleOptionalVideoChange(work.id, index, e.target.value)}
                        placeholder={`Optional video link ${index + 1}`}
                      />
                    ))}
                  </div>
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
                <p><strong>Primary Video:</strong> {work.primaryVideoUrl || work.videoUrl || '-'}</p>
                <p><strong>Optional Videos:</strong> {normalizeOptionalVideoUrls(work.optionalVideoUrls).length}</p>

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
