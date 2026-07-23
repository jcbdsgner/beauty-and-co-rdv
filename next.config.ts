import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Lets the dev server be reached from a phone on the same network (e.g. via a
  // hotspot/LAN IP) for mobile testing — Next.js blocks cross-origin dev asset
  // requests by default, which otherwise leaves the page looking fine but with
  // zero interactivity (JS never loads, so React never hydrates).
  allowedDevOrigins: ["172.20.10.2", "192.168.1.16"],
  devIndicators: false,
};

export default nextConfig;
