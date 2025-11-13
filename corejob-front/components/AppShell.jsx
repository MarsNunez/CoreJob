"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar.jsx";

const HIDE_SIDEBAR_PATHS = ["/login", "/register"];

export default function AppShell({ children }) {
  const pathname = usePathname();
  const showSidebar = !HIDE_SIDEBAR_PATHS.some((path) =>
    pathname?.startsWith(path)
  );

  if (!showSidebar) {
    return <main className="min-h-screen w-full bg-[var(--background)]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
