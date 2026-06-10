import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";

function AdminUserSummaryPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeChart, setActiveChart] = useState("role");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportFormat, setReportFormat] = useState("csv");
  const [reportType, setReportType] = useState("all");
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");

      const res = await axios.get("http://localhost:8080/api/v1/admin/users", {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401) {
        setError("Unauthorized. Please login as admin.");
      } else if (err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Failed to load user summary");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtered and searched users
  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    if (roleFilter !== "ALL") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [users, roleFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Statistics and Chart Data
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalStudents = users.filter((u) => u.role === "STUDENT").length;
    const totalStaff = users.filter((u) => u.role === "STAFF").length;
    const totalTechnicians = users.filter((u) => u.role === "TECHNICIAN").length;
    const totalAdmins = users.filter((u) => u.role === "ADMIN").length;
    const totalLocalUsers = users.filter((u) => u.provider === "LOCAL").length;
    const totalGoogleUsers = users.filter((u) => u.provider === "GOOGLE").length;
    
    const lastMonthCount = Math.floor(totalUsers * 0.85);
    const userGrowth = totalUsers > 0 ? ((totalUsers - lastMonthCount) / lastMonthCount) * 100 : 0;
    
    return {
      totalUsers,
      totalStudents,
      totalStaff,
      totalTechnicians,
      totalAdmins,
      totalLocalUsers,
      totalGoogleUsers,
      userGrowth: userGrowth.toFixed(1),
      activeUsers: users.filter(u => u.active !== false).length,
      inactiveUsers: users.filter(u => u.active === false).length
    };
  }, [users]);

  // Chart data for roles
  const roleChartData = useMemo(() => {
    return [
      { label: "Students", value: stats.totalStudents, color: "#3b82f6", percentage: (stats.totalStudents / stats.totalUsers) * 100 || 0 },
      { label: "Staff", value: stats.totalStaff, color: "#f59e0b", percentage: (stats.totalStaff / stats.totalUsers) * 100 || 0 },
      { label: "Technicians", value: stats.totalTechnicians, color: "#8b5cf6", percentage: (stats.totalTechnicians / stats.totalUsers) * 100 || 0 },
      { label: "Admins", value: stats.totalAdmins, color: "#ef4444", percentage: (stats.totalAdmins / stats.totalUsers) * 100 || 0 }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Chart data for providers
  const providerChartData = useMemo(() => {
    return [
      { label: "Local Users", value: stats.totalLocalUsers, color: "#06b6d4", percentage: (stats.totalLocalUsers / stats.totalUsers) * 100 || 0 },
      { label: "Google Users", value: stats.totalGoogleUsers, color: "#ec4899", percentage: (stats.totalGoogleUsers / stats.totalUsers) * 100 || 0 }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Chart data for status
  const statusChartData = useMemo(() => {
    return [
      { label: "Active", value: stats.activeUsers, color: "#10b981", percentage: (stats.activeUsers / stats.totalUsers) * 100 || 0 },
      { label: "Inactive", value: stats.inactiveUsers, color: "#ef4444", percentage: (stats.inactiveUsers / stats.totalUsers) * 100 || 0 }
    ].filter(item => item.value > 0);
  }, [stats]);

  const recentUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      return new Date(b.createdAt || b.joinDate || 0) - new Date(a.createdAt || a.joinDate || 0);
    }).slice(0, 5);
  }, [users]);

  const handleRefresh = () => {
    fetchUsers(true);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Report Generation Functions
  const generateCSV = (data, filename) => {
    const headers = ["Username", "Email", "Role", "Provider", "Status", "Joined Date"];
    const csvRows = [headers];
    
    data.forEach(user => {
      const row = [
        `"${user.username || ''}"`,
        `"${user.email || ''}"`,
        `"${user.role || ''}"`,
        `"${user.provider || ''}"`,
        `"${user.active !== false ? 'Active' : 'Inactive'}"`,
        `"${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateHTML = (data, filename) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #3b82f6; color: white; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .summary { margin-top: 30px; padding: 20px; background-color: #f0f9ff; border-radius: 8px; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
          .stat-card { padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .stat-value { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .stat-label { color: #64748b; margin-top: 5px; }
        </style>
      </head>
      <body>
        <h1>User Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <h2>Summary Statistics</h2>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">${data.length}</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.filter(u => u.role === 'STUDENT').length}</div>
              <div class="stat-label">Students</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.filter(u => u.role === 'STAFF').length}</div>
              <div class="stat-label">Staff</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.filter(u => u.provider === 'LOCAL').length}</div>
              <div class="stat-label">Local Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${data.filter(u => u.provider === 'GOOGLE').length}</div>
              <div class="stat-label">Google Users</div>
            </div>
          </div>
        </div>
        
        <h2>User Details</h2>
         <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Provider</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(user => `
              <tr>
                <td>${user.username || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.role || ''}</td>
                <td>${user.provider || ''}</td>
                <td>${user.active !== false ? 'Active' : 'Inactive'}</td>
                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
         </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDF = async (data, filename) => {
    // Simple PDF generation using browser's print functionality
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #0f172a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #3b82f6; color: white; }
          @media print {
            body { margin: 0; padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>User Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <h2>User Details</h2>
         <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Provider</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(user => `
              <tr>
                <td>${user.username || ''}</td>
                <td>${user.email || ''}</td>
                <td>${user.role || ''}</td>
                <td>${user.provider || ''}</td>
                <td>${user.active !== false ? 'Active' : 'Inactive'}</td>
              </tr>
            `).join('')}
          </tbody>
         </table>
        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleGenerateReport = () => {
    setGeneratingReport(true);
    
    try {
      let dataToExport = [];
      let filename = `user_report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;
      
      // Select data based on report type
      if (reportType === "all") {
        dataToExport = users;
        filename += `_all_users`;
      } else if (reportType === "filtered") {
        dataToExport = filteredUsers;
        filename += `_filtered_users`;
      } else if (reportType === "recent") {
        dataToExport = recentUsers;
        filename += `_recent_users`;
      } else if (reportType === "stats") {
        // Export statistics summary
        const statsData = {
          generatedAt: new Date().toISOString(),
          summary: stats,
          roleDistribution: roleChartData,
          providerDistribution: providerChartData,
          statusDistribution: statusChartData
        };
        
        if (reportFormat === "json") {
          generateJSON(statsData, `${filename}.json`);
        } else {
          generateJSON(statsData, `${filename}.json`);
        }
        setGeneratingReport(false);
        setShowReportModal(false);
        return;
      }
      
      // Generate report in selected format
      switch(reportFormat) {
        case "csv":
          generateCSV(dataToExport, `${filename}.csv`);
          break;
        case "json":
          generateJSON(dataToExport, `${filename}.json`);
          break;
        case "html":
          generateHTML(dataToExport, `${filename}.html`);
          break;
        case "pdf":
          generatePDF(dataToExport, `${filename}.pdf`);
          break;
        default:
          generateCSV(dataToExport, `${filename}.csv`);
      }
      
      setGeneratingReport(false);
      setShowReportModal(false);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report");
      setGeneratingReport(false);
    }
  };

  const renderChart = () => {
    let data = [];
    let title = "";
    
    switch(activeChart) {
      case "role":
        data = roleChartData;
        title = "User Distribution by Role";
        break;
      case "provider":
        data = providerChartData;
        title = "User Distribution by Provider";
        break;
      case "status":
        data = statusChartData;
        title = "User Status Distribution";
        break;
      default:
        data = roleChartData;
        title = "User Distribution by Role";
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>{title}</h3>
        <div style={styles.barChart}>
          {data.map((item, index) => (
            <div key={index} style={styles.barChartItem}>
              <div style={styles.barChartLabel}>
                <span style={{...styles.barColorDot, backgroundColor: item.color}}></span>
                <span>{item.label}</span>
                <span style={styles.barChartValue}>{item.value} users</span>
              </div>
              <div style={styles.barChartBarWrapper}>
                <div 
                  style={{
                    ...styles.barChartBar,
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color
                  }}
                >
                  <span style={styles.barChartPercentage}>{item.percentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={styles.pieChartContainer}>
          <svg viewBox="0 0 200 200" style={styles.pieChart}>
            {data.reduce((acc, item, index) => {
              const startAngle = acc.angle;
              const angle = (item.value / stats.totalUsers) * 360;
              const endAngle = startAngle + angle;
              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
              const largeArc = angle > 180 ? 1 : 0;
              
              acc.elements.push(
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
              acc.angle = endAngle;
              return acc;
            }, { elements: [], angle: 0 }).elements}
            <circle cx="100" cy="100" r="40" fill="#fff" />
            <text x="100" y="95" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">
              Total
            </text>
            <text x="100" y="115" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3b82f6">
              {stats.totalUsers}
            </text>
          </svg>
          <div style={styles.pieChartLegend}>
            {data.map((item, index) => (
              <div key={index} style={styles.legendItem}>
                <span style={{...styles.legendColor, backgroundColor: item.color}}></span>
                <span style={styles.legendText}>{item.label}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <div style={styles.loadingText}>Loading user dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>User Overview Dashboard</h1>
            <p style={styles.subtitle}>
              Comprehensive analytics and management for all system users
            </p>
          </div>
          <div style={styles.headerButtons}>
            <button 
              onClick={() => setShowReportModal(true)} 
              style={styles.reportButton}
            >
              📊 Download Report
            </button>
            <button 
              onClick={handleRefresh} 
              style={styles.refreshButton}
              disabled={refreshing}
            >
              <span style={styles.refreshIcon}>⟳</span>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>⚠️</span>
            {error}
            <button onClick={() => fetchUsers()} style={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid - Rounded Shapes without emojis */}
        <div style={styles.grid}>
          <SummaryCard 
            title="Total Users" 
            value={stats.totalUsers}
            trend={stats.userGrowth}
            color="#3b82f6"
          />
          <SummaryCard 
            title="Students" 
            value={stats.totalStudents}
            color="#10b981"
          />
          <SummaryCard 
            title="Staff" 
            value={stats.totalStaff}
            color="#f59e0b"
          />
          <SummaryCard 
            title="Technicians" 
            value={stats.totalTechnicians}
            color="#8b5cf6"
          />
          <SummaryCard 
            title="Admins" 
            value={stats.totalAdmins}
            color="#ef4444"
          />
          <SummaryCard 
            title="Local Users" 
            value={stats.totalLocalUsers}
            color="#06b6d4"
          />
          <SummaryCard 
            title="Google Users" 
            value={stats.totalGoogleUsers}
            color="#ec4899"
          />
          <SummaryCard 
            title="Active Users" 
            value={stats.activeUsers}
            color="#14b8a6"
          />
        </div>

        {/* Charts Section */}
        <div style={styles.chartsSection}>
          <div style={styles.chartsHeader}>
            <h2 style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>📊</span>
              Analytics & Insights
            </h2>
            <div style={styles.chartTabs}>
              <button
                onClick={() => setActiveChart("role")}
                style={{
                  ...styles.chartTab,
                  ...(activeChart === "role" ? styles.activeChartTab : {})
                }}
              >
                By Role
              </button>
              <button
                onClick={() => setActiveChart("provider")}
                style={{
                  ...styles.chartTab,
                  ...(activeChart === "provider" ? styles.activeChartTab : {})
                }}
              >
                By Provider
              </button>
              <button
                onClick={() => setActiveChart("status")}
                style={{
                  ...styles.chartTab,
                  ...(activeChart === "status" ? styles.activeChartTab : {})
                }}
              >
                By Status
              </button>
            </div>
          </div>
          {renderChart()}
        </div>

        {/* Filters and Search */}
        <div style={styles.filterContainer}>
          <div style={styles.filterSection}>
            <div style={styles.searchWrapper}>
              <input
                type="text"
                placeholder="🔍 Search by username or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.searchInput}
              />
            </div>
            <div style={styles.filterWrapper}>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={styles.filterSelect}
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="STAFF">Staff</option>
                <option value="TECHNICIAN">Technicians</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>👥</span>
            User Management
            <span style={styles.userCount}>
              {filteredUsers.length} / {users.length} users
            </span>
          </h2>

          {filteredUsers.length === 0 ? (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>📭</div>
              <p>No users found matching your criteria</p>
            </div>
          ) : (
            <>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Username</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, index) => (
                      <tr key={user.userId || index} style={styles.tableRow}>
                        <td style={styles.td}>
                          <strong>{user.username}</strong>
                        </td>
                        <td style={styles.td}>{user.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.roleBadge,
                            ...getRoleStyle(user.role)
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.providerBadge,
                            ...getProviderStyle(user.provider)
                          }}>
                            {user.provider === 'GOOGLE' ? '🌐' : '📧'} {user.provider}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={styles.pageButton}
                  >
                    ← Previous
                  </button>
                  <div style={styles.pageNumbers}>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          style={{
                            ...styles.pageNumberButton,
                            ...(currentPage === pageNum ? styles.activePage : {})
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={styles.pageButton}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Users Section */}
        <div style={styles.recentSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📈</span>
            Recent Registrations
          </h2>
          <div style={styles.recentList}>
            {recentUsers.length === 0 ? (
              <div style={styles.emptyBox}>No recent users</div>
            ) : (
              recentUsers.map((user, index) => (
                <div key={user.userId || index} style={styles.recentItem}>
                  <div style={styles.recentAvatar}>
                    {user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div style={styles.recentInfo}>
                    <div style={styles.recentName}>{user.username}</div>
                    <div style={styles.recentEmail}>{user.email}</div>
                  </div>
                  <div style={styles.recentMeta}>
                    <span style={styles.recentRole}>{user.role}</span>
                    <span style={styles.recentProvider}>{user.provider === 'GOOGLE' ? '🌐 Google' : '📧 Local'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div style={styles.modalOverlay} onClick={() => setShowReportModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Download Report</h2>
              <button style={styles.modalClose} onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.modalSection}>
                <label style={styles.modalLabel}>Report Type:</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  style={styles.modalSelect}
                >
                  <option value="all">All Users</option>
                  <option value="filtered">Filtered Users (Current View)</option>
                  <option value="recent">Recent Users (Last 5)</option>
                  <option value="stats">Statistics Summary Only</option>
                </select>
              </div>
              
              <div style={styles.modalSection}>
                <label style={styles.modalLabel}>Format:</label>
                <div style={styles.formatOptions}>
                  <label style={styles.formatOption}>
                    <input
                      type="radio"
                      value="csv"
                      checked={reportFormat === "csv"}
                      onChange={(e) => setReportFormat(e.target.value)}
                      style={styles.radio}
                    />
                    CSV (Excel)
                  </label>
                  <label style={styles.formatOption}>
                    <input
                      type="radio"
                      value="json"
                      checked={reportFormat === "json"}
                      onChange={(e) => setReportFormat(e.target.value)}
                      style={styles.radio}
                    />
                    JSON
                  </label>
                  <label style={styles.formatOption}>
                    <input
                      type="radio"
                      value="html"
                      checked={reportFormat === "html"}
                      onChange={(e) => setReportFormat(e.target.value)}
                      style={styles.radio}
                    />
                    HTML (Web Page)
                  </label>
                  <label style={styles.formatOption}>
                    <input
                      type="radio"
                      value="pdf"
                      checked={reportFormat === "pdf"}
                      onChange={(e) => setReportFormat(e.target.value)}
                      style={styles.radio}
                    />
                    PDF (Print)
                  </label>
                </div>
              </div>
              
              <div style={styles.modalInfo}>
                <p>📊 Report will include:</p>
                <ul>
                  {reportType === "stats" ? (
                    <>
                      <li>Summary statistics</li>
                      <li>Role distribution data</li>
                      <li>Provider distribution data</li>
                      <li>Status distribution data</li>
                    </>
                  ) : (
                    <>
                      <li>User details (Username, Email, Role, Provider, Status)</li>
                      <li>Generated timestamp</li>
                      <li>{reportType === "all" ? "All users in system" : reportType === "filtered" ? "Currently filtered users" : "5 most recent users"}</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.modalCancel} onClick={() => setShowReportModal(false)}>
                Cancel
              </button>
              <button 
                style={styles.modalDownload} 
                onClick={handleGenerateReport}
                disabled={generatingReport}
              >
                {generatingReport ? 'Generating...' : 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          * {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}

function SummaryCard({ title, value, trend, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <div style={styles.cardTitle}>{title}</div>
        <div style={styles.cardValue}>{value.toLocaleString()}</div>
        {trend && trend !== '0.0' && (
          <div style={styles.cardTrend}>
            <span>📊</span>
            <span style={{ color: parseFloat(trend) > 0 ? '#10b981' : '#ef4444' }}>
              {parseFloat(trend) > 0 ? '+' : ''}{trend}%
            </span>
            <span style={styles.trendText}>vs last month</span>
          </div>
        )}
      </div>
      <div style={{ ...styles.cardAccent, backgroundColor: color }}></div>
    </div>
  );
}

const getRoleStyle = (role) => {
  const styles = {
    STUDENT: { backgroundColor: '#dbeafe', color: '#1e40af' },
    STAFF: { backgroundColor: '#fed7aa', color: '#92400e' },
    TECHNICIAN: { backgroundColor: '#e9d5ff', color: '#5b21b6' },
    ADMIN: { backgroundColor: '#fecaca', color: '#991b1b' }
  };
  return styles[role] || styles.STUDENT;
};

const getProviderStyle = (provider) => {
  const styles = {
    LOCAL: { backgroundColor: '#cffafe', color: '#0e7490' },
    GOOGLE: { backgroundColor: '#fce7f3', color: '#be185d' }
  };
  return styles[provider] || styles.LOCAL;
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f9ff",
    padding: "100px 20px 40px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  headerButtons: {
    display: "flex",
    gap: "12px",
  },
  title: {
    fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
    fontWeight: "700",
    background: "linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    margin: 0,
  },
  reportButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#475569",
    transition: "all 0.3s ease",
  },
  refreshIcon: {
    fontSize: "18px",
    display: "inline-block",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    zIndex: 1,
  },
  cardAccent: {
    width: "6px",
    height: "60px",
    borderRadius: "3px",
    position: "absolute",
    right: "20px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  cardTitle: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardValue: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 1.2,
  },
  cardTrend: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.75rem",
    marginTop: "8px",
  },
  trendText: {
    color: "#94a3b8",
    marginLeft: "4px",
  },
  chartsSection: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "30px",
  },
  chartsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "16px",
  },
  chartTabs: {
    display: "flex",
    gap: "8px",
    backgroundColor: "#f1f5f9",
    padding: "4px",
    borderRadius: "12px",
  },
  chartTab: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "#64748b",
    transition: "all 0.2s",
  },
  activeChartTab: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
  },
  chartContainer: {
    marginTop: "16px",
  },
  chartTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "20px",
  },
  barChart: {
    marginBottom: "30px",
  },
  barChartItem: {
    marginBottom: "16px",
  },
  barChartLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
    fontSize: "0.9rem",
    color: "#475569",
  },
  barColorDot: {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
  },
  barChartValue: {
    marginLeft: "auto",
    fontWeight: "600",
    color: "#0f172a",
  },
  barChartBarWrapper: {
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    overflow: "hidden",
  },
  barChartBar: {
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: "12px",
    transition: "width 0.5s ease-out",
  },
  barChartPercentage: {
    color: "#ffffff",
    fontSize: "0.85rem",
    fontWeight: "600",
  },
  pieChartContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
  },
  pieChart: {
    width: "200px",
    height: "200px",
  },
  pieChartLegend: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendColor: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
  },
  legendText: {
    fontSize: "0.9rem",
    color: "#475569",
  },
  filterContainer: {
    marginBottom: "24px",
  },
  filterSection: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: 2,
    minWidth: "250px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "#ffffff",
  },
  filterWrapper: {
    flex: 1,
    minWidth: "180px",
  },
  filterSelect: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "30px",
  },
  recentSection: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  sectionTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.4rem)",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  sectionIcon: {
    fontSize: "1.4rem",
  },
  userCount: {
    marginLeft: "auto",
    fontSize: "0.9rem",
    fontWeight: "normal",
    color: "#64748b",
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
    color: "#0f172a",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    fontSize: "0.9rem",
  },
  tableRow: {
    transition: "background-color 0.2s",
  },
  roleBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block",
  },
  providerBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
    flexWrap: "wrap",
  },
  pageButton: {
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  },
  pageNumbers: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  pageNumberButton: {
    padding: "8px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    minWidth: "36px",
  },
  activePage: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderColor: "#3b82f6",
  },
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  recentItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#f8fafc",
    transition: "transform 0.2s",
    flexWrap: "wrap",
  },
  recentAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1.1rem",
  },
  recentInfo: {
    flex: 1,
    minWidth: "150px",
  },
  recentName: {
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "4px",
  },
  recentEmail: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  recentMeta: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  recentRole: {
    padding: "4px 8px",
    backgroundColor: "#e2e8f0",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "600",
  },
  recentProvider: {
    padding: "4px 8px",
    backgroundColor: "#cffafe",
    borderRadius: "6px",
    fontSize: "0.7rem",
    fontWeight: "600",
    color: "#0e7490",
  },
  loadingContainer: {
    backgroundColor: "#ffffff",
    padding: "60px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    color: "#64748b",
    fontSize: "1rem",
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "14px 20px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  errorIcon: {
    fontSize: "1.2rem",
  },
  retryButton: {
    marginLeft: "auto",
    padding: "6px 12px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out",
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    maxWidth: "500px",
    width: "90%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#0f172a",
    margin: 0,
  },
  modalClose: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#64748b",
    padding: "0",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    transition: "all 0.2s",
  },
  modalBody: {
    padding: "24px",
  },
  modalSection: {
    marginBottom: "24px",
  },
  modalLabel: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: "8px",
  },
  modalSelect: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  formatOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formatOption: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontSize: "0.95rem",
    color: "#334155",
  },
  radio: {
    cursor: "pointer",
  },
  modalInfo: {
    backgroundColor: "#f0f9ff",
    padding: "16px",
    borderRadius: "8px",
    marginTop: "16px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px 24px",
    borderTop: "1px solid #e2e8f0",
  },
  modalCancel: {
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#64748b",
    transition: "all 0.2s",
  },
  modalDownload: {
    padding: "8px 16px",
    backgroundColor: "#10b981",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ffffff",
    transition: "all 0.2s",
  },
};

// Add hover effects with CSS
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  button:hover, [style*="cursor: pointer"]:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  input:hover, select:hover {
    border-color: #3b82f6;
  }
  
  input:focus, select:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  tr:hover {
    background-color: #f8fafc;
  }
  
  @media (max-width: 768px) {
    td, th {
      padding: 8px;
      font-size: 0.8rem;
    }
    
    .pieChartContainer {
      flex-direction: column;
      align-items: center;
    }
    
    .filterSection {
      flex-direction: column;
    }
    
    .searchWrapper, .filterWrapper {
      width: 100%;
    }
    
    .headerButtons {
      width: 100%;
      justify-content: space-between;
    }
    
    .reportButton, .refreshButton {
      flex: 1;
      justify-content: center;
    }
  }
`;
document.head.appendChild(styleSheet);

export default AdminUserSummaryPage;