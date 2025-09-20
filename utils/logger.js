// SIH/hospital/utils/logger.js

/**
 * Centralized logger utility
 * Ensures performance, userAction, error, and info logs never crash the app
 */

const isDev = __DEV__; // React Native sets __DEV__ flag automatically

const log = (level, ...args) => {
  if (isDev) {
    // eslint-disable-next-line no-console
    console[level](...args);
  } else {
    // TODO: send logs to backend service (e.g., Sentry, Firebase, custom API)
  }
};

const logger = {
  performance: (...args) => log('log', '[PERFORMANCE]', ...args),
  userAction: (...args) => log('log', '[USER ACTION]', ...args),
  error: (...args) => log('error', '[ERROR]', ...args),
  warn: (...args) => log('warn', '[WARN]', ...args),
  info: (...args) => log('info', '[INFO]', ...args),
  debug: (...args) => log('log', '[DEBUG]', ...args),
};

export default logger;
