import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { fetchCurrentUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
        { withCredentials: true }
      );

      await fetchCurrentUser();
      window.location.href = "/";
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      if (err.response && err.response.data) {
        if (typeof err.response.data === "string") {
          setError(err.response.data);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Login failed");
        }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Left Side - Brand Section */}
        <div style={styles.brandSection}>
          <div style={styles.brandContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🎓</div>
              <span style={styles.logoText}>Zentrix Uni</span>
            </div>
            <h1 style={styles.brandTitle}>
              Welcome to
              <span style={styles.brandAccent}> Zentrix Campus</span>
            </h1>
            <p style={styles.brandDescription}>
              Your all-in-one platform for managing campus resources, 
              bookings, and notifications efficiently.
            </p>
            <div style={styles.brandFeatures}>
              <div style={styles.brandFeature}>
                <span>✓</span> Smart Resource Management
              </div>
              <div style={styles.brandFeature}>
                <span>✓</span> Real-time Bookings
              </div>
              <div style={styles.brandFeature}>
                <span>✓</span> Instant Notifications
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.formSection}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Sign In</h2>
              <p style={styles.formSubtitle}>
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>

              {error && <div style={styles.errorMessage}>{error}</div>}

              <button 
                type="submit" 
                style={styles.loginButton} 
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? (
                  <span style={styles.loadingSpinner}></span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>OR</span>
              <span style={styles.dividerLine}></span>
            </div>

            {/* Google Login Button */}
            <button 
              type="button" 
              style={styles.googleButton}
              onClick={handleGoogleLogin}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg style={styles.googleIcon} viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "20px",
  },

  container: {
    display: "flex",
    maxWidth: "1200px",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },

  // Left Side Styles - Matching AdminUserPage color scheme
  brandSection: {
    flex: 1,
    background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    padding: "48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  brandContent: {
    position: "relative",
    zIndex: 2,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "48px",
  },

  logoIcon: {
    fontSize: "60px",
  },

  logoText: {
    fontSize: "4rem",
    fontWeight: "700",
    background: "linear-gradient(135deg, #ffffff, #9ca3af)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },

  brandTitle: {
    fontSize: "2.2rem",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "20px",
    lineHeight: "1.3",
    letterSpacing: "-0.02em",
  },

  brandAccent: {
    display: "block",
    color: "#ffffff",
  },

  brandDescription: {
    fontSize: "1rem",
    color: "#9ca3af",
    lineHeight: "1.6",
    marginBottom: "32px",
  },

  brandFeatures: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  brandFeature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#d1d5db",
    fontSize: "0.9rem",
    "& span": {
      color: "#10b981",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
  },

  // Right Side Styles
  formSection: {
    flex: 1,
    padding: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  formContainer: {
    width: "100%",
    maxWidth: "400px",
  },

  formHeader: {
    marginBottom: "32px",
    textAlign: "center",
  },

  formTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },

  formSubtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    letterSpacing: "0.3px",
  },

  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    fontSize: "0.875rem",
    transition: "all 0.2s ease",
    outline: "none",
    fontFamily: "inherit",
    backgroundColor: "#f9fafb",
  },

  loginButton: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: "#e5e7eb",
  },

  dividerText: {
    color: "#9ca3af",
    fontSize: "12px",
    fontWeight: "500",
  },

  googleButton: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "0.875rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    color: "#374151",
  },

  googleIcon: {
    width: "20px",
    height: "20px",
  },

  errorMessage: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    color: "#dc2626",
    fontSize: "0.875rem",
    textAlign: "center",
  },

  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// Add global animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: #ffffff;
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
`;
document.head.appendChild(styleSheet);

export default LoginPage;