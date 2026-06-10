import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import campusResourceImg from '../assets/carousel/campus-resource.png';
import bookingImg from '../assets/carousel/booking.jpg';
import incidentImg from '../assets/carousel/incident.jpg';
import notificationImg from '../assets/carousel/notification.jpg';

function HomePage() {
    const { user, loading } = useAuth();
    const isLoggedIn = !!user;

    const isAdmin = user?.role === 'ADMIN';
    const isTechnician = user?.role === 'TECHNICIAN';
    const isStaff = user?.role === 'STAFF';
    const isStudent = user?.role === 'STUDENT';

    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselSlides = [
        {
            title: 'Book Campus Resources',
            subtitle: 'Smart access to lecture halls, labs, and meeting rooms with real-time availability.',
            icon: '🏛️',
            image: campusResourceImg,
            features: ['24/7 Availability', 'Instant Confirmation', 'Conflict Checking']
        },
        {
            title: 'Track Every Booking',
            subtitle: 'Monitor approvals, rejections, and schedules in real time from your personalized dashboard.',
            icon: '📅',
            image: bookingImg,
            features: ['Real-time Updates', 'Status Tracking', 'History Logs']
        },
        {
            title: 'Report Incidents Fast',
            subtitle: 'Raise maintenance issues and follow progress with ease through our advanced ticketing system.',
            icon: '🔧',
            image: incidentImg,
            features: ['Priority Levels', 'Photo Upload', 'Live Tracking']
        },
        {
            title: 'Smart Notifications',
            subtitle: 'Get instant alerts for booking approvals, ticket updates, and important campus announcements.',
            icon: '🔔',
            image: notificationImg,
            features: ['Email Alerts', 'In-app Notifications', 'Real-time Updates']
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [carouselSlides.length]);

    const features = [
        {
            icon: '🏛️',
            title: 'Smart Resource Access',
            description: 'Browse lecture halls, labs, meeting rooms, and campus facilities in one place.',
            link: '/resources',
            linkText: 'Browse Resources',
            available: true
        },
        {
            icon: '🗂️',
            title: 'Resource Management',
            description: 'Admins can add, update, and remove lecture halls, labs, rooms, and equipment from the system.',
            link: '/admin/resources',
            linkText: 'Manage Resources',
            available: isAdmin
        },
        {
            icon: '📅',
            title: 'Booking Management',
            description: 'Track your facility bookings, approvals, rejections, and schedules without confusion.',
            link: '/bookings',
            linkText: 'My Bookings',
            available: isLoggedIn
        },
        {
            icon: '➕',
            title: 'Quick Booking',
            description: 'Create a new booking request fast with date, time, resource, purpose, and attendee details.',
            link: '/bookings/new',
            linkText: 'Book Now',
            available: isStudent || isStaff || isAdmin
        },
        {
            icon: '🔧',
            title: 'Incident Reporting',
            description: 'Report campus issues, damaged assets, or maintenance problems and track progress.',
            link: isTechnician ? '/technician/tickets' : '/incidents/new',
            linkText: isTechnician ? 'Ticket Updates' : 'Report Incident',
            available: isLoggedIn
        },
        {
            icon: '🔔',
            title: 'Live Notifications',
            description: 'Stay updated with booking approvals, incident changes, and important campus alerts.',
            link: '/notifications',
            linkText: 'View Notifications',
            available: isLoggedIn
        },
        {
            icon: '🛠️',
            title: 'Technician Workspace',
            description: 'Technicians can manage assigned tickets, update status, and add resolution notes.',
            link: '/technician/tickets',
            linkText: 'Go to Panel',
            available: isTechnician || isAdmin
        },
        {
            icon: '👔',
            title: 'Staff Operations',
            description: 'Staff users can manage operational activities and access their dedicated workspace.',
            link: '/staff/dashboard',
            linkText: 'Go to Area',
            available: isStaff || isAdmin
        },
        {
            icon: '⚙️',
            title: 'Admin Control Center',
            description: 'Admins can manage bookings, users, incidents, and approvals from one dashboard.',
            link: '/admin/bookings',
            linkText: 'Go to Panel',
            available: isAdmin
        }
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Student',
            text: 'The booking system has made reserving lab spaces so much easier.',
            initial: 'SJ'
        },
        {
            name: 'Prof. Michael Chen',
            role: 'Faculty',
            text: 'Incident reporting is quick and efficient. Our team responds much faster now.',
            initial: 'MC'
        },
        {
            name: 'Dr. Emily Rodriguez',
            role: 'Campus Director',
            text: 'The admin panel gives me complete control over campus resources.',
            initial: 'ER'
        }
    ];

    // Gradient heading style with animation
    const gradientHeadingStyle = {
        fontSize: '3rem',
        lineHeight: '1.2',
        fontWeight: '800',
        marginBottom: '20px',
        letterSpacing: '-0.02em',
        animation: 'gradientFade 4s ease-in-out infinite',
        background: 'linear-gradient(135deg, #111827, #1e293b, #1d4ed8, #10b981, #111827)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        backgroundSize: '300% 300%'
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading Zentrix Campus...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <div style={styles.heroWrapper}>
                <div style={styles.heroContainer}>
                    <div style={styles.heroInner} className="hero-inner">
                        {/* Left Column */}
                        <div style={styles.heroLeft}>
                            {isLoggedIn ? (
                                <>
                                    <div style={styles.welcomeBadge}>
                                        👋 Welcome back, {user?.username}
                                    </div>
                                    <h1 style={gradientHeadingStyle}>
                                        Campus services
                                        <br />
                                        made simple
                                    </h1>
                                    <p style={styles.heroDescription}>
                                        Manage resource bookings, report incidents, monitor notifications,
                                        and handle campus workflows from one modern platform.
                                    </p>
                                    <div style={styles.buttonGroup}>
                                        <Link to="/resources" style={styles.secondaryButton}>
                                            Browse Resources
                                        </Link>

                                        {(isStudent || isStaff || isAdmin) && (
                                            <Link to="/bookings/new" style={styles.primaryButton}>
                                                Book a Resource
                                            </Link>
                                        )}

                                        {isAdmin && (
                                            <Link to="/admin/resources" style={styles.secondaryButton}>
                                                Manage Resources
                                            </Link>
                                        )}

                                        <Link to="/bookings" style={styles.secondaryButton}>
                                            View My Bookings
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={styles.welcomeBadge}>
                                        ✨ Smart Campus, Better Workflow
                                    </div>
                                    <h1 style={gradientHeadingStyle}>
                                        Your digital
                                        <br />
                                        campus operations hub
                                    </h1>
                                    <p style={styles.heroDescription}>
                                        Book facilities, report campus issues, manage workflows, and stay
                                        informed with a smooth modern experience.
                                    </p>
                                    <div style={styles.buttonGroup}>
                                        <Link to="/resources" style={styles.secondaryButton}>
                                            Browse Resources
                                        </Link>
                                        <Link to="/login" style={styles.primaryButton}>
                                            Get Started
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column - Carousel */}
                        <div style={styles.heroRight}>
                            <div style={styles.carouselWrapper} className="carousel-wrapper">
                                {carouselSlides.map((slide, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            ...styles.carouselSlide,
                                            opacity: currentSlide === index ? 1 : 0,
                                            backgroundImage: `url(${slide.image})`
                                        }}
                                    >
                                        <div style={styles.slideOverlay}></div>
                                        <div style={styles.slideContent}>
                                            <div style={styles.slideIcon}>{slide.icon}</div>
                                            <h3 style={styles.slideTitle}>{slide.title}</h3>
                                            <p style={styles.slideSubtitle}>{slide.subtitle}</p>
                                            <div style={styles.slideFeatures}>
                                                {slide.features.map((feature, idx) => (
                                                    <span key={idx} style={styles.slideFeature}>
                                                        ✓ {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div style={styles.carouselIndicators}>
                                    {carouselSlides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            style={{
                                                ...styles.indicator,
                                                width: currentSlide === index ? '30px' : '8px',
                                                backgroundColor: currentSlide === index ? '#84cc16' : 'rgba(255,255,255,0.5)'
                                            }}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                                    style={styles.prevArrow}
                                >
                                    ❮
                                </button>
                                <button
                                    onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
                                    style={styles.nextArrow}
                                >
                                    ❯
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.featuresSection}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <div style={styles.sectionLabel}>What We Offer</div>
                        <h2 style={styles.sectionTitle}>Platform Features</h2>
                        <p style={styles.sectionDescription}>
                            Everything needed for smart campus operations
                        </p>
                    </div>

                    <div style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <div key={index} style={styles.featureCard} className="feature-card">
                                <div style={styles.featureIcon}>{feature.icon}</div>
                                <h3 style={styles.featureTitle}>{feature.title}</h3>
                                <p style={styles.featureDescription}>{feature.description}</p>
                                <div style={styles.featureFooter}>
                                    {feature.available ? (
                                        <Link to={feature.link} style={styles.featureLink}>
                                            {feature.linkText} →
                                        </Link>
                                    ) : (
                                        <span style={styles.comingSoonBadge}>Coming Soon</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonial Section */}
            <div style={styles.testimonialSection}>
                <div style={styles.container}>
                    <div style={styles.sectionHeader}>
                        <div style={styles.sectionLabel}>Testimonials</div>
                        <h2 style={styles.sectionTitle}>What Our Users Say</h2>
                        <p style={styles.sectionDescription}>
                            Trusted by students, faculty, and staff across campus
                        </p>
                    </div>
                    <div style={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} style={styles.testimonialCard} className="testimonial-card">
                                <div style={styles.quoteIcon}>“</div>
                                <p style={styles.testimonialText}>{testimonial.text}</p>
                                <div style={styles.testimonialDivider}></div>
                                <div style={styles.testimonialAuthor}>
                                    <div style={styles.authorInitial}>{testimonial.initial}</div>
                                    <div>
                                        <div style={styles.testimonialName}>{testimonial.name}</div>
                                        <div style={styles.testimonialRole}>{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            {!isLoggedIn && (
                <div style={styles.ctaSection}>
                    <div style={styles.container}>
                        <div style={styles.ctaContent}>
                            <h2 style={styles.ctaTitle}>Ready to Transform Your Campus Experience?</h2>
                            <p style={styles.ctaDescription}>
                                Join thousands of users already using Zentrix Campus
                            </p>
                            <Link to="/login" style={styles.ctaButton}>
                                Get Started Now →
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes gradientFade {
                    0% {
                        background-position: 0% 50%;
                    }
                    25% {
                        background-position: 50% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    75% {
                        background-position: 50% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .feature-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
                }

                .testimonial-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
                }

                @media (max-width: 768px) {
                    .hero-inner {
                        flex-direction: column !important;
                    }
                    .carousel-wrapper {
                        margin-top: 30px;
                    }
                }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },

    loadingContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        gap: '16px'
    },

    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '3px solid #e5e7eb',
        borderTopColor: '#111827',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },

    loadingText: {
        color: '#6b7280',
        fontSize: '0.875rem'
    },

    heroWrapper: {
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
    },

    heroContainer: {
        maxWidth: '1200px',
        margin: '0 auto'
    },

    heroInner: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '32px',
        padding: '50px',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.1)'
    },

    heroLeft: {
        flex: 1,
        minWidth: '280px'
    },

    heroRight: {
        flex: 1,
        minWidth: '280px'
    },

    welcomeBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f3f4f6',
        padding: '6px 16px',
        borderRadius: '100px',
        fontSize: '0.875rem',
        color: '#111827',
        marginBottom: '24px',
        fontWeight: '500'
    },

    heroDescription: {
        color: '#6b7280',
        fontSize: '1rem',
        lineHeight: '1.6',
        marginBottom: '28px'
    },

    buttonGroup: {
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
    },

    primaryButton: {
        backgroundColor: '#111827',
        color: '#ffffff',
        padding: '12px 28px',
        fontWeight: '600',
        fontSize: '0.9rem',
        textDecoration: 'none',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        display: 'inline-block'
    },

    secondaryButton: {
        backgroundColor: '#f3f4f6',
        color: '#111827',
        padding: '12px 28px',
        fontWeight: '600',
        fontSize: '0.9rem',
        textDecoration: 'none',
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        display: 'inline-block'
    },

    carouselWrapper: {
        position: 'relative',
        height: '400px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2)'
    },

    carouselSlide: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition: 'opacity 0.8s ease-in-out',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '24px'
    },

    slideOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.7))',
        borderRadius: '24px'
    },

    slideContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '30px',
        color: '#ffffff'
    },

    slideIcon: {
        fontSize: '2rem',
        marginBottom: '12px'
    },

    slideTitle: {
        fontSize: '1.3rem',
        fontWeight: '700',
        marginBottom: '8px'
    },

    slideSubtitle: {
        fontSize: '0.85rem',
        opacity: 0.9,
        marginBottom: '16px',
        lineHeight: '1.5'
    },

    slideFeatures: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
    },

    slideFeature: {
        fontSize: '0.7rem',
        color: '#84cc16',
        backgroundColor: 'rgba(132, 204, 22, 0.2)',
        padding: '4px 12px',
        borderRadius: '20px',
        fontWeight: '500'
    },

    carouselIndicators: {
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        zIndex: 10
    },

    indicator: {
        height: '8px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },

    prevArrow: {
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        zIndex: 10
    },

    nextArrow: {
        position: 'absolute',
        right: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        zIndex: 10
    },

    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
    },

    featuresSection: {
        padding: '60px 0 80px',
        backgroundColor: '#f8f9fa'
    },

    sectionHeader: {
        textAlign: 'center',
        marginBottom: '48px'
    },

    sectionLabel: {
        fontSize: '0.85rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#84cc16',
        marginBottom: '12px'
    },

    sectionTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '12px',
        letterSpacing: '-0.02em'
    },

    sectionDescription: {
        color: '#6b7280',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.6'
    },

    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '24px'
    },

    featureCard: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
    },

    featureIcon: {
        fontSize: '2.5rem',
        marginBottom: '16px'
    },

    featureTitle: {
        fontWeight: '700',
        color: '#111827',
        marginBottom: '12px',
        fontSize: '1.1rem'
    },

    featureDescription: {
        color: '#6b7280',
        fontSize: '0.85rem',
        lineHeight: '1.6',
        flexGrow: 1,
        marginBottom: '20px'
    },

    featureFooter: {
        marginTop: 'auto'
    },

    featureLink: {
        backgroundColor: '#f3f4f6',
        color: '#111827',
        padding: '8px 16px',
        fontSize: '0.8rem',
        fontWeight: '600',
        textDecoration: 'none',
        borderRadius: '10px',
        display: 'inline-block',
        transition: 'all 0.2s ease'
    },

    comingSoonBadge: {
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
        padding: '8px 16px',
        fontSize: '0.8rem',
        fontWeight: '600',
        borderRadius: '10px',
        display: 'inline-block'
    },

    testimonialSection: {
        padding: '60px 0 80px',
        backgroundColor: '#ffffff'
    },

    testimonialsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px'
    },

    testimonialCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
    },

    quoteIcon: {
        fontSize: '3rem',
        color: '#84cc16',
        lineHeight: '1',
        marginBottom: '16px',
        fontFamily: 'Georgia, serif'
    },

    testimonialText: {
        color: '#4b5563',
        fontSize: '0.9rem',
        lineHeight: '1.6',
        marginBottom: '20px',
        fontStyle: 'italic'
    },

    testimonialDivider: {
        width: '50px',
        height: '2px',
        backgroundColor: '#84cc16',
        marginBottom: '16px'
    },

    testimonialAuthor: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },

    authorInitial: {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #111827, #1f2937)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: '700',
        fontSize: '1rem'
    },

    testimonialName: {
        fontWeight: '700',
        color: '#111827',
        fontSize: '0.95rem',
        marginBottom: '2px'
    },

    testimonialRole: {
        fontSize: '0.7rem',
        color: '#6b7280'
    },

    ctaSection: {
        backgroundColor: '#111827',
        padding: '80px 0'
    },

    ctaContent: {
        textAlign: 'center',
        maxWidth: '700px',
        margin: '0 auto'
    },

    ctaTitle: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: '16px'
    },

    ctaDescription: {
        fontSize: '1rem',
        color: '#9ca3af',
        marginBottom: '32px'
    },

    ctaButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#84cc16',
        color: '#ffffff',
        padding: '12px 32px',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.2s ease'
    }
};

export default HomePage;
