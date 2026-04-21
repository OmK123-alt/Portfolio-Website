import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default function SkillsEditor({ data, token, onUpdate, onMessage }) {
  const [skills, setSkills] = useState(data.skills);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value) => {
    setSkills({ ...skills, title: value });
  };

  const handleSubtitleChange = (value) => {
    setSkills({ ...skills, subtitle: value });
  };

  const handleCategoryNameChange = (index, value) => {
    const newCategories = [...skills.categories];
    newCategories[index].name = value;
    setSkills({ ...skills, categories: newCategories });
  };

  const handleSkillItemChange = (categoryIndex, itemIndex, value) => {
    const newCategories = [...skills.categories];
    newCategories[categoryIndex].items[itemIndex] = value;
    setSkills({ ...skills, categories: newCategories });
  };

  const addSkillItem = (categoryIndex) => {
    const newCategories = [...skills.categories];
    newCategories[categoryIndex].items.push('New skill');
    setSkills({ ...skills, categories: newCategories });
  };

  const removeSkillItem = (categoryIndex, itemIndex) => {
    const newCategories = [...skills.categories];
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    setSkills({ ...skills, categories: newCategories });
  };

  const saveSkills = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/admin/skills`, skills, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onMessage('✅ Skills updated successfully!');
      onUpdate();
    } catch (error) {
      onMessage('❌ Error updating skills: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-section">
        <h2>Skills Section</h2>

        <div className="form-group">
          <label>Section Title</label>
          <input
            type="text"
            value={skills.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Skills section title"
          />
        </div>

        <div className="form-group">
          <label>Section Subtitle</label>
          <input
            type="text"
            value={skills.subtitle}
            onChange={(e) => handleSubtitleChange(e.target.value)}
            placeholder="Skills section subtitle"
          />
        </div>
      </div>

      {skills.categories.map((category, catIndex) => (
        <div key={catIndex} className="editor-section">
          <h3>Category: {category.name}</h3>

          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
            />
          </div>

          <div className="skills-list-editor">
            <label>Skills (Bullet Points)</label>
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="skill-input-row">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleSkillItemChange(catIndex, itemIndex, e.target.value)}
                  placeholder="Skill name"
                />
                <button
                  onClick={() => removeSkillItem(catIndex, itemIndex)}
                  className="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
            ))}

            <button
              onClick={() => addSkillItem(catIndex)}
              className="btn btn-success btn-small"
              style={{ marginTop: '1rem' }}
            >
              + Add Skill
            </button>
          </div>
        </div>
      ))}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={saveSkills} className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save All Skills'}
        </button>
      </div>
    </div>
  );
}

// Add CSS for editor
const editorCSS = `
.editor-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.editor-section {
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
}

.editor-section h2,
.editor-section h3 {
  color: var(--gold);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.skills-list-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skill-input-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.skill-input-row input {
  flex: 1;
}

.skill-input-row .btn {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .editor-container {
    gap: 1rem;
  }

  .editor-section {
    padding: 1rem;
  }
}
`;
