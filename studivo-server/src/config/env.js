require('dotenv').config();
const { z } = require('zod');

const envSchema = z.object({
  // Server
  PORT:       z.string().default('5000'),
  NODE_ENV:   z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().url({ message: 'CLIENT_URL must be a valid URL' }),

  // MongoDB
  MONGODB_URI: z.string().min(1, { message: 'MONGODB_URI is required' }),

  // Redis
  REDIS_URL: z.string().min(1, { message: 'REDIS_URL is required' }),

  // JWT
  JWT_SECRET:         z.string().min(32, { message: 'JWT_SECRET must be at least 32 chars' }),
  JWT_REFRESH_SECRET: z.string().min(32, { message: 'JWT_REFRESH_SECRET must be at least 32 chars' }),
  JWT_ACCESS_EXPIRES:  z.string().default('30m'),
  JWT_REFRESH_EXPIRES: z.string().default('7d'),

  // OpenAI
  // OPENAI_API_KEY: z.string().startsWith('sk-', { message: 'OPENAI_API_KEY must start with sk-' }),
  // OPENAI_MODEL:   z.string().default('gpt-4o-mini'),
  // AI_CACHE_TTL:   z.string().default('86400').transform(Number),

  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL:   z.string().default('gemini-3.5-flash'),
  AI_CACHE_TTL:   z.string().default('86400').transform(Number),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional().default('demo'),
  CLOUDINARY_API_KEY:    z.string().optional().default('123456789'),
  CLOUDINARY_API_SECRET: z.string().optional().default('secret'),

  // SendGrid
  SENDGRID_API_KEY:    z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email().default('noreply@studivo.com'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX:       z.string().default('100').transform(Number),
  AI_RATE_LIMIT_MAX:    z.string().default('10').transform(Number),

  // Google OAuth
  GOOGLE_CLIENT_ID:     z.string().optional().default('mock_client_id'),
  GOOGLE_CLIENT_SECRET: z.string().optional().default('mock_client_secret'),
  GOOGLE_CALLBACK_URL:  z.string().url().default('http://localhost:5000/api/auth/google/callback'),

  // Amazon
  AMAZON_PARTNER_TAG: z.string().default('studivo0b-21'),
  AMAZON_HOST:        z.string().default('www.amazon.eg'),

  // Noon
  NOON_AFFILIATE_ID: z.string().optional().default('mock_noon_id'),
  NOON_BASE_URL:     z.string().default('https://www.noon.com'),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Missing or invalid environment variables:');

  console.error('─────────────────────────────────────────────');
  const issues = parsed.error?.issues || parsed.error?.errors || [];
  issues.forEach((err) => {
    console.error(`   • ${err.path[0]}: ${err.message}`);
  });
  console.error('─────────────────────────────────────────────');
  
  console.error('  Check your .env file and add the missing variables.\n');
  process.exit(1);
}

module.exports = { env: parsed.data };