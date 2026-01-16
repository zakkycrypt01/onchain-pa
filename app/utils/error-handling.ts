/**
 * Terminal Error Handling & Recovery
 */

export interface TerminalError {
  code: string;
  message: string;
  suggestion: string;
  recoverable: boolean;
  retryable: boolean;
}

const ERROR_CATALOG: Record<string, TerminalError> = {
  COMMAND_NOT_FOUND: {
    code: "COMMAND_NOT_FOUND",
    message: "Command not recognized",
    suggestion: "Type 'help' to see available commands",
    recoverable: true,
    retryable: false,
  },
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message: "Network connection failed",
    suggestion: "Check your internet connection and try again",
    recoverable: true,
    retryable: true,
  },
  TIMEOUT: {
    code: "TIMEOUT",
    message: "Command execution timed out",
    suggestion: "The operation took too long. Try with a simpler command",
    recoverable: true,
    retryable: true,
  },
  INVALID_INPUT: {
    code: "INVALID_INPUT",
    message: "Invalid command format",
    suggestion: "Check the command syntax and try again",
    recoverable: true,
    retryable: false,
  },
  RATE_LIMITED: {
    code: "RATE_LIMITED",
    message: "Rate limit exceeded",
    suggestion: "Wait a moment before trying again",
    recoverable: true,
    retryable: true,
  },
  AUTH_FAILED: {
    code: "AUTH_FAILED",
    message: "Authentication failed",
    suggestion: "Please check your credentials and try again",
    recoverable: true,
    retryable: false,
  },
};

export function getError(code: string): TerminalError {
  return (
    ERROR_CATALOG[code] || {
      code,
      message: "An unknown error occurred",
      suggestion: "Please try again or contact support",
      recoverable: false,
      retryable: false,
    }
  );
}

export function formatErrorMessage(error: TerminalError): string {
  return `
❌ ${error.message}
💡 Suggestion: ${error.suggestion}
  `;
}

export function handleError(error: any): TerminalError {
  if (error.code) {
    return getError(error.code);
  }

  if (error.message.includes("Network")) {
    return getError("NETWORK_ERROR");
  }

  if (error.message.includes("timeout")) {
    return getError("TIMEOUT");
  }

  if (error.message.includes("quota") || error.statusCode === 429) {
    return getError("RATE_LIMITED");
  }

  return {
    code: "UNKNOWN_ERROR",
    message: error.message || "An unknown error occurred",
    suggestion: "Please try again or contact support",
    recoverable: false,
    retryable: false,
  };
}

export function shouldRetry(error: TerminalError, attemptCount: number): boolean {
  return error.retryable && attemptCount < 3;
}

export function getRetryDelay(attemptCount: number): number {
  return Math.pow(2, attemptCount) * 1000; // Exponential backoff
}
