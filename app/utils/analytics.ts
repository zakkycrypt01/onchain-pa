/**
 * Analytics & Logging
 * Track user interactions and terminal activities
 */

export interface LogEntry {
  timestamp: Date;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  context?: Record<string, any>;
}

export interface AnalyticsEvent {
  timestamp: Date;
  eventType: string;
  commandName?: string;
  success: boolean;
  duration?: number;
  errorCode?: string;
}

class TerminalLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 500;

  log(message: string, level: LogEntry["level"] = "info", context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console[level === "error" ? "error" : level === "warning" ? "warn" : "log"](
        `[${entry.timestamp.toISOString()}] ${message}`,
        context
      );
    }
  }

  info(message: string, context?: Record<string, any>) {
    this.log(message, "info", context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(message, "warning", context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log(message, "error", context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(message, "debug", context);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

class TerminalAnalytics {
  private events: AnalyticsEvent[] = [];
  private maxEvents = 1000;

  trackCommand(
    commandName: string,
    success: boolean,
    duration: number,
    errorCode?: string
  ) {
    const event: AnalyticsEvent = {
      timestamp: new Date(),
      eventType: "command_execution",
      commandName,
      success,
      duration,
      errorCode,
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  trackEvent(eventType: string, data?: Record<string, any>) {
    const event: AnalyticsEvent = {
      timestamp: new Date(),
      eventType,
      success: true,
      ...data,
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  getStatistics() {
    const totalCommands = this.events.filter((e) => e.eventType === "command_execution")
      .length;
    const successfulCommands = this.events.filter(
      (e) => e.eventType === "command_execution" && e.success
    ).length;
    const failedCommands = totalCommands - successfulCommands;
    const averageDuration =
      this.events.reduce((sum, e) => sum + (e.duration || 0), 0) / totalCommands || 0;

    return {
      totalCommands,
      successfulCommands,
      failedCommands,
      successRate: totalCommands > 0 ? (successfulCommands / totalCommands) * 100 : 0,
      averageDuration: Math.round(averageDuration),
    };
  }

  getMostUsedCommands() {
    const commandCounts: Record<string, number> = {};
    this.events.forEach((e) => {
      if (e.commandName) {
        commandCounts[e.commandName] = (commandCounts[e.commandName] || 0) + 1;
      }
    });

    return Object.entries(commandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([command, count]) => ({ command, count }));
  }

  getErrorStats() {
    const errorCounts: Record<string, number> = {};
    this.events.forEach((e) => {
      if (e.errorCode) {
        errorCounts[e.errorCode] = (errorCounts[e.errorCode] || 0) + 1;
      }
    });

    return Object.entries(errorCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([error, count]) => ({ error, count }));
  }

  clearEvents() {
    this.events = [];
  }

  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

export const logger = new TerminalLogger();
export const analytics = new TerminalAnalytics();
