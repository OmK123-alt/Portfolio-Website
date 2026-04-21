import './Footer.css';

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Location</h3>
            <p>{profile?.location || 'Pune, India'}</p>
          </div>
          <div className="footer-section">
            <h3>Email</h3>
            <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
          </div>
          <div className="footer-section">
            <h3>WhatsApp</h3>
            <a href={`https://wa.me/${profile?.whatsapp?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer">
              {profile?.whatsapp}
            </a>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} {profile?.name}. All rights reserved.</p>
          <p className="footer-credit">Crafted with 🎬 and ❤️</p>
        </div>
      </div>
    </footer>
  );
}
