"use client";

import { MessageCircle, PhoneCall } from "lucide-react";
import { usePathname } from "next/navigation";

const PHONE_NUMBER = "+201000000000";
const WHATSAPP_NUMBER = "201000000000";

function isDashboardPath(pathname: string) {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/api");
}

export function ConversionActions() {
  const pathname = usePathname();

  if (isDashboardPath(pathname)) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-[5.9rem] end-4 z-40 flex flex-col gap-[var(--space-2)] lg:bottom-6">
        <a
          aria-label="WhatsApp"
          className="inline-flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[var(--shadow-md)] transition-transform duration-[var(--duration-base)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          rel="noreferrer"
          target="_blank"
        >
          <MessageCircle size={20} />
        </a>
        <a
          aria-label="Call us"
          className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-md)] transition-transform duration-[var(--duration-base)] hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
          href={`tel:${PHONE_NUMBER}`}
        >
          <PhoneCall size={20} />
        </a>
      </div>

      <div className="fixed inset-x-0 bottom-[4.5rem] z-30 px-[var(--space-4)] lg:hidden">
        <a
          className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-5)] text-[length:var(--font-size-sm)] font-[var(--font-weight-bold)] text-[var(--color-text-inverse)] shadow-[var(--shadow-md)]"
          href="#contact"
        >
          احجز الآن خلال خطوتين
        </a>
      </div>
    </>
  );
}
