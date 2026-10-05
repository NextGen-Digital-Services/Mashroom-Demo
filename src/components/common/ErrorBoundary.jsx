import React from 'react';

// A render failure anywhere (bad payload, stale cache) should show a
// recoverable screen instead of blanking the whole SPA — the admin shell
// has no other safety net.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '480px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary btn-sm" onClick={this.handleReset}>
              Try Again
            </button>
            <button className="btn btn-primary btn-sm" onClick={this.handleReload}>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
