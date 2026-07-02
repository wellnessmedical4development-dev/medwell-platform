import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d4af37', fontSize: '1.5rem' }}>Something went wrong</h1>
          <pre style={{ color: '#999', fontSize: '0.85rem', marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem', padding: '0.75rem 2rem', borderRadius: '999px',
              border: 'none', background: '#d4af37', color: '#1a1a1a',
              fontWeight: 'bold', cursor: 'pointer',
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
