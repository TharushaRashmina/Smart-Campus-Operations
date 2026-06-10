import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingService from '../services/bookingService';

function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await bookingService.getMyBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await bookingService.cancelBooking(id);
            toast.success('Booking cancelled successfully');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel booking');
        }
    };

    const getStatusConfig = (status) => {
        const config = {
            PENDING: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
            APPROVED: { label: 'Approved', color: '#10b981', bg: '#d1fae5' },
            REJECTED: { label: 'Rejected', color: '#ef4444', bg: '#fee2e2' },
            CANCELLED: { label: 'Cancelled', color: '#6b7280', bg: '#f3f4f6' }
        };
        return config[status] || { label: status, color: '#3b82f6', bg: '#dbeafe' };
    };

    const totalBookings = bookings.length;
    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;
    const cancelledRejectedCount = bookings.filter(b => b.status === 'REJECTED' || b.status === 'CANCELLED').length;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading your bookings...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>My Bookings</h1>
                        <p style={styles.subtitle}>View and manage all your resource bookings</p>
                    </div>
                    <Link to="/bookings/new" style={styles.primaryButton}>
                        + New Booking
                    </Link>
                </div>

                {/* Circular Stats Cards */}
                <div style={styles.statsGrid}>
                    {/* Total Bookings Circle */}
                    <div style={styles.statCircle}>
                        <div style={styles.circleProgress}>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                                <circle 
                                    cx="60" cy="60" r="54" 
                                    fill="none" 
                                    stroke="#111827" 
                                    strokeWidth="8"
                                    strokeDasharray={`${(totalBookings / (totalBookings || 1)) * 339.292} 339.292`}
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />
                            </svg>
                            <div style={styles.circleNumber}>{totalBookings}</div>
                        </div>
                        <div style={styles.circleLabel}>Total Bookings</div>
                    </div>

                    {/* Pending Circle */}
                    <div style={styles.statCircle}>
                        <div style={styles.circleProgress}>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                                <circle 
                                    cx="60" cy="60" r="54" 
                                    fill="none" 
                                    stroke="#f59e0b" 
                                    strokeWidth="8"
                                    strokeDasharray={`${(pendingCount / (totalBookings || 1)) * 339.292} 339.292`}
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />
                            </svg>
                            <div style={styles.circleNumber}>{pendingCount}</div>
                        </div>
                        <div style={styles.circleLabel}>Pending</div>
                    </div>

                    {/* Approved Circle */}
                    <div style={styles.statCircle}>
                        <div style={styles.circleProgress}>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                                <circle 
                                    cx="60" cy="60" r="54" 
                                    fill="none" 
                                    stroke="#10b981" 
                                    strokeWidth="8"
                                    strokeDasharray={`${(approvedCount / (totalBookings || 1)) * 339.292} 339.292`}
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />
                            </svg>
                            <div style={styles.circleNumber}>{approvedCount}</div>
                        </div>
                        <div style={styles.circleLabel}>Approved</div>
                    </div>

                    {/* Cancelled/Rejected Circle */}
                    <div style={styles.statCircle}>
                        <div style={styles.circleProgress}>
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                                <circle 
                                    cx="60" cy="60" r="54" 
                                    fill="none" 
                                    stroke="#ef4444" 
                                    strokeWidth="8"
                                    strokeDasharray={`${(cancelledRejectedCount / (totalBookings || 1)) * 339.292} 339.292`}
                                    strokeDashoffset="0"
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                                />
                            </svg>
                            <div style={styles.circleNumber}>{cancelledRejectedCount}</div>
                        </div>
                        <div style={styles.circleLabel}>Rejected</div>
                    </div>
                </div>

                {/* Bookings Table */}
                {bookings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📭</div>
                        <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
                        <p style={styles.emptyText}>
                            You haven't made any bookings yet. Click the button below to create your first booking.
                        </p>
                        <Link to="/bookings/new" style={styles.emptyButton}>
                            Create Your First Booking
                        </Link>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Resource</th>
                                    <th style={styles.th}>Location</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Time</th>
                                    <th style={styles.th}>Purpose</th>
                                    <th style={styles.th}>Attendees</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => {
                                    const statusConfig = getStatusConfig(booking.status);
                                    return (
                                        <tr key={booking.bookingId} style={styles.tableRow}>
                                            <td style={styles.td}>
                                                <span style={styles.idBadge}>#{booking.bookingId}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.resourceName}>{booking.resourceName}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.locationText}>{booking.resourceLocation}</span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.dateText}>
                                                    {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.timeText}>
                                                    {booking.startTime} - {booking.endTime}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.purposeText} title={booking.purpose}>
                                                    {booking.purpose.length > 30 
                                                        ? `${booking.purpose.substring(0, 30)}...` 
                                                        : booking.purpose}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.attendeesBadge}>
                                                    {booking.expectedAttendees || '-'}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{
                                                    ...styles.statusBadge,
                                                    backgroundColor: statusConfig.bg,
                                                    color: statusConfig.color
                                                }}>
                                                    {statusConfig.label}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                                                    <button
                                                        style={styles.cancelButton}
                                                        onClick={() => handleCancel(booking.bookingId)}
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                                {booking.status === 'REJECTED' && booking.decisionReason && (
                                                    <div style={styles.reasonTooltip}>
                                                        <span style={styles.reasonText}>{booking.decisionReason}</span>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .table-row:hover {
                    background-color: #f8f9fa;
                    transition: background-color 0.2s ease;
                }
                
                .cancel-button:hover {
                    background-color: #dc2626 !important;
                    transform: translateY(-1px);
                }
                
                .stat-circle {
                    animation: fadeInUp 0.5s ease forwards;
                }
                
                .stat-circle:nth-child(1) { animation-delay: 0s; }
                .stat-circle:nth-child(2) { animation-delay: 0.1s; }
                .stat-circle:nth-child(3) { animation-delay: 0.2s; }
                .stat-circle:nth-child(4) { animation-delay: 0.3s; }
            `}</style>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '100px 20px'
    },

    container: {
        maxWidth: '1400px',
        margin: '0 auto'
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

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '48px',
        flexWrap: 'wrap',
        gap: '16px'
    },

    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px',
        letterSpacing: '-0.02em'
    },

    subtitle: {
        fontSize: '1rem',
        color: '#6b7280'
    },

    primaryButton: {
        backgroundColor: '#111827',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        display: 'inline-block'
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        marginBottom: '48px',
        justifyItems: 'center'
    },

    statCircle: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative'
    },

    circleProgress: {
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '16px'
    },

    circleNumber: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#111827'
    },

    circleLabel: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '8px'
    },

    emptyState: {
        textAlign: 'center',
        padding: '80px 40px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e5e7eb'
    },

    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '20px'
    },

    emptyTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '8px'
    },

    emptyText: {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '24px'
    },

    emptyButton: {
        backgroundColor: '#111827',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        textDecoration: 'none',
        display: 'inline-block'
    },

    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        padding:'20px 20px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },

    tableHeader: {
        borderBottom: '2px solid #f3f4f6',
        backgroundColor: '#f9fafb'
    },

    th: {
        textAlign: 'left',
        padding: '16px',
        fontSize: '0.75rem',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#000000'
    },

    tableRow: {
        borderBottom: '1px solid #111827',
        transition: 'background-color 0.2s ease'
    },

    td: {
        padding: '16px',
        fontSize: '0.875rem',
        color: '#111827',
        verticalAlign: 'middle'
    },

    idBadge: {
        fontWeight: '600',
        color: '#000000',
        fontSize: '0.8rem'
    },

    resourceName: {
        fontWeight: '600',
        color: '#111827'
    },

    locationText: {
        color: '#111827',
        fontSize: '0.8rem'
    },

    dateText: {
        fontWeight: '500',
        color: '#111827'
    },

    timeText: {
        color: '#111827',
        fontSize: '0.8rem'
    },

    purposeText: {
        color: '#111827',
        fontSize: '0.85rem'
    },

    attendeesBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        backgroundColor: '#f3f4f6',
        borderRadius: '20px',
        fontSize: '0.75rem',
        color: '#111827'
    },

    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },

    cancelButton: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    reasonTooltip: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'help'
    },

    reasonIcon: {
        fontSize: '0.9rem'
    },

    reasonText: {
        fontSize: '0.7rem',
        color: '#111827',
        maxWidth: '200px'
    }
};

export default BookingListPage;