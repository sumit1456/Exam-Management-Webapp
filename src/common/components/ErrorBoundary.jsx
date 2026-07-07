import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconWrap}>
              <AlertTriangle size={40} color="#F59E0B" />
            </div>
            <h1 style={styles.title}>Something went wrong</h1>
            <p style={styles.subtitle}>
              An unexpected error occurred. This has been logged for investigation.
            </p>
            {this.state.error && (
              <div style={styles.errorBox}>
                <code style={styles.errorText}>
                  {this.state.error.message || 'Unknown error'}
                </code>
              </div>
            )}
            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.retryBtn}>
                <RefreshCw size={14} /> Try Again
              </button>
              <button onClick={this.handleGoHome} style={styles.homeBtn}>
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: 20,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  card: {
    maxWidth: 440,
    width: '100%',
    background: '#fff',
    borderRadius: 16,
    padding: '40px 32px',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    background: '#FFFBEB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: '#1E293B',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    margin: '0 0 20px',
    lineHeight: 1.5,
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 24,
    textAlign: 'left',
  },
  errorText: {
    fontSize: 11,
    color: '#991B1B',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: 10,
  },
  retryBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 0',
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    background: '#4361EE',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  homeBtn: {
    flex: 1,
    padding: '10px 0',
    fontSize: 12,
    fontWeight: 700,
    color: '#64748B',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: 8,
    cursor: 'pointer',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
};

export default ErrorBoundary;
