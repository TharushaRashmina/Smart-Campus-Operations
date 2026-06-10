import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import bookingService from '../services/bookingService';

function AdminBookingsPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await bookingService.decideBooking(id, 'APPROVE');
            toast.success('Booking approved successfully');
            fetchAllBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve booking');
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        try {
            await bookingService.decideBooking(id, 'REJECT', rejectReason);
            toast.success('Booking rejected');
            setRejectingId(null);
            setRejectReason('');
            fetchAllBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject booking');
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
    const rejectedCount = bookings.filter(b => b.status === 'REJECTED').length;
    const cancelledCount = bookings.filter(b => b.status === 'CANCELLED').length;

    const filteredBookings = filterStatus === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading bookings...</p>
            </div>
        );
    }

    const handleGeneratePDF = () => {
        const printWindow = window.open('', '_blank');
        const statusLabel = filterStatus === 'ALL' ? 'All Statuses' : filterStatus;
        const generatedDate = new Date().toLocaleString();

        const tableRows = filteredBookings.map(booking => `
            <tr>
                <td>#${booking.bookingId}</td>
                <td>${booking.username}</td>
                <td>${booking.resourceName}<br/><small>${booking.resourceLocation}</small></td>
                <td>${new Date(booking.bookingDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                })}</td>
                <td>${booking.startTime} - ${booking.endTime}</td>
                <td>${booking.purpose}</td>
                <td>${booking.status}</td>
                <td>${booking.decidedBy || '-'}</td>
                <td>${booking.decisionReason || '-'}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Bookings Report - ${statusLabel}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 40px;
                        color: #111827;
                        font-size: 13px;
                    }
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 32px;
                        border-bottom: 2px solid #111827;
                        padding-bottom: 16px;
                    }
                    .title {
                        font-size: 22px;
                        font-weight: 700;
                        margin: 0 0 4px 0;
                    }
                    .subtitle {
                        font-size: 13px;
                        color: #6b7280;
                        margin: 0;
                    }
                    .meta {
                        text-align: right;
                        font-size: 12px;
                        color: #6b7280;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 3px 10px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        background-color: #f3f4f6;
                        border: 1px solid #e5e7eb;
                    }
                    .summary {
                        background-color: #f9fafb;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 16px 20px;
                        margin-bottom: 24px;
                        display: flex;
                        gap: 32px;
                    }
                    .summary-item {
                        text-align: center;
                    }
                    .summary-value {
                        font-size: 24px;
                        font-weight: 700;
                        color: #111827;
                    }
                    .summary-label {
                        font-size: 11px;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 8px;
                    }
                    th {
                        background-color: #111827;
                        color: #ffffff;
                        padding: 10px 12px;
                        text-align: left;
                        font-size: 11px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    td {
                        padding: 10px 12px;
                        border-bottom: 1px solid #e5e7eb;
                        vertical-align: top;
                    }
                    tr:nth-child(even) {
                        background-color: #f9fafb;
                    }
                    small {
                        font-size: 11px;
                        color: #6b7280;
                    }
                    .footer {
                        margin-top: 32px;
                        padding-top: 12px;
                        border-top: 1px solid #e5e7eb;
                        font-size: 11px;
                        color: #9ca3af;
                        text-align: center;
                    }
                    @media print {
                        body { margin: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <p class="title">🏫 Smart Campus Operations Hub</p>
                        <p class="subtitle">Bookings Report — ${statusLabel}</p>
                    </div>
                    <div class="meta">
                        <div>Generated: ${generatedDate}</div>
                        <div>Total Records: ${filteredBookings.length}</div>
                        <div class="status-badge">${statusLabel}</div>
                    </div>
                </div>

                <div class="summary">
                    <div class="summary-item">
                        <div class="summary-value">${filteredBookings.length}</div>
                        <div class="summary-label">Total</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${filteredBookings.filter(b => b.status === 'PENDING').length}</div>
                        <div class="summary-label">Pending</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${filteredBookings.filter(b => b.status === 'APPROVED').length}</div>
                        <div class="summary-label">Approved</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${filteredBookings.filter(b => b.status === 'REJECTED').length}</div>
                        <div class="summary-label">Rejected</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-value">${filteredBookings.filter(b => b.status === 'CANCELLED').length}</div>
                        <div class="summary-label">Cancelled</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Resource</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Decided By</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>

                <div class="footer">
                    IT3030 – Programming Applications and Frameworks | SLIIT 2026 | Smart Campus Operations Hub
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.header}>
                    <div>
                        <h1 style={styles.title}>Booking Management</h1>
                        <p style={styles.subtitle}>Admin — View and manage all campus bookings</p>
                    </div>
                </div>

                {/* Stats Cards - Square Shape without emojis */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statValue}>{totalBookings}</div>
                        <div style={styles.statLabel}>Total Bookings</div>
                        <div style={styles.statBar}></div>
                    </div>
                    <div style={{...styles.statCard, borderBottomColor: '#f59e0b'}}>
                        <div style={styles.statValue}>{pendingCount}</div>
                        <div style={styles.statLabel}>Pending</div>
                        <div style={{...styles.statBar, backgroundColor: '#f59e0b'}}></div>
                    </div>
                    <div style={{...styles.statCard, borderBottomColor: '#10b981'}}>
                        <div style={styles.statValue}>{approvedCount}</div>
                        <div style={styles.statLabel}>Approved</div>
                        <div style={{...styles.statBar, backgroundColor: '#10b981'}}></div>
                    </div>
                    <div style={{...styles.statCard, borderBottomColor: '#ef4444'}}>
                        <div style={styles.statValue}>{rejectedCount}</div>
                        <div style={styles.statLabel}>Rejected</div>
                        <div style={{...styles.statBar, backgroundColor: '#ef4444'}}></div>
                    </div>
                    <div style={{...styles.statCard, borderBottomColor: '#6b7280'}}>
                        <div style={styles.statValue}>{cancelledCount}</div>
                        <div style={styles.statLabel}>Cancelled</div>
                        <div style={{...styles.statBar, backgroundColor: '#6b7280'}}></div>
                    </div>
                </div>

                {/* Filter Section */}
                    <div style={styles.filterControls}>
                        <select
                            style={styles.filterSelect}
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                        {filterStatus !== 'ALL' && (
                            <button
                                style={styles.clearButton}
                                onClick={() => setFilterStatus('ALL')}
                            >
                                Clear Filter
                            </button>
                        )}
                        <button
                            style={styles.pdfButton}
                            onClick={handleGeneratePDF}
                        >
                            📄 Generate PDF
                        </button>
                    </div>

                {/* Bookings Table */}
                {filteredBookings.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📭</div>
                        <h3 style={styles.emptyTitle}>No Bookings Found</h3>
                        <p style={styles.emptyText}>
                            {filterStatus === 'ALL' 
                                ? 'No bookings have been created yet.' 
                                : `No ${filterStatus.toLowerCase()} bookings found.`}
                        </p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Resource</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Time</th>
                                    <th style={styles.th}>Purpose</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Decision By</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => {
                                    const statusConfig = getStatusConfig(booking.status);
                                    return (
                                        <React.Fragment key={booking.bookingId}>
                                            <tr style={styles.tableRow}>
                                                <td style={styles.td}>
                                                    <span style={styles.idBadge}>#{booking.bookingId}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.username}>{booking.username}</span>
                                                </td>
                                                <td style={styles.td}>
                                                    <div style={styles.resourceName}>{booking.resourceName}</div>
                                                    <div style={styles.resourceLocation}>{booking.resourceLocation}</div>
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
                                                    <span style={{
                                                        ...styles.statusBadge,
                                                        backgroundColor: statusConfig.bg,
                                                        color: statusConfig.color
                                                    }}>
                                                        {statusConfig.label}
                                                    </span>
                                                    {booking.decisionReason && booking.status === 'REJECTED' && (
                                                        <div style={styles.reasonTooltip}>
                                                            <span style={styles.reasonText}>{booking.decisionReason}</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.decidedBy}>
                                                        {booking.decidedBy || '-'}
                                                    </span>
                                                </td>
                                                <td style={styles.td}>
                                                    {booking.status === 'PENDING' && (
                                                        <div style={styles.actionButtons}>
                                                            <button
                                                                style={styles.approveButton}
                                                                onClick={() => handleApprove(booking.bookingId)}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#059669';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#10b981';
                                                                }}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                style={styles.rejectButton}
                                                                onClick={() => setRejectingId(booking.bookingId)}
                                                                onMouseEnter={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#dc2626';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.currentTarget.style.backgroundColor = '#ef4444';
                                                                }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            {rejectingId === booking.bookingId && (
                                                <tr style={styles.rejectRow}>
                                                    <td colSpan="9" style={styles.rejectCell}>
                                                        <div style={styles.rejectContainer}>
                                                            <input
                                                                type="text"
                                                                style={styles.rejectInput}
                                                                placeholder="Enter rejection reason..."
                                                                value={rejectReason}
                                                                onChange={e => setRejectReason(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <button
                                                                style={styles.confirmButton}
                                                                onClick={() => handleReject(booking.bookingId)}
                                                            >
                                                                Confirm
                                                            </button>
                                                            <button
                                                                style={styles.cancelRejectButton}
                                                                onClick={() => {
                                                                    setRejectingId(null);
                                                                    setRejectReason('');
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
                
                .approve-button:hover,
                .reject-button:hover {
                    transform: translateY(-1px);
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .stat-card:hover .stat-bar {
                    width: 60px;
                }
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
        marginBottom: '32px'
    },

    title: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#111827',
        marginBottom: '8px',
        letterSpacing: '-0.02em'
    },

    subtitle: {
        fontSize: '1rem',
        color: '#6b7280'
    },

    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
    },

    statCard: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px 20px',
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        borderBottomWidth: '4px',
        borderBottomColor: '#111827',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },

    statValue: {
        fontSize: '2rem',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '8px'
    },

    statLabel: {
        fontSize: '0.75rem',
        color: '#111827',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },

    statBar: {
        width: '40px',
        height: '3px',
        backgroundColor: '#111827',
        margin: '12px auto 0',
        transition: 'width 0.3s ease'
    },

    filterCard: {
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px 20px 20px',
        marginBottom: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },

    filterHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
    },

    filterTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#111827',
        margin: 0
    },

    filterControls: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },

    filterSelect: {
        padding: '10px 16px',
        borderRadius: '10px',
        border: '1.5px solid #e5e7eb',
        fontSize: '0.875rem',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        fontFamily: 'inherit'
    },

    clearButton: {
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '500',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    pdfButton: {
        padding: '10px 16px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        backgroundColor: '#111827',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
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
        color: '#6b7280'
    },

    tableContainer: {
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        padding: '20px 20px 20px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },

    tableHeader: {
        borderBottom: '2px solid #111827',
        backgroundColor: '#f9fafb'
    },

    th: {
        textAlign: 'left',
        padding: '16px',
        fontSize: '1rem',
        fontWeight: '700',
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
        color: '#111827',
        fontSize: '0.8rem'
    },

    username: {
        fontWeight: '600',
        color: '#111827'
    },

    resourceName: {
        fontWeight: '500',
        color: '#111827'
    },

    resourceLocation: {
        fontSize: '0.7rem',
        color: '#111827',
        marginTop: '2px'
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

    statusBadge: {
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '600'
    },

    decidedBy: {
        fontSize: '0.8rem',
        color: '#111827'
    },

    actionButtons: {
        display: 'flex',
        gap: '8px'
    },

    approveButton: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        border: 'none',
        padding: '6px 14px',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    rejectButton: {
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

    rejectRow: {
        backgroundColor: '#fef3c7'
    },

    rejectCell: {
        padding: '16px'
    },

    rejectContainer: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    },

    rejectInput: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '10px',
        border: '1.5px solid #e5e7eb',
        fontSize: '0.875rem',
        backgroundColor: '#ffffff',
        fontFamily: 'inherit'
    },

    confirmButton: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    cancelRejectButton: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '1px solid #e5e7eb',
        padding: '10px 20px',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },

    reasonTooltip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginLeft: '8px',
        cursor: 'help'
    },

    reasonText: {
        fontSize: '0.7rem',
        color: '#111827'
    }
};

export default AdminBookingsPage;
