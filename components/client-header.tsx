"use client";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/ui/header").then(mod => mod.Header), { ssr: false });

export default Header; 