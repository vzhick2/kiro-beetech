/**
 * Environment Configuration
 * Handles loading and validation of environment variables
 */

import { z } from 'zod';

/**
 * Environment variable schema with validation rules
 */
const envSchema = z.object({
  // Business Rules - All optional with defaults
  NEXT_PUBLIC_DEFAULT_LEAD_TIME_DAYS: z.string().optional().transform(val => val ? Number(val) : 7),
  NEXT_PUBLIC_LOW_STOCK_INGREDIENT: z.string().optional().transform(val => val ? Number(val) : 10),
  NEXT_PUBLIC_LOW_STOCK_PACKAGING: z.string().optional().transform(val => val ? Number(val) : 5),
  NEXT_PUBLIC_LOW_STOCK_PRODUCT: z.string().optional().transform(val => val ? Number(val) : 3),
  
  // Cycle Count Alerting
  NEXT_PUBLIC_CYCLE_COUNT_MAX_DAYS_SCORE: z.string().optional().transform(val => val ? Number(val) : 10),
  NEXT_PUBLIC_CYCLE_COUNT_DAYS_DIVISOR: z.string().optional().transform(val => val ? Number(val) : 30),
  
  // Pagination
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z.string().optional().transform(val => val ? Number(val) : 25),
  NEXT_PUBLIC_DASHBOARD_RECENT_ACTIVITY_LIMIT: z.string().optional().transform(val => val ? Number(val) : 10),
  NEXT_PUBLIC_DASHBOARD_CYCLE_COUNT_ALERTS_LIMIT: z.string().optional().transform(val => val ? Number(val) : 5),
  
  // App Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
  NEXT_PUBLIC_APP_ENV: z.string().optional().default('development'),
});

/**
 * Validate and parse environment variables
 * Throws descriptive error if validation fails
 */
let parsedEnv: z.infer<typeof envSchema>;

try {
  parsedEnv = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Invalid environment configuration:');
  if (error instanceof z.ZodError) {
    error.issues.forEach((err: z.ZodIssue) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
  }
  console.error('\n📝 Check your .env.local file and ensure all required environment variables are set.');
  process.exit(1);
}

/**
 * Validated and processed environment configuration
 * All values are type-safe with proper defaults
 */
export const env = {
  // Business Rules
  DEFAULT_LEAD_TIME_DAYS: parsedEnv.NEXT_PUBLIC_DEFAULT_LEAD_TIME_DAYS,
  LOW_STOCK_INGREDIENT: parsedEnv.NEXT_PUBLIC_LOW_STOCK_INGREDIENT,
  LOW_STOCK_PACKAGING: parsedEnv.NEXT_PUBLIC_LOW_STOCK_PACKAGING,
  LOW_STOCK_PRODUCT: parsedEnv.NEXT_PUBLIC_LOW_STOCK_PRODUCT,
  
  // Cycle Count Alerting
  CYCLE_COUNT_MAX_DAYS_SCORE: parsedEnv.NEXT_PUBLIC_CYCLE_COUNT_MAX_DAYS_SCORE,
  CYCLE_COUNT_DAYS_DIVISOR: parsedEnv.NEXT_PUBLIC_CYCLE_COUNT_DAYS_DIVISOR,
  
  // Pagination
  DEFAULT_PAGE_SIZE: parsedEnv.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
  DASHBOARD_RECENT_ACTIVITY_LIMIT: parsedEnv.NEXT_PUBLIC_DASHBOARD_RECENT_ACTIVITY_LIMIT,
  DASHBOARD_CYCLE_COUNT_ALERTS_LIMIT: parsedEnv.NEXT_PUBLIC_DASHBOARD_CYCLE_COUNT_ALERTS_LIMIT,
  
  // App Environment
  NODE_ENV: parsedEnv.NODE_ENV,
  APP_ENV: parsedEnv.NEXT_PUBLIC_APP_ENV,
  IS_DEVELOPMENT: parsedEnv.NODE_ENV === 'development',
  IS_PRODUCTION: parsedEnv.NODE_ENV === 'production',
} as const;

export type EnvConfig = typeof env;