// InitialLoader.jsx — Minimal, no-animation splash
import React, { useEffect } from "react";

export default function InitialLoader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onFinish === "function") onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <div className="text-center">
        <h1
          className="text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 select-none"
          aria-hidden="true"
        >
          LSH
        </h1>
        <p className="text-sm text-gray-500 mt-2">Loading…</p>
      </div>
    </div>
  );
}
