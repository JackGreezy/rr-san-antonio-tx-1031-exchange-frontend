import site from '@/content/site.json'

export function getBrand() {
  return {
    company: site.company,
    phone: site.phone,
    email: site.email,
    address: site.address,
    website: process.env.NEXT_PUBLIC_SITE_URL || `https://www.1031exchangeofsanantonio.com`,
  }
}