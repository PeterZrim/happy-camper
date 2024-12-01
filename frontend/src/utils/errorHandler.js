// Error types
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Error messages
export const ErrorMessages = {
  [ErrorTypes.NETWORK_ERROR]: 'Network error. Please check your internet connection.',
  [ErrorTypes.AUTH_ERROR]: 'Authentication error. Please log in again.',
  [ErrorTypes.VALIDATION_ERROR]: 'Invalid input. Please check your data.',
  [ErrorTypes.SERVER_ERROR]: 'Server error. Please try again later.',
  [ErrorTypes.NOT_FOUND]: 'Resource not found.',
  [ErrorTypes.UNKNOWN_ERROR]: 'An unknown error occurred.',
};

// Error handler class
export class APIError extends Error {
  constructor(type, message, originalError = null) {
    super(message || ErrorMessages[type]);
    this.type = type;
    this.originalError = originalError;
  }
}

// Handle API errors
export const handleAPIError = (error) => {
  if (!error.response) {
    return new APIError(ErrorTypes.NETWORK_ERROR, null, error);
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return new APIError(ErrorTypes.VALIDATION_ERROR, data.message || null, error);
    case 401:
    case 403:
      return new APIError(ErrorTypes.AUTH_ERROR, data.message || null, error);
    case 404:
      return new APIError(ErrorTypes.NOT_FOUND, data.message || null, error);
    case 500:
      return new APIError(ErrorTypes.SERVER_ERROR, data.message || null, error);
    default:
      return new APIError(ErrorTypes.UNKNOWN_ERROR, data.message || null, error);
  }
};

// Error boundary for React components
export const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
      return { error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.error) {
        return (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <p>{this.state.error.message}</p>
            <button onClick={() => this.setState({ error: null })}>Try again</button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};
