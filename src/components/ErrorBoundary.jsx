import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('App crashed:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', color: '#a8e6cf', background: '#0d0a08', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ color: '#ffd700', fontSize: '24px', marginBottom: '20px' }}>Something broke 😤</h1>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px', color: '#ff6b6b' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px', color: '#a8e6cf', marginTop: '20px', opacity: 0.7 }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px 20px', background: '#c9a227', color: '#0d0a08', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
