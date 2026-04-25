import { useState } from 'react';
import './Works.css';

export default function Works({ works }) {
  if (!works || works.length === 0) return null;

  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(works.map(w => w.category))];
  const filteredWorks = selectedCategory === 'All'
    ? works
    : works.filter(w => w.category === selectedCategory);

  const getPrimaryVideoUrl = (work) => {
    return work.primaryVideoUrl || work.videoUrl || '';
  };

  const getOptionalVideoUrls = (work) => {
    const optional = Array.isArray(work.optionalVideoUrls)
      ? work.optionalVideoUrls
      : Array.isArray(work.videoLinks)
        ? work.videoLinks
        : [];
    return optional.filter(Boolean).slice(0, 5);
  };

  const renderVideo = (work) => {
    const primaryVideoUrl = getPrimaryVideoUrl(work);

    if (work.videoType === 'upload' || work.videoFile) {
      const videoSource = primaryVideoUrl || work.videoFile;
      return (
        <video controls preload="metadata" poster={work.thumbnail}>
          <source src={videoSource} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (!primaryVideoUrl) {
      return (
        <img
          className="work-thumbnail"
          src={work.thumbnail}
          alt={work.title}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      );
    }

    return (
      <iframe
        src={primaryVideoUrl}
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
                  {getOptionalVideoUrls(work).length > 0 && (
                    <div className="work-extra-links">
                      {getOptionalVideoUrls(work).map((link, index) => (
                        <a
                          key={`${work.id}-optional-${index}`}
                          className="work-link"
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Video {index + 2}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="work-meta">
                    <span className="work-year">{work.year}</span>
                    {work.linkUrl && (
                      <a className="work-link" href={work.linkUrl} target="_blank" rel="noreferrer">
                        View post
                      </a>
                    )}
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
