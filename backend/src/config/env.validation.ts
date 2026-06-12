import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().default('api'),
  CORS_ORIGINS: z.string().default(''),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().int().positive().default(30),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  MEILI_HOST: z.string().url().default('http://localhost:7700'),
  MEILI_MASTER_KEY: z.string().optional().default(''),
  QDRANT_URL: z.string().url().default('http://localhost:6333'),
  QDRANT_API_KEY: z.string().optional().default(''),
  QDRANT_COLLECTION: z.string().default('farmjumnoy_knowledge'),
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default('ap-southeast-1'),
  S3_BUCKET: z.string().default('farmjumnoy-dev'),
  S3_ACCESS_KEY: z.string().optional().default(''),
  S3_SECRET_KEY: z.string().optional().default(''),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(false),
  CDN_BASE_URL: z.string().optional().default(''),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4.1-mini'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  ANTHROPIC_API_KEY: z.string().optional().default(''),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional().default(''),
  AI_PROVIDER: z.enum(['openai', 'anthropic', 'gemini']).default('openai'),
  AI_MAX_CONTEXT_CHUNKS: z.coerce.number().int().positive().default(6),
  AI_LOW_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.55),
  OTP_DEV_MODE: z.coerce.boolean().default(false),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().default(10)
});

export type Env = z.infer<typeof schema>;

export function validateEnv(config: Record<string, unknown>) {
  const parsed = schema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }
  return parsed.data;
}
