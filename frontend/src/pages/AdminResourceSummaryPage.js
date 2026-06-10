import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminResourceSummaryPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/resources", {
        withCredentials: true,
      });
      setResources(res.data || []);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
    setLoading(false);
  };

  const total = resources.length;
  const available = resources.filter((r) => r.status === "AVAILABLE").length;
  const booked = resources.filter((r) => r.status === "BOOKED").length;
  const maintenance = resources.filter((r) => r.status === "UNDER_MAINTENANCE").length;

  const typeCounts = {};
  resources.forEach((r) => {
    const type = r.resourceType || "OTHER";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const topCapacity = [...resources]
    .sort((a, b) => (b.capacity || 0) - (a.capacity || 0))
    .slice(0, 3);

  const maxTypeCount = Math.max(...Object.values(typeCounts), 1);

  if (loading) {
    return (
      <div style={styles.loading}>
        <h3>Loading Summary...</h3>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.heroCard}>
          <div>
            <div style={styles.smallLabel}>Admin Insights</div>
            <h1 style={styles.title}>📊 Resource Summary Dashboard</h1>
            <p style={styles.subtitle}>
              Quick operational overview of campus facilities and assets
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div style={styles.cardGrid}>
          <Card title="Total Resources" value={total} color="#6366f1" icon="📦" />
          <Card title="Available" value={available} color="#10b981" icon="🟢" />
          <Card title="Booked" value={booked} color="#ef4444" icon="🔴" />
          <Card title="Maintenance" value={maintenance} color="#f59e0b" icon="🟡" />
        </div>

        {/* MODERN 2-COLUMN SECTION */}
        <div style={styles.twoColumnGrid}>
          {/* Resource Types */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>📂 Resource Types</h2>
              <span style={styles.sectionHint}>Distribution</span>
            </div>

            <div style={styles.typeList}>
              {Object.entries(typeCounts).map(([type, count], index) => {
                const percentage = (count / maxTypeCount) * 100;
                const barColors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                return (
                  <div key={type} style={styles.typeItem}>
                    <div style={styles.typeTopRow}>
                      <span style={styles.typeName}>{type}</span>
                      <span style={styles.typeCount}>{count}</span>
                    </div>

                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${percentage}%`,
                          backgroundColor: barColors[index % barColors.length]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Capacity */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>🏆 Top Capacity Resources</h2>
              <span style={styles.sectionHint}>Top 3</span>
            </div>

            <div style={styles.topList}>
              {topCapacity.length > 0 ? (
                topCapacity.map((r, i) => (
                  <div key={r.resourceId} style={styles.topItem}>
                    <div style={styles.rankBadge}>{i + 1}</div>

                    <div style={styles.topInfo}>
                      <div style={styles.topName}>{r.resourceName}</div>
                      <div style={styles.topMeta}>
                        {r.resourceType} • {r.location}
                      </div>
                    </div>

                    <div style={styles.topCapacityValue}>
                      {r.capacity || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div style={styles.emptyText}>No resources available</div>
              )}
            </div>
          </div>
        </div>

        {/* ALL RESOURCES TABLE */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>📋 All Resources</h2>
            <span style={styles.sectionHint}>{resources.length} items</span>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Capacity</th>
                </tr>
              </thead>

              <tbody>
                {resources.map((r, index) => (
                  <tr
                    key={r.resourceId}
                    style={{
                      ...styles.tr,
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fbfdff"
                    }}
                  >
                    <td style={styles.tdName}>
                      <div style={styles.resourceName}>{r.resourceName}</div>
                    </td>

                    <td style={styles.td}>
                      <span style={styles.typeBadge}>{r.resourceType}</span>
                    </td>

                    <td style={styles.td}>
                      {getStatusBadge(r.status)}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.capacityBadge}>{r.capacity || "-"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {resources.length === 0 && (
              <div style={styles.emptyTable}>No resources available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value, color, icon }) => (
  <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
    <div style={styles.cardIcon}>{icon}</div>
    <h3 style={styles.cardTitle}>{title}</h3>
    <h1 style={styles.cardValue}>{value}</h1>
  </div>
);

const getStatusBadge = (status) => {
  if (status === "AVAILABLE") {
    return <span style={styles.green}>🟢 Available</span>;
  }
  if (status === "BOOKED") {
    return <span style={styles.red}>🔴 Booked</span>;
  }
  if (status === "UNDER_MAINTENANCE") {
    return <span style={styles.orange}>🟡 Maintenance</span>;
  }
  return <span style={styles.gray}>Unknown</span>;
};

const styles = {
  page: {
    padding: "40px 24px 60px",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    minHeight: "100vh"
  },

  wrapper: {
    maxWidth: "1280px",
    margin: "0 auto"
  },

  heroCard: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
    borderRadius: "24px",
    padding: "28px 30px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
    marginTop:"100px"
  },

  smallLabel: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px"
  },

  title: {
    margin: 0,
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a"
  },

  subtitle: {
    marginTop: "10px",
    color: "#64748b",
    fontSize: "16px"
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
    gap: "20px",
    marginBottom: "24px"
  },

  card: {
    background: "#fff",
    padding: "22px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb"
  },

  cardIcon: {
    fontSize: "30px",
    marginBottom: "10px"
  },

  cardTitle: {
    margin: 0,
    fontSize: "15px",
    color: "#64748b",
    fontWeight: "600"
  },

  cardValue: {
    marginTop: "10px",
    marginBottom: 0,
    fontSize: "34px",
    fontWeight: "800",
    color: "#111827"
  },

  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
    marginBottom: "24px"
  },

  sectionCard: {
    background: "#fff",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "10px"
  },

  sectionTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#0f172a",
    fontWeight: "700"
  },

  sectionHint: {
    fontSize: "13px",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: "600"
  },

  typeList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },

  typeItem: {
    width: "100%"
  },

  typeTopRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },

  typeName: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "14px"
  },

  typeCount: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600"
  },

  progressTrack: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.4s ease"
  },

  topList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  topItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb"
  },

  rankBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "999px",
    background: "#eef2ff",
    color: "#1e3a8a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800"
  },

  topInfo: {
    flex: 1
  },

  topName: {
    fontWeight: "700",
    color: "#111827",
    fontSize: "15px"
  },

  topMeta: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#64748b"
  },

  topCapacityValue: {
    fontWeight: "800",
    color: "#f59e0b",
    fontSize: "18px",
    minWidth: "40px",
    textAlign: "right"
  },

  tableWrap: {
    overflowX: "auto"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px"
  },

  tableHeadRow: {
    background: "#f8fafc"
  },

  th: {
    padding: "16px 18px",
    textAlign: "left",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "800",
    borderBottom: "1px solid #e5e7eb"
  },

  tr: {
    transition: "background-color 0.2s ease"
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #edf2f7",
    color: "#1e293b",
    fontSize: "15px"
  },

  tdName: {
    padding: "16px 18px",
    borderBottom: "1px solid #edf2f7"
  },

  resourceName: {
    fontWeight: "700",
    color: "#111827"
  },

  typeBadge: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block"
  },

  capacityBadge: {
    background: "#fff7ed",
    color: "#9a3412",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block"
  },

  green: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block"
  },

  red: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block"
  },

  orange: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block"
  },

  gray: {
    background: "#e5e7eb",
    color: "#374151",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
    display: "inline-block"
  },

  emptyTable: {
    textAlign: "center",
    padding: "30px",
    color: "#64748b",
    fontWeight: "600"
  },

  emptyText: {
    color: "#64748b",
    padding: "20px 0"
  },

  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f8fafc"
  }
};

export default AdminResourceSummaryPage;