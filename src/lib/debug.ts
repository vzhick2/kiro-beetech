/**
 * Debug Logger Utility for KIRO Inventory Management
 * Enhanced debugging and error tracking
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class DebugLogger {
  private isDev = process.env.NODE_ENV === 'development';
  private debugEnabled = process.env.KIRO_DEBUG === 'true';
  private logLevel = process.env.KIRO_LOG_LEVEL || 'info';

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [KIRO]`;
    
    if (data) {
      return `${prefix} ${message}\n${JSON.stringify(data, null, 2)}`;
    }
    return `${prefix} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDev && !this.debugEnabled) return level === 'error';
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  debug(message: string, data?: unknown) {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: unknown) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: unknown) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: Error | unknown) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, error));
      
      // Also log the stack trace if available
      if (error && error instanceof Error && error.stack) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  // Server-side error handler
  serverError(message: string, error: Error, context?: unknown) {
    this.error(`[SERVER ERROR] ${message}`, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  // Client-side error handler
  clientError(message: string, error: Error, context?: unknown) {
    this.error(`[CLIENT ERROR] ${message}`, {
      error: error.message,
      stack: error.stack,
      context,
      url: typeof window !== 'undefined' ? window.location.href : 'N/A',
      timestamp: new Date().toISOString(),
    });
  }

  // Performance monitoring
  performance(label: string, duration: number, context?: unknown) {
    this.info(`[PERFORMANCE] ${label}: ${duration}ms`, context);
  }

  // Component lifecycle debugging
  componentLifecycle(component: string, phase: string, props?: unknown) {
    this.debug(`[COMPONENT] ${component} - ${phase}`, props);
  }

  // API request debugging
  apiRequest(method: string, url: string, data?: unknown) {
    this.debug(`[API REQUEST] ${method} ${url}`, data);
  }

  // API response debugging
  apiResponse(method: string, url: string, status: number, data?: unknown) {
    this.debug(`[API RESPONSE] ${method} ${url} - ${status}`, data);
  }
}

export const logger = new DebugLogger();

// Global error handlers for unhandled errors
if (typeof window !== 'undefined') {
  // Client-side error handler
  window.addEventListener('error', (event) => {
    logger.clientError('Unhandled error', event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    logger.clientError('Unhandled promise rejection', event.reason);
  });
} else if (typeof process !== 'undefined' && process.on) {
  // Server-side error handler - only if not in Edge Runtime
  try {
    process.on('uncaughtException', (error) => {
      logger.serverError('Uncaught exception', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.serverError('Unhandled promise rejection', reason as Error, { promise });
    });
  } catch {
    // Edge Runtime doesn't support process.on, silently ignore
  }
}

export default logger;
