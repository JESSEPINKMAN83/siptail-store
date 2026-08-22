"use client";
import { useEffect } from "react";

declare global {
  // eslint-disable-next-line no-var
  var fbq: ((...args: unknown[]) => void) | undefined;
}

export default function ThankYouPixel() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: 29.99,
        currency: "USD",
        content_type: "product",
        content_ids: ["siptail-trail-bottle"],
      });
    }
  }, []);
  return null;
}
