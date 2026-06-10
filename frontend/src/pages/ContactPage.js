import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ name: '', email: '', message: '' });
    };

    const contactInfo = [
        { icon: '📍', title: 'Visit Us', detail: 'Pita Kotte, Sri Lanka' },
        { icon: '📞', title: 'Call Us', detail: '+94 11 223 4567', sub: 'Mon-Sun, 9am-5pm' },
        { icon: '📧', title: 'Email Us', detail: 'support@zentrix.edu', sub: 'Response within 24 hours' },
        { icon: '🕒', title: 'Hours', detail: 'Monday - Sunday', sub: '9:00 AM - 6:00 PM' }
    ];

    const faqs = [
        { q: 'How do I book a resource?', a: 'Login to your account and navigate to "New Booking" to select available resources and schedule your booking.' },
        { q: 'How do I report an incident?', a: 'Go to "Report Incident" from the navigation menu, fill in the details, and submit. Our team will respond promptly.' },
        { q: 'How can I check my booking status?', a: 'Visit "My Bookings" section to view all your bookings and their current status.' },
        { q: 'What if I need technical support?', a: 'Contact our support team via email or phone, or submit a ticket through the system.' }
    ];

    return (
        <div className="contact-shell">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-pattern"></div>
                <div className="container">
                    <div className="hero-content">
                        <div className="badge">
                            <span className="badge-icon">📞</span>
                            Get in Touch
                        </div>
                        <h1 className="hero-title">
                            Contact
                            <span className="hero-accent"> Zentrix Campus</span>
                        </h1>
                        <p className="hero-description">
                            Have questions? We're here to help. Reach out to us through any of the channels below.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Info Section */}
            <div className="info-section">
                <div className="container">
                    <div className="info-grid">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="info-card">
                                <div className="info-icon">{info.icon}</div>
                                <h3 className="info-title">{info.title}</h3>
                                <p className="info-detail">{info.detail}</p>
                                {info.sub && <p className="info-sub">{info.sub}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form and Map Section */}
            <div className="form-section">
                <div className="container">
                    <div className="form-grid">
                        {/* Contact Form */}
                        <div className="form-card">
                            <div className="form-header">
                                <h2 className="form-title">Send us a Message</h2>
                                <p className="form-description">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </div>

                            {submitted && (
                                <div className="success-message">
                                    ✓ Message sent successfully! We'll respond shortly.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="How can we help you?"
                                        rows="5"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        className="textarea"
                                    />
                                </div>

                                <button type="submit" className="submit-button">
                                    Send Message
                                    <span className="button-arrow">→</span>
                                </button>
                            </form>
                        </div>

                        {/* Map Section */}
                        <div className="map-card">
                            <div className="map-header">
                                <h2 className="map-title">Find Us Here</h2>
                                <p className="map-description">
                                    Visit our campus located in Pita Kotte, Sri Lanka
                                </p>
                            </div>
                            
                            <div className="map-container">
                                <iframe
                                    title="Zentrix Campus Location - Pita Kotte"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126868.20924791005!2d79.85478695644034!3d6.892041818541607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25b3b5a9e9e4b%3A0x2e7d8c8e5a9f7e2a!2sPita%20Kotte%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>

                            <div className="address-box">
                                <div className="address-icon">🏢</div>
                                <div>
                                    <h4 className="address-title">Zentrix Campus Headquarters</h4>
                                    <p className="address-text">Pita Kotte, Sri Lanka</p>
                                    <p className="address-text">Conveniently located in the heart of Kotte</p>
                                </div>
                            </div>

                            <div className="directions-box">
                                <p className="directions-text">🚗 Ample parking available on campus</p>
                                <p className="directions-text">🚌 Bus stop within walking distance</p>
                                <p className="directions-text">🚉 Convenient access to public transportation</p>
                                <p className="directions-text">📍 Easily accessible from Colombo via main roads</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-label">FAQ</div>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                        <p className="section-description">
                            Find quick answers to common questions
                        </p>
                    </div>

                    <div className="faq-grid">
                        {faqs.map((faq, index) => (
                            <div key={index} className="faq-card">
                                <div className="faq-question">{faq.q}</div>
                                <p className="faq-answer">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Need Immediate Assistance?</h2>
                        <p className="cta-description">
                            Our support team is ready to help you 24/7
                        </p>
                        <div className="cta-buttons">
                            <a href="tel:+94111234567" className="cta-button-primary">
                                Call Support
                            </a>
                            <Link to="/login" className="cta-button-secondary">
                                Access Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                * {
                    margin-top: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .contact-shell {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .container {
                    max-width: 1400px;
                    margin: 100px auto;
                    padding: 0 24px;
                }

                /* Hero Section */
                .hero-section {
                    position: relative;
                    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
                    overflow: hidden;
                }

                .hero-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-image: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
                    animation: pulse 8s ease-in-out infinite;
                }

                .hero-content {
                    position: relative;
                    text-align: center;
                    padding: 80px 0 100px;
                    z-index: 1;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    padding: 6px 16px;
                    border-radius: 100px;
                    font-size: 0.875rem;
                    color: #e5e7eb;
                    margin-bottom: 24px;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }

                .hero-description {
                    font-size: 1.125rem;
                    color: #9ca3af;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                /* Info Section */
                .info-section {
                    padding: 0px 0;
                    background: #ffffff;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 24px;
                }

                .info-card {
                    text-align: center;
                    padding: 32px 20px;
                    background: #f8f9fa;
                    border-radius: 16px;
                    transition: all 0.3s ease;
                    border: 1px solid #e5e7eb;
                }

                .info-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                .info-icon {
                    font-size: 2rem;
                    margin-bottom: 16px;
                }

                .info-title {
                    font-size: 1.125rem;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .info-detail {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 4px;
                }

                .info-sub {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                /* Form Section */
                .form-section {
                    padding: 0px 0;
                    background: #f8f9fa;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                    gap: 32px;
                }

                .form-card {
                    padding: 40px;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .form-header {
                    margin-bottom: 32px;
                }

                .form-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .form-description {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .success-message {
                    background: #10b981;
                    color: #ffffff;
                    padding: 12px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    font-size: 0.875rem;
                    text-align: center;
                    animation: slideIn 0.3s ease;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }

                .input, .textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border-radius: 10px;
                    border: 1.5px solid #e5e7eb;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                    background-color: #f9fafb;
                    font-family: inherit;
                }

                .input:focus, .textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    background-color: #ffffff;
                }

                .textarea {
                    resize: vertical;
                }

                .submit-button {
                    width: 100%;
                    padding: 12px;
                    background: #111827;
                    color: #ffffff;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .submit-button:hover {
                    background: #1f2937;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .submit-button:hover .button-arrow {
                    transform: translateX(4px);
                }

                .button-arrow {
                    transition: transform 0.2s ease;
                }

                /* Map Card */
                .map-card {
                    padding: 40px;
                    background: #ffffff;
                    border-radius: 20px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .map-header {
                    margin-bottom: 24px;
                }

                .map-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }

                .map-description {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .map-container {
                    margin-bottom: 24px;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .address-box {
                    display: flex;
                    gap: 16px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    margin-bottom: 20px;
                }

                .address-icon {
                    font-size: 1.5rem;
                }

                .address-title {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 4px;
                }

                .address-text {
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-bottom: 2px;
                }

                .directions-box {
                    padding: 16px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                }

                .directions-text {
                    font-size: 0.75rem;
                    color: #4b5563;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* FAQ Section */
                .faq-section {
                    padding: 0px 0;
                    background: #ffffff;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .section-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #111827;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }

                .section-description {
                    font-size: 1rem;
                    color: #6b7280;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .faq-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 24px;
                }

                .faq-card {
                    padding: 24px;
                    background: #f8f9fa;
                    border-radius: 16px;
                    border: 1px solid #e5e7eb;
                    transition: all 0.3s ease;
                }

                .faq-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                .faq-question {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 12px;
                }

                .faq-answer {
                    font-size: 0.875rem;
                    color: #6b7280;
                    line-height: 1.6;
                }

                /* CTA Section */
                .cta-section {
                    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
                    padding: 80px 0;
                }

                .cta-content {
                    text-align: center;
                }

                .cta-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 16px;
                }

                .cta-description {
                    font-size: 1rem;
                    color: #9ca3af;
                    margin-bottom: 32px;
                }

                .cta-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .cta-button-primary {
                    background: #ffffff;
                    color: #111827;
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .cta-button-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
                }

                .cta-button-secondary {
                    background: transparent;
                    color: #ffffff;
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-decoration: none;
                    border: 1px solid #ffffff;
                    transition: all 0.3s ease;
                }

                .cta-button-secondary:hover {
                    transform: translateY(-2px);
                    background: #ffffff;
                    color: #111827;
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.15);
                }

                /* Animations */
                @keyframes pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.05); }
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .section-title {
                        font-size: 1.5rem;
                    }
                    
                    .faq-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-card, .map-card {
                        padding: 24px;
                    }
                }
            `}</style>
        </div>
    );
}

export default ContactPage;