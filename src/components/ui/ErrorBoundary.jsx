import React from 'react';

const STYLES = `
  .tg-error-boundary {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0e;
    font-family: 'Poppins', sans-serif;
    padding: 2rem;
    box-sizing: border-box;
  }
  .tg-error-card {
    max-width: 480px;
    width: 100%;
    text-align: center;
  }
  .tg-error-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    display: block;
  }
  .tg-error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 0.75rem;
  }
  .tg-error-desc {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.7;
    margin: 0 0 2rem;
  }
  .tg-error-reload {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.08);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.15);
    font-family: 'Poppins', sans-serif;
    font-size: 0.88rem;
    font-weight: 500;
    padding: 10px 24px;
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
    text-decoration: none;
  }
  .tg-error-reload:hover {
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.28);
  }
`;

/**
 * ErrorBoundary
 *
 * Catches any unhandled render error thrown by a child component
 * and displays a clean fallback instead of a blank screen.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log a sanitised summary — no sensitive internals exposed
    console.error('[VIT Stellar] Unexpected render error:', error?.message ?? 'Unknown error');
    if (process.env.NODE_ENV !== 'production') {
      console.error(info?.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <style>{STYLES}</style>
          <div className="tg-error-boundary">
            <div className="tg-error-card">
              <span className="tg-error-icon" aria-hidden="true">🌌</span>
              <h1 className="tg-error-title">Something went wrong</h1>
              <p className="tg-error-desc">
                An unexpected error occurred. Please try refreshing the page.
                If the problem persists, contact us at{' '}
                <a
                  href="mailto:stellar@vit.ac.in"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  stellar@vit.ac.in
                </a>
              </p>
              <button
                className="tg-error-reload"
                onClick={() => window.location.reload()}
              >
                ↺ Reload page
              </button>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
