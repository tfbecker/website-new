"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function DelayedScrollBuddy() {
  const [showScrollBuddy, setShowScrollBuddy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollBuddy(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showScrollBuddy) return null;

  return <Script src="https://scrollbuddy.com/sbv1.js" />;
} 