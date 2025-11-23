"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar.jsx";

const HIDE_SIDEBAR_PATHS = ["/login", "/register"];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const showSidebar = !HIDE_SIDEBAR_PATHS.some((path) =>
    pathname?.startsWith(path)
  );

  if (!showSidebar) {
    return (
      <main className="min-h-screen w-full bg-[var(--background)]">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
