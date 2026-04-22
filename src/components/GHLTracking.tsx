"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

const TRACKING_SRC = "https://link.msgsndr.com/js/external-tracking.js";
const TRACKING_ID = "tk_84e3cc583dfb473aa256fc525a333fdc";

function GHLTrackingInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    document.querySelectorAll(`script[src="${TRACKING_SRC}"]`).forEach((el) => el.remove());

    const lc = (window as unknown as { _lcTracking?: Record<string, unknown> })._lcTracking;
    if (lc) {
      delete (window as unknown as { _lcTracking?: unknown })._lcTracking;
    }

    const script = document.createElement("script");
    script.src = TRACKING_SRC;
    script.setAttribute("data-tracking-id", TRACKING_ID);
    script.async = true;
    document.head.appendChild(script);
  }, [pathname, searchParams]);

  return null;
}

export default function GHLTracking() {
  return (
    <Suspense fallback={null}>
      <GHLTrackingInner />
    </Suspense>
  );
}
