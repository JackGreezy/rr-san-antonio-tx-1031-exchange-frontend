export async function verifyTurnstile(token: string, clientIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY

  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY environment variable is not set')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(clientIp && { remoteip: clientIp }),
      }),
    })

    if (!response.ok) {
      console.error('Turnstile verification request failed:', response.status)
      return false
    }

    const data = await response.json()

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes'])
      return false
    }

    return true
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}