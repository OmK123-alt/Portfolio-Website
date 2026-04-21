import { useState } from 'react';
import './Works.css';

export default function Works({ works }) {
  if (!works || works.length === 0) return null;

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(works.map(w => w.category))];
  const filteredWorks = selectedCategory === 'All'
    ? works
    : works.filter(w => w.category === selectedCategory);

  const renderVideo = (work) => {
    if (work.videoType === 'upload' || work.videoFile) {
      const videoSource = work.videoUrl || work.videoFile;
      return (
        <video controls preload="metadata" poster={work.thumbnail}>
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <iframe
        src={work.videoUrl}
        title={work.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  };

  return (
    <div className="works-page">
      <section className="works-hero section">
        <div className="container">
          <h1 className="section-title">My Works</h1>
          <p className="section-subtitle">
            Explore a selection of my recent video editing and content production projects
          </p>
        </div>
      </section>

      <section className="works-section section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Works Grid */}
          <div className="works-grid">
            {filteredWorks.map((work) => (
              <div key={work.id} className="work-card">
                <div className="work-video-container">
                  {renderVideo(work)}
                  <span className="work-duration">{work.duration}</span>
                </div>
                <div className="work-details">
                  <span className="work-category">{work.category}</span>
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                  <div className="work-meta">
                    <span className="work-year">📅 {work.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredWorks.length === 0 && (
            <div className="no-works">
              <p>No works found in this category</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
