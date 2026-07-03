"use client";

import { useRef, useCallback } from "react";

interface ScrollBtnProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  dir: "prev" | "next";
  className: string;
}

export default function ScrollBtn({ scrollRef, dir, className }: ScrollBtnProps) {
  const intervalRef = useRef(0);

  const start = useCallback(() => {
    const ref = scrollRef.current;
    if (!ref) return;
    const isRTL = document.documentElement.dir === "rtl";
    const pageAmount = ref.clientWidth * 0.75;
    const pageBase = isRTL ? -pageAmount : pageAmount;
    ref.scrollBy({ left: dir === "next" ? pageBase : -pageBase, behavior: "smooth" });
    const step = 18;
    const stepBase = isRTL ? -step : step;
    intervalRef.current = window.setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: dir === "next" ? stepBase : -stepBase });
      }
    }, 20);
  }, [scrollRef, dir]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
    }
  }, []);

  return (
    <button
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      className={className}
      aria-label={dir === "prev" ? "قبلی" : "بعدی"}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "prev" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"} />
      </svg>
    </button>
  );
}
