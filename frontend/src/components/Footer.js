import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>🎓</span>
              <span style={styles.logoText}>Zentrix Campus</span>
            </div>
            <p style={styles.brandDescription}>
              Empowering campus operations with smart technology solutions for resource management, 
              incident tracking, and seamless communication.
            </p>
            <div style={styles.socialLinks}>
              <a href="/facebook" style={styles.socialIcon} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="/twitter" style={styles.socialIcon} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="/linkedin" style={styles.socialIcon} aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="/instergram" style={styles.socialIcon} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Quick Links</h4>
            <ul style={styles.linkList}>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/about" style={styles.link}>About Us</Link></li>
              <li><Link to="/contact" style={styles.link}>Contact</Link></li>
              <li><Link to="/bookings" style={styles.link}>Bookings</Link></li>
              <li><Link to="/incidents" style={styles.link}>Incidents</Link></li>
            </ul>
          </div>

          {/* Services Section */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Our Services</h4>
            <ul style={styles.linkList}>
              <li><Link to="/bookings/new" style={styles.link}>Resource Booking</Link></li>
              <li><Link to="/incidents/new" style={styles.link}>Incident Reporting</Link></li>
              <li><Link to="/notifications" style={styles.link}>Notifications</Link></li>
              <li><Link to="/analytics" style={styles.link}>Analytics Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div style={styles.contactSection}>
            <h4 style={styles.sectionTitle}>Get in Touch</h4>
            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📍</span>
                <span>Pita Kotte, Sri Lanka</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📧</span>
                <a href="mailto:support@zentrix.edu" style={styles.contactLink}>support@zentrix.edu</a>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <a href="tel:+94111234567" style={styles.contactLink}>+94 11 123 4567</a>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>🕒</span>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={styles.bottomBar}>
          <div style={styles.copyright}>
            © {currentYear} Zentrix Campus. All rights reserved.
          </div>
          <div style={styles.bottomLinks}>
            <Link to="/privacy" style={styles.bottomLink}>Privacy Policy</Link>
            <span style={styles.bottomSeparator}>|</span>
            <Link to="/terms" style={styles.bottomLink}>Terms of Service</Link>
            <span style={styles.bottomSeparator}>|</span>
            <Link to="/faq" style={styles.bottomLink}>FAQ</Link>
          </div>
          <div style={styles.techStack}>
            Built with React & Spring Boot
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #0a0a0a, #111827)',
    color: '#ffffff',
    marginTop: '60px',
    position: 'relative',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px 24px'
  },

  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },

  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  },

  logoIcon: {
    fontSize: '28px'
  },

  logoText: {
    fontSize: '1.35rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff, #9ca3af)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.5px'
  },

  brandDescription: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    lineHeight: '1.6',
    margin: 0
  },

  socialLinks: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },

  socialIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    transition: 'all 0.2s ease',
    textDecoration: 'none'
  },

  linksSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '8px',
    letterSpacing: '0.5px'
  },

  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  link: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
    display: 'inline-block'
  },

  contactSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },

  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#9ca3af',
    fontSize: '0.85rem'
  },

  contactIcon: {
    fontSize: '1rem',
    minWidth: '24px'
  },

  contactLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  },

  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },

  copyright: {
    color: '#6b7280',
    fontSize: '0.8rem'
  },

  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },

  bottomLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease'
  },

  bottomSeparator: {
    color: '#374151',
    fontSize: '0.7rem'
  },

  techStack: {
    color: '#6b7280',
    fontSize: '0.8rem'
  }
};

// Add hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .footer-link:hover {
    color: #84cc16 !important;
    transform: translateX(4px);
  }
  
  .social-icon:hover {
    background: #84cc16 !important;
    color: #111827 !important;
    transform: translateY(-3px);
  }
  
  .contact-link:hover {
    color: #84cc16 !important;
  }
  
  .bottom-link:hover {
    color: #84cc16 !important;
  }
`;
document.head.appendChild(styleSheet);

export default Footer;
