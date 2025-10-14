import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Uncaught error in component tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto p-8 text-center text-red-200">
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm mb-4">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <pre className="text-xs whitespace-pre-wrap bg-gray-800 p-3 rounded">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
