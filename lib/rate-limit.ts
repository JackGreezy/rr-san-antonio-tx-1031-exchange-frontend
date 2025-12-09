interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map()
  private readonly maxAttempts: number
  private readonly windowMs: number

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
  }

  isAllowed(identifier: string | { headers: { get: (key: string) => string | null } }): RateLimitResult {
    const key = this.getKey(identifier)

    const now = Date.now()
    const record = this.attempts.get(key)

    if (!record || now > record.resetTime) {
      // First attempt or window has expired
      const resetTime = now + this.windowMs
      this.attempts.set(key, { count: 1, resetTime })
      return { allowed: true, remaining: this.maxAttempts - 1, resetTime }
    }

    if (record.count >= this.maxAttempts) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime }
    }

    record.count++
    return { allowed: true, remaining: this.maxAttempts - record.count, resetTime: record.resetTime }
  }

  private getKey(identifier: string | { headers: { get: (key: string) => string | null } }): string {
    if (typeof identifier === 'string') {
      return identifier
    }

    // Extract IP address from request headers
    const xForwardedFor = identifier.headers.get('x-forwarded-for')
    const xRealIp = identifier.headers.get('x-real-ip')
    const xClientIp = identifier.headers.get('x-client-ip')
    const cfConnectingIp = identifier.headers.get('cf-connecting-ip')

    const ip = xForwardedFor?.split(',')[0]?.trim() ||
               xRealIp ||
               xClientIp ||
               cfConnectingIp ||
               'unknown'

    return ip
  }
}

export const apiRateLimiter = new RateLimiter()