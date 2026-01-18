import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "ratelimit:login",
});

export const signupLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:signup",
});

export const passwordResetLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "ratelimit:passwordreset",
});

export async function checkLoginLimit(identifier: string): Promise<boolean> {
  const { success } = await loginLimiter.limit(identifier);
  return success;
}

export async function checkSignupLimit(identifier: string): Promise<boolean> {
  const { success } = await signupLimiter.limit(identifier);
  return success;
}

export async function checkPasswordResetLimit(identifier: string): Promise<boolean> {
  const { success } = await passwordResetLimiter.limit(identifier);
  return success;
}
