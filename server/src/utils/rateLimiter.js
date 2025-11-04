import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter for login attempts
export const loginLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 600, // 10 minutes
  blockDuration: 600, // Block for 10 minutes
});

// Rate limiter for registration
export const registerLimiter = new RateLimiterMemory({
  points: 3,
  duration: 3600, // 1 hour
  blockDuration: 3600,
});

// Rate limiter for password reset
export const passwordResetLimiter = new RateLimiterMemory({
  points: 3,
  duration: 3600, // 1 hour
  blockDuration: 3600,
});

// Rate limiter for email verification requests
export const emailVerificationLimiter = new RateLimiterMemory({
  points: 5,
  duration: 3600, // 1 hour
  blockDuration: 3600,
});

// Middleware factory for rate limiting
export const rateLimitMiddleware = (
  limiter,
  message = 'Too many requests, please try again later'
) => {
  return async (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;

    try {
      await limiter.consume(key);
      next();
    } catch (error) {
      const retryAfter = Math.round(error.msBeforeNext / 1000) || 600;
      res.set('Retry-After', String(retryAfter));

      return res.status(429).json({
        success: false,
        message,
        retryAfter,
      });
    }
  };
};
