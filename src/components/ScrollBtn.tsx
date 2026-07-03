"use client";

import { useRef } from "react";

interface ScrollBtnProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  dir: "prev" | "next";
  className: string;
}

export default function ScrollBtn({ scrollRef, dir, className }: ScrollBtnProps) {
  const timerRef = useRef(0);

  const doScroll = (smooth: boolean) => {
    const el = scrollRef.current;
    if (!el) return;
    const isRTL = document.documentElement.dir === "rtl";
    const amount = smooth ? el.clientWidth * 0.75 : 20;
    const base = isRTL ? -amount : amount;
    el.scrollBy({ left: dir === "next" ? base : -base, behavior: smooth ? "smooth" : "auto" });
  };

  const handleClick = () => doScroll(true);

  const handleMouseDown = () => {
    doScroll(false);
    timerRef.current = window.setInterval(() => doScroll(false), 30);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = 0;
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleStop}
      onMouseLeave={handleStop}
      className={className}
      aria-label={dir === "prev" ? "قبلی" : "بعدی"}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "prev" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"} />
      </svg>
    </button>
  );
}
