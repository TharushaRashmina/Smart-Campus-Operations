import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Navbar() {
    const location = useLocation();
    const { user, logout, loading } = useAuth();
    const isLoggedIn = !!user;

    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/v1/notifications/unread-count',
                { withCredentials: true }
            );
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Failed to load unread count', error);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, fetchUnreadCount]);

    useEffect(() => {
        const controlNavbar = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    if (loading) return null;

    const isAdmin = user?.role === 'ADMIN';
    const isTechnician = user?.role === 'TECHNICIAN';
    const isStaff = user?.role === 'STAFF';
    const isStudent = user?.role === 'STUDENT';
    const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'User');

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        color: isActive(path) ? '#ffffff' : '#9ca3af',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: isActive(path) ? '600' : '500',
        padding: '8px 14px',
        borderRadius: '999px',
        transition: 'all 0.2s ease',
        backgroundColor: isActive(path) ? '#1f2937' : 'transparent',
        whiteSpace: 'nowrap'
    });

    const mobileLinkStyle = (path) => ({
        color: isActive(path) ? '#84cc16' : '#ffffff',
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: isActive(path) ? '600' : '500',
        padding: '12px 16px',
        display: 'block',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
    });

    const adminDropdownLinkStyle = {
        display: 'block',
        padding: '10px 20px',
        color: '#d1d5db',
        textDecoration: 'none',
        fontSize: '0.85rem'
    };

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: '#f9f9f9',
                    padding: '12px 20px',
                    transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
                    transition: 'transform 0.3s ease',
                    boxShadow: isVisible ? '0 2px 10px rgba(0,0,0,0.05)' : 'none'
                }}
            >
                <nav
                    style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #000000, #1a1a1a)',
                        borderRadius: '50px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        overflow: 'visible'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 20px',
                            minHeight: '65px'
                        }}
                    >
                        {/* Logo */}
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                background: 'linear-gradient(135deg, #ffffff, #9ca3af)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            Zentrix Campus
                        </Link>

                        {/* Desktop Navigation */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                className="desktop-nav"
                            >
                                <Link to="/" style={navLinkStyle('/')}>Home</Link>
                                <Link to="/about" style={navLinkStyle('/about')}>About</Link>
                                <Link to="/contact" style={navLinkStyle('/contact')}>Contact</Link>
                                <Link to="/resources" style={navLinkStyle('/resources')}>Resources</Link>

                                {isLoggedIn && (
                                    <>
                                        <Link to="/bookings" style={navLinkStyle('/bookings')}>Bookings</Link>

                                        {(isStudent || isStaff || isAdmin) && (
                                            <Link to="/bookings/new" style={navLinkStyle('/bookings/new')}>
                                                New Booking
                                            </Link>
                                        )}

                                        {!isAdmin && (isStudent || isStaff) && (
                                            <>
                                                <Link to="/incidents" style={navLinkStyle('/incidents')}>My Tickets</Link>
                                                <Link to="/incidents/new" style={navLinkStyle('/incidents/new')}>Report Incident</Link>
                                            </>
                                        )}

                                        {isTechnician && !isAdmin && (
                                            <Link to="/technician/tickets" style={navLinkStyle('/technician/tickets')}>Ticket Updates</Link>
                                        )}
                                    </>
                                )}

                                {/* Admin Dropdown */}
                                {isLoggedIn && isAdmin && (
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                            style={{
                                                backgroundColor: adminDropdownOpen ? '#1f2937' : 'transparent',
                                                border: 'none',
                                                color: adminDropdownOpen ? '#ffffff' : '#9ca3af',
                                                fontSize: '0.9rem',
                                                fontWeight: '500',
                                                padding: '8px 14px',
                                                cursor: 'pointer',
                                                borderRadius: '999px',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            Admin
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path
                                                    d="M3 4.5L6 7.5L9 4.5"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </button>

                                        {adminDropdownOpen && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    background: '#1a1a1a',
                                                    border: '1px solid #374151',
                                                    borderRadius: '12px',
                                                    padding: '8px 0',
                                                    minWidth: '220px',
                                                    marginTop: '8px',
                                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                                    zIndex: 100
                                                }}
                                            >
                                                <Link
                                                    to="/admin/resources"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                >
                                                    Resource Management
                                                </Link>

                                                <Link
                                                    to="/admin/resources/summary"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                >
                                                    📊 Resource Summary
                                                </Link>

                                                <Link
                                                    to="/admin/tickets"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                >
                                                    Ticket Management
                                                </Link>

                                                <Link
                                                    to="/admin/users"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                >
                                                    User Management
                                                </Link>

                                                <Link
                                                    to="/admin/bookings"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                >
                                                    Booking Approvals
                                                </Link>
                                                <Link
                                                    to="/admin/user-summary"
                                                    style={adminDropdownLinkStyle}
                                                    onClick={() => setAdminDropdownOpen(false)}
                                                    >
                                                    User Overview
                                                    </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isLoggedIn && !isAdmin && isStaff && (
                                    <Link to="/staff/dashboard" style={navLinkStyle('/staff/dashboard')}>
                                        Staff Area
                                    </Link>
                                )}
                            </div>

                            {/* Right section */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/notifications" style={{ position: 'relative', textDecoration: 'none' }}>
                                            <div
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: '#1a1a1a'
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path
                                                        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                                                        stroke="#d1d5db"
                                                        strokeWidth="1.7"
                                                        fill="none"
                                                    />
                                                    <path
                                                        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                                                        stroke="#d1d5db"
                                                        strokeWidth="1.7"
                                                        fill="none"
                                                    />
                                                </svg>

                                                {unreadCount > 0 && (
                                                    <span
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-2px',
                                                            right: '-2px',
                                                            backgroundColor: '#ef4444',
                                                            color: '#fff',
                                                            fontSize: '9px',
                                                            fontWeight: 'bold',
                                                            padding: '2px 5px',
                                                            borderRadius: '10px',
                                                            minWidth: '16px',
                                                            textAlign: 'center'
                                                        }}
                                                    >
                                                        {unreadCount > 99 ? '99+' : unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>

                                        {!isStudent && (
                                            <span style={{
                                                background: '#1a1a1a',
                                                color: '#e5e7eb',
                                                fontSize: '0.76rem',
                                                fontWeight: '600',
                                                padding: '5px 11px',
                                                borderRadius: '20px',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                maxWidth: '140px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }} title={displayName}>
                                                {displayName}
                                            </span>
                                        )}

                                        <span style={{
                                            background: '#1a1a1a',
                                            color: '#d1d5db',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}>
                                            {user?.role}
                                        </span>

                                        <button
                                            onClick={logout}
                                            style={{
                                                background: '#1a1a1a',
                                                border: '1px solid rgba(239,68,68,0.3)',
                                                color: '#ef4444',
                                                fontSize: '0.8rem',
                                                padding: '6px 14px',
                                                borderRadius: '20px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        style={{
                                            backgroundColor: '#fff',
                                            color: '#111',
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Login
                                    </Link>
                                )}

                                {/* Mobile button */}
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    style={{
                                        display: 'none',
                                        background: '#1a1a1a',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        padding: '8px 10px'
                                    }}
                                    className="mobile-btn"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 1001
                        }}
                    />

                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: '280px',
                            backgroundColor: '#111827',
                            zIndex: 1002,
                            padding: '80px 20px 20px',
                            overflowY: 'auto',
                            boxShadow: '-5px 0 20px rgba(0,0,0,0.3)'
                        }}
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'transparent',
                                border: 'none',
                                color: '#fff',
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <Link to="/" style={mobileLinkStyle('/')} onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link to="/about" style={mobileLinkStyle('/about')} onClick={() => setMobileMenuOpen(false)}>About</Link>
                        <Link to="/contact" style={mobileLinkStyle('/contact')} onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                        <Link to="/resources" style={mobileLinkStyle('/resources')} onClick={() => setMobileMenuOpen(false)}>Resources</Link>

                        {isLoggedIn && (
                            <>
                                <Link to="/bookings" style={mobileLinkStyle('/bookings')} onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>

                                {(isStudent || isStaff || isAdmin) && (
                                    <Link to="/bookings/new" style={mobileLinkStyle('/bookings/new')} onClick={() => setMobileMenuOpen(false)}>
                                        New Booking
                                    </Link>
                                )}
                                {(isStudent || isStaff) && (
                                    <>
                                        <Link to="/incidents" style={mobileLinkStyle('/incidents')} onClick={() => setMobileMenuOpen(false)}>
                                            My Tickets
                                        </Link>
                                        <Link to="/incidents/new" style={mobileLinkStyle('/incidents/new')} onClick={() => setMobileMenuOpen(false)}>
                                            Report Incident
                                        </Link>
                                    </>
                                )}
                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin/resources"
                                            style={mobileLinkStyle('/admin/resources')}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Resource Management
                                        </Link>

                                        <Link to="/admin/tickets" style={mobileLinkStyle('/admin/tickets')} onClick={() => setMobileMenuOpen(false)}>Ticket Management</Link>
                                        <Link to="/admin/users" style={mobileLinkStyle('/admin/users')} onClick={() => setMobileMenuOpen(false)}>User Management</Link>
                                        <Link to="/admin/bookings" style={mobileLinkStyle('/admin/bookings')} onClick={() => setMobileMenuOpen(false)}>Booking Approvals</Link>
                                        <Link to="/admin/user-summary" style={mobileLinkStyle('/admin/user-summary')} onClick={() => setMobileMenuOpen(false)}>User Overview</Link>
                                    </>
                                )}
                                {isTechnician && (
                                    <Link to="/technician/tickets" style={mobileLinkStyle('/technician/tickets')} onClick={() => setMobileMenuOpen(false)}>Ticket Updates</Link>
                                )}
                                {isStaff && (
                                    <Link
                                        to="/staff/dashboard"
                                        style={mobileLinkStyle('/staff/dashboard')}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Staff Area
                                    </Link>
                                )}

                                <Link
                                    to="/notifications"
                                    style={mobileLinkStyle('/notifications')}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Notifications
                                </Link>
                            </>
                        )}
                    </div>
                </>
            )}

            <style>{`
                @media (max-width: 1024px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    .mobile-btn {
                        display: flex !important;
                    }
                }

                @media (min-width: 1025px) {
                    .desktop-nav {
                        display: flex !important;
                    }
                    .mobile-btn {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
}

export default Navbar;