import './Contact.css';

export default function Contact({ contact }) {
  if (!contact) return null;

  return (
    <div className="contact-page">
      <section className="contact-hero section">
        <div className="container">
          <h1 className="section-title">{contact.heading}</h1>
          <p className="section-subtitle">{contact.subheading}</p>
        </div>
      </section>

      <section className="contact-section section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Links */}
            <div className="contact-methods">
              <h2>Get in Touch</h2>
              <div className="contact-links">
                {contact.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    <div className="link-icon">{link.icon}</div>
                    <div className="link-content">
                      <div className="link-name">{link.name}</div>
                      <div className="link-value">{link.value}</div>
                    </div>
                    <div className="link-arrow">→</div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="whatsapp-cta">
                <a
                  href={`https://wa.me/${contact.links.find(l => l.name === 'WhatsApp')?.url?.split('https://wa.me/')[1] || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary whatsapp-btn"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send a Message</h2>
              <form className="contact-form" onSubmit={(e) => {
                e.preventDefault();
                alert('Form submission logic to be implemented');
              }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" required placeholder="Your name" />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required placeholder="your@email.com" />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" required placeholder="What's this about?" />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    required
                    placeholder="Tell me more about your project..."
                    rows="5"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary form-submit">
                  Send Message →
                </button>
              </form>
            </div>
          </div>

          {/* Quick Info */}
          <div className="quick-info">
            <div className="info-item">
              <div className="info-title">📍 Based In</div>
              <div className="info-value">Pune, India</div>
            </div>
            <div className="info-item">
              <div className="info-title">⏰ Response Time</div>
              <div className="info-value">24-48 hours</div>
            </div>
            <div className="info-item">
              <div className="info-title">🌍 Availability</div>
              <div className="info-value">Remote & On-site</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
