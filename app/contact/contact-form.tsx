"use client";

import { servicesData } from "@/data";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type TimelineOption = {
  value: string;
  label: string;
};

interface ContactFormProps {
  prefillProjectType?: string;
}

const timelineOptions: TimelineOption[] = [
  { value: "", label: "Select timeline" },
  { value: "immediate", label: "Immediate" },
  { value: "45-days", label: "45 days" },
  { value: "180-days", label: "180 days" },
  { value: "planning-phase", label: "Planning phase" },
];

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: Element,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          action?: string;
        }
      ) => number;
      reset?: (widgetId: number) => void;
    };
  }
}

export default function ContactForm({ prefillProjectType }: ContactFormProps) {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    city: "",
    property: "",
    estimatedCloseDate: "",
    timeline: "",
    details: "",
    message: "",
  });
  const [projectTypeQuery, setProjectTypeQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY ?? "";
  const searchProjectType = searchParams.get("projectType") ?? "";
  const scrollToFormParam = searchParams.get("scrollToForm") ?? "";

  useEffect(() => {
    const candidate = prefillProjectType || searchProjectType;
    if (candidate) {
      setFormData((prev) => ({ ...prev, projectType: candidate }));
      setProjectTypeQuery(candidate);
      setShowSuggestions(false);
    }
  }, [prefillProjectType, searchProjectType]);

  useEffect(() => {
    if (scrollToFormParam === "true" && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollToFormParam]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.turnstile) {
      setScriptReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.turnstile) {
        setScriptReady(true);
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      !turnstileSiteKey ||
      !scriptReady ||
      !captchaContainerRef.current ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    if (!window.turnstile) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(captchaContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: (token) => setCaptchaToken(token),
      "expired-callback": () => setCaptchaToken(""),
      action: "contact_form",
    });

    return () => {
      widgetIdRef.current = null;
    };
  }, [scriptReady, turnstileSiteKey]);

  const projectTypeSuggestions = useMemo(() => {
    if (!projectTypeQuery) {
      return [];
    }

    return servicesData
      .filter((service) =>
        service.name.toLowerCase().includes(projectTypeQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [projectTypeQuery]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectType") {
      setProjectTypeQuery(value);
      setShowSuggestions(value.length > 0);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, projectType: suggestion }));
    setProjectTypeQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Form submitted", { ...formData, captchaToken });
      // hook up to API or serverless function here
    } finally {
      setIsSubmitting(false);
      setCaptchaToken("");
      if (typeof window !== "undefined" && widgetIdRef.current !== null) {
        window.turnstile?.reset?.(widgetIdRef.current);
      }
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="bg-panel border border-outline rounded-lg p-8"
    >
      <h2 className="text-2xl font-semibold text-heading mb-6">Send Us a Message</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-heading mb-2">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-heading mb-2">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-heading mb-2">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div className="relative">
          <label htmlFor="projectType" className="block text-sm font-medium text-heading mb-2">
            Project Type *
          </label>
          <input
            type="text"
            id="projectType"
            name="projectType"
            required
            value={formData.projectType}
            onChange={handleInputChange}
            placeholder="Start typing to see suggestions..."
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
          {showSuggestions && projectTypeSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-outline rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
              <ul className="py-2">
                {projectTypeSuggestions.map((service) => (
                  <li key={service.slug}>
                    <button
                      type="button"
                      onClick={() => handleSelectSuggestion(service.name)}
                      className="w-full text-left px-4 py-2 hover:bg-panel text-ink transition-colors"
                    >
                      {service.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-heading mb-2">
            Timeline
          </label>
          <select
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          >
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-heading mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Primary metro or submarket (optional)"
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="property" className="block text-sm font-medium text-heading mb-2">
            Property Being Sold
          </label>
          <input
            type="text"
            id="property"
            name="property"
            value={formData.property}
            onChange={handleInputChange}
            placeholder="Include property type, location, and estimated value (optional)"
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="estimatedCloseDate" className="block text-sm font-medium text-heading mb-2">
            Estimated Close Date
          </label>
          <input
            type="date"
            id="estimatedCloseDate"
            name="estimatedCloseDate"
            value={formData.estimatedCloseDate}
            onChange={handleInputChange}
            placeholder="Determines your 45 day and 180 day milestones (optional)"
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-heading mb-2">
            Additional Details
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            value={formData.details}
            onChange={handleInputChange}
            placeholder="Outline goals, replacement preferences, or coordination needs (optional)"
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-heading mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Any additional message or questions (optional) - trigger new deployment"
            className="w-full px-4 py-2 bg-paper border border-outline rounded-lg text-ink focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="space-y-2">
          <div ref={captchaContainerRef} className="flex justify-center"></div>
          {!turnstileSiteKey && (
            <p className="text-sm text-red-500">
              Turnstile site key missing. Add <code>NEXT_PUBLIC_TURNSTILE_SITEKEY</code> before launching the CAPTCHA.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!captchaToken || isSubmitting}
          className="w-full px-8 py-3 bg-primary text-primaryfg rounded-full hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

