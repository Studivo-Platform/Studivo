const rateLimit = require('express-rate-limit');
const { env }   = require('../config/env');

// General API rate limiter — applied globally in app.js
const globalLimiter = rateLimit({
    windowMs:        15 * 60 * 1000, // 15 minutes
    max:             3000,           // 3000 requests per window (generous for SPA)
    standardHeaders: true,           // Returns rate limit info in headers
    legacyHeaders:   false,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.',
    },
});

// Limiter for AI-powered endpoints
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      100,
    message: {
        success: false,
        message: 'AI request limit reached. Please wait before making another request.',
    },
});

// Auth endpoints limiter (prevent brute force while allowing smooth OAuth)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max:      300,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.',
    },
});

module.exports = {
    globalLimiter,
    aiLimiter,
    authLimiter,
};