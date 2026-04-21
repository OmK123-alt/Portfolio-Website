import './Skills.css';

export default function Skills({ skills }) {
  if (!skills) return null;

  return (
    <div className="skills-page">
      <section className="skills-hero section">
        <div className="container">
          <h1 className="section-title">{skills.title}</h1>
          <p className="section-subtitle">{skills.subtitle}</p>
        </div>
      </section>

      <section className="skills-section section">
        <div className="container">
          <div className="skills-grid">
            {skills.categories.map((category, index) => (
              <div key={index} className="skills-category">
                <div className="category-header">
                  <h3>{category.name}</h3>
                  <div className="category-badge"></div>
                </div>

                <ul className="skills-list">
                  {category.items.map((skill, idx) => (
                    <li key={idx} className="skill-item">
                      <span className="skill-icon">✓</span>
                      <span className="skill-text">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Info Cards */}
          <div className="skills-extra">
            <div className="info-card">
              <div className="card-icon">🎬</div>
              <h3>Video Production</h3>
              <p>End-to-end video production from concept to delivery</p>
            </div>
            <div className="info-card">
              <div className="card-icon">🎨</div>
              <h3>Creative Design</h3>
              <p>Visual storytelling and motion graphics expertise</p>
            </div>
            <div className="info-card">
              <div className="card-icon">⚡</div>
              <h3>Fast Turnaround</h3>
              <p>Quick delivery without compromising on quality</p>
            </div>
            <div className="info-card">
              <div className="card-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Working closely with clients for best results</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
