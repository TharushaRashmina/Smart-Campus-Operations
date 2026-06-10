import React, { useEffect, useState } from "react";
import { getAllResources, searchResources } from "../services/resourceService";

const ResourceCataloguePage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minCapacity: "",
    status: ""
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await getAllResources();
      setResources(res.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const cleanedFilters = {
        ...(filters.type && { type: filters.type }),
        ...(filters.location && { location: filters.location }),
        ...(filters.minCapacity && { minCapacity: filters.minCapacity }),
        ...(filters.status && { status: filters.status })
      };

      const res = await searchResources(cleanedFilters);
      setResources(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFilters({
      type: "",
      location: "",
      minCapacity: "",
      status: ""
    });
    fetchResources();
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return {
          backgroundColor: "#dcfce7",
          color: "#166534",
          padding: "7px 14px",
          borderRadius: "999px",
          fontWeight: "600",
          fontSize: "12px",
          display: "inline-block"
        };
      case "BOOKED":
        return {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          padding: "7px 14px",
          borderRadius: "999px",
          fontWeight: "600",
          fontSize: "12px",
          display: "inline-block"
        };
      case "UNDER_MAINTENANCE":
        return {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          padding: "7px 14px",
          borderRadius: "999px",
          fontWeight: "600",
          fontSize: "12px",
          display: "inline-block"
        };
      default:
        return {
          backgroundColor: "#e5e7eb",
          color: "#374151",
          padding: "7px 14px",
          borderRadius: "999px",
          fontWeight: "600",
          fontSize: "12px",
          display: "inline-block"
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "🟢 Available";
      case "BOOKED":
        return "🔴 Booked";
      case "UNDER_MAINTENANCE":
        return "🟡 Under Maintenance";
      default:
        return status;
    }
  };

  const getTypeBadgeStyle = (type) => {
    return {
      backgroundColor: "#eff6ff",
      color: "#1d4ed8",
      padding: "6px 12px",
      borderRadius: "999px",
      fontWeight: "600",
      fontSize: "12px",
      display: "inline-block"
    };
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.heroCard}>
          <div>
            <div style={styles.smallLabel}>Facilities & Assets</div>
            <h1 style={styles.pageTitle}>Resource Catalogue</h1>
            <p style={styles.pageSubtitle}>
              Browse lecture halls, labs, rooms, and equipment with smart filtering and clear availability status.
            </p>
          </div>

          <div style={styles.heroStats}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{resources.length}</div>
              <div style={styles.statLabel}>Resources Found</div>
            </div>
          </div>
        </div>

        {/* Filter Card */}
        <div style={styles.filterCard}>
          <div style={styles.filterHeader}>
            <div>
              <h3 style={styles.filterTitle}>Search & Filter Resources</h3>
              <p style={styles.filterSubtitle}>Quickly find the right campus facility</p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              style={styles.toggleBtn}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {showFilters && (
            <>
              <div style={styles.filterGrid}>
                <input
                  name="type"
                  placeholder="Search by type"
                  value={filters.type}
                  onChange={handleChange}
                  style={styles.input}
                />

                <input
                  name="location"
                  placeholder="Search by location"
                  value={filters.location}
                  onChange={handleChange}
                  style={styles.input}
                />

                <input
                  name="minCapacity"
                  placeholder="Minimum capacity"
                  type="number"
                  value={filters.minCapacity}
                  onChange={handleChange}
                  style={styles.input}
                />

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">All Status</option>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="BOOKED">BOOKED</option>
                  <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                </select>
              </div>

              <div style={styles.buttonRow}>
                <button onClick={handleSearch} style={styles.searchBtn}>
                  Search
                </button>

                <button onClick={handleReset} style={styles.resetBtn}>
                  Reset
                </button>
              </div>
            </>
          )}
        </div>

        {/* Summary */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryText}>
            Showing <strong>{resources.length}</strong> resource{resources.length !== 1 ? "s" : ""}
          </div>

          {loading && (
            <div style={styles.loadingText}>Loading resources...</div>
          )}
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>
          {resources.length > 0 ? (
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Capacity</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {resources.map((resource, index) => (
                    <tr
                      key={resource.resourceId}
                      style={{
                        ...styles.tr,
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#fbfdff"
                      }}
                    >
                      <td style={styles.tdId}>
                        <span style={styles.idBadge}>{resource.resourceId}</span>
                      </td>

                      <td style={styles.tdName}>
                        <div style={styles.resourceName}>{resource.resourceName}</div>
                      </td>

                      <td style={styles.td}>
                        <span style={getTypeBadgeStyle(resource.resourceType)}>
                          {resource.resourceType}
                        </span>
                      </td>

                      <td style={styles.td}>{resource.location}</td>

                      <td style={styles.td}>
                        <span style={styles.capacityText}>{resource.capacity}</span>
                      </td>

                      <td style={styles.td}>
                        <span style={getStatusBadgeStyle(resource.status)}>
                          {getStatusLabel(resource.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📭</div>
                <h3 style={styles.emptyTitle}>No resources found</h3>
                <p style={styles.emptyText}>
                  Try changing your filters or add more resource data from the admin panel.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    padding: "32px 20px 60px"
  },

  wrapper: {
    maxWidth: "1280px",
    margin: "0px auto"
  },

  heroCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "24px",
    padding: "28px 30px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
    marginTop:"80px",
    border: "1px solid #e5e7eb"
  },

  smallLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px"
  },

  pageTitle: {
    margin: 0,
    fontSize: "44px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1.1"
  },

  pageSubtitle: {
    marginTop: "12px",
    marginBottom: 0,
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.6",
    maxWidth: "760px"
  },

  heroStats: {
    display: "flex",
    gap: "16px"
  },

  statCard: {
    minWidth: "160px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "18px 22px",
    textAlign: "center",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)"
  },

  statNumber: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827"
  },

  statLabel: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600"
  },

  filterCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    marginBottom: "22px",
    border: "1px solid #e5e7eb"
  },

  filterHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "18px"
  },

  filterTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#0f172a",
    fontWeight: "700"
  },

  filterSubtitle: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "14px"
  },

  toggleBtn: {
    background: "#eef2ff",
    color: "#1e3a8a",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer"
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "18px"
  },

  input: {
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#f8fafc",
    color: "#0f172a"
  },

  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },

  searchBtn: {
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)"
  },

  resetBtn: {
    background: "#e2e8f0",
    color: "#1e293b",
    border: "none",
    padding: "12px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer"
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px"
  },

  summaryText: {
    color: "#334155",
    fontSize: "15px",
    fontWeight: "500"
  },

  loadingText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "14px"
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
    border: "1px solid #e5e7eb"
  },

  tableWrap: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "980px"
  },

  tableHeadRow: {
    background: "#f8fafc"
  },

  th: {
    padding: "18px 20px",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "800",
    letterSpacing: "0.02em"
  },

  tr: {
    transition: "background-color 0.2s ease"
  },

  td: {
    padding: "18px 20px",
    borderBottom: "1px solid #edf2f7",
    color: "#1e293b",
    fontSize: "15px",
    verticalAlign: "middle"
  },

  tdId: {
    padding: "18px 20px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle"
  },

  tdName: {
    padding: "18px 20px",
    borderBottom: "1px solid #edf2f7",
    verticalAlign: "middle"
  },

  idBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#1e3a8a",
    fontWeight: "700",
    fontSize: "14px"
  },

  resourceName: {
    fontWeight: "700",
    color: "#111827",
    fontSize: "16px"
  },

  capacityText: {
    fontWeight: "700",
    color: "#0f172a"
  },

  emptyState: {
    textAlign: "center",
    padding: "70px 20px"
  },

  emptyIcon: {
    fontSize: "52px",
    marginBottom: "14px"
  },

  emptyTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#1e293b",
    fontWeight: "700"
  },

  emptyText: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "15px"
  }
};

export default ResourceCataloguePage;