import Link from "next/link";
import site from "@/content/site.json";
import { servicesData, locationsData } from "@/data";

const tools = [
  { name: "Boot Calculator", href: "/tools/boot-calculator" },
  { name: "Exchange Cost Estimator", href: "/tools/exchange-cost-estimator" },
  { name: "Identification Rules Checker", href: "/tools/identification-rules-checker" },
];

export default function Footer() {
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

  return (
    <footer className="border-t border-outline bg-panel mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-heading">
              {site.company}
            </h3>
            <p className="text-ink mb-2">{site.address}</p>
            <p className="text-ink mb-2">
              <a href={`tel:${site.phoneDigits}`} className="hover:underline">
                {site.phone}
              </a>
            </p>
            <p className="text-ink mb-2">
              <a href={`mailto:${site.email}`} className="hover:underline whitespace-nowrap">
                {site.email}
              </a>
            </p>
            <p className="text-ink text-sm">24/7 Hours</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Services</h3>
            <ul className="space-y-2 text-ink text-sm">
              <li>
                <Link href="/services" className="hover:underline">
                  All Services
                </Link>
              </li>
              {servicesData.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link href={service.route} className="hover:underline">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Locations</h3>
            <ul className="space-y-2 text-ink text-sm">
              <li>
                <Link href="/locations" className="hover:underline">
                  All Locations
                </Link>
              </li>
              {locationsData.slice(0, 5).map((location) => (
                <li key={location.slug}>
                  <Link href={location.route} className="hover:underline">
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Tools</h3>
            <ul className="space-y-2 text-ink text-sm">
              <li>
                <Link href="/tools" className="hover:underline">
                  All Tools
                </Link>
              </li>
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className="hover:underline">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-heading">Resources</h3>
            <ul className="space-y-2 text-ink text-sm">
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:underline">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-outline pt-8 mb-8">
          <div className="w-full h-64 rounded-lg overflow-hidden border border-outline mb-6">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
              title="Location Map"
            />
          </div>
        </div>
        
        <div className="border-t border-outline pt-8">
          <div className="text-ink text-sm space-y-4 mb-6">
            <p>
              <strong>Disclosures:</strong> This site helps investors identify potential replacement properties for Section 1031 exchanges. This site is not a Qualified Intermediary, law firm, broker, or CPA. Users should consult a Qualified Intermediary and tax advisor before acting.
            </p>
          </div>
          <div className="text-center text-ink text-sm">
            <p>&copy; {new Date().getFullYear()} {site.company}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

