import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({ data }) {
  if (!data) return null;

  const { profile, hero } = data;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              {hero?.headline || 'Professional Video Editing & Content Production'}
            </h1>
            <p className="hero-subtitle">
              {hero?.subheadline || 'I transform ideas into engaging visual stories'}
            </p>
            <div className="hero-buttons">
              <Link to="/works" className="btn btn-primary">
                View My Work →
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>About Me</h2>
              <p>
                Hi! I'm <strong>{profile?.name}</strong>, a passionate video editor and content creator based in {profile?.location}.
              </p>
              <p>
                I specialize in creating compelling video content for educational platforms, YouTube channels, and brand campaigns. With expertise in storytelling, color grading, and motion graphics, I help bring your vision to life.
              </p>
              <p>
                Whether you need promotional videos, educational content, social media reels, or complete post-production services, I'm here to deliver quality and creativity.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">4+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stat">
                <div className="stat-number">100%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Works */}
      <section className="featured-works section">
        <div className="container">
          <h2 className="section-title">Featured Works</h2>
          <p className="section-subtitle">Check out some of my recent projects</p>

          <div className="works-preview-grid">
            {data?.works?.slice(0, 3).map((work) => (
              <div key={work.id} className="work-preview-card">
                <div className="work-thumbnail">
                  <img src={work.thumbnail} alt={work.title} />
                  <div className="work-overlay">
                    <a href={work.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-small">
                      Watch Video
                    </a>
                  </div>
                </div>
                <div className="work-info">
                  <span className="work-category">{work.category}</span>
                  <h3>{work.title}</h3>
                  <p>{work.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all">
            <Link to="/works" className="btn btn-secondary">
              View All Works →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
