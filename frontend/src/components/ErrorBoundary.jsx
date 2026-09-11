import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-center max-w-2xl mx-auto mt-10">
          <h3 className="text-lg font-medium text-red-400 mb-2">Rendering Error</h3>
          <p className="text-red-300/80 mb-4 text-sm">{this.state.error?.message || 'An unexpected rendering issue occurred.'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors border border-slate-700"
          >
            Reset View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
