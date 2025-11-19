"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getCurrentUser, getToken } from "../lib/api.js";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [roleLabel, setRoleLabel] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(localStorage.getItem("Collapsed") === "1");

    const token = getToken();
    const user = getCurrentUser();
    setCurrentUser(user || null);
    setIsAuthed(!!token && !!user);
    setRoleLabel(user?.role ? user.role : "");
  }, [pathname]);

  const logout = () => {
    clearAuthSession();
    setIsAuthed(false);
    setRoleLabel("");
    router.push("/login");
  };

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined") {
        localStorage.setItem("Collapsed", next ? "1" : "0");
      }
      return next;
    });
  };

  const NavItem = ({ href, icon, label, onClick, className = "" }) => {
    const active = href ? pathname === href : false;
    const base = `${
      collapsed
        ? "flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px]"
        : "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium"
    } ${
      active
        ? "bg-white/15 text-white shadow-[0_15px_35px_rgba(16,185,129,0.25)]"
        : "text-emerald-50/70 hover:text-white hover:bg-white/10"
    } transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${className}`;
    const content = (
      <div
        className={`flex items-center ${
          collapsed ? "flex-col gap-1" : "gap-3"
        }`}
      >
        <i
          className={`${icon} text-[1rem] ${
            collapsed ? "text-base" : ""
          }`}
        ></i>
        <span className="truncate">{label}</span>
      </div>
    );
    if (href) {
      return (
        <Link href={href} className={base}>
          {content}
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={`${base} text-left`} type="button">
        {content}
      </button>
    );
  };

  return (
    <aside
      className={`sticky top-0 hidden h-dvh flex-col border-r border-white/10 bg-[radial-gradient(circle_at_top,#07121c,#05080f)]/95 p-4 text-white shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand */}
      <div
        className={`mb-4 flex items-center ${
          collapsed ? "justify-center" : "gap-3 px-1"
        }`}
      >
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300">
          <i className="fa-solid fa-bolt"></i>
        </div>
        {!collapsed && (
          <div className="mr-auto">
            <div className="text-sm font-semibold tracking-tight">
              CoreJob
            </div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 px-2 py-0.5 text-[11px] text-emerald-100/80">
              {roleLabel || (isAuthed ? "User" : "Guest")}
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 text-slate-200 transition hover:bg-white/10"
            title="Contraer"
            type="button"
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggleCollapsed}
          className="mb-4 grid h-9 w-9 place-items-center self-center rounded-2xl border border-white/10 text-slate-200 transition hover:bg-white/10"
          title="Expandir"
          type="button"
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      )}

      {/* Overview section */}
      <div
        className={`mb-2 px-1 text-xs font-semibold tracking-[0.3em] text-emerald-300/70 ${
          collapsed ? "hidden" : ""
        }`}
      >
        OVERVIEW
      </div>
      <nav className={`flex flex-col ${collapsed ? "gap-5" : "gap-2"}`}>
        <NavItem href="/" icon="fa-solid fa-house" label="Inicio" />
        <NavItem
          href="/search"
          icon="fa-solid fa-magnifying-glass"
          label="Buscar"
        />
        {isAuthed && (
          <NavItem
            href="/myservices"
            icon="fa-solid fa-suitcase"
            label="Mis servicios"
          />
        )}
        {isAuthed && currentUser?._id && (
          <NavItem
            href={`/profile/${currentUser._id}`}
            icon="fa-solid fa-user"
            label="Perfil"
          />
        )}
        {isAuthed && (
          <NavItem
            href="/controlPanel"
            icon="fa-solid fa-table-columns"
            label="Control Panel"
          />
        )}
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Settings */}
      <div
        className={`mb-2 px-1 text-xs font-semibold tracking-[0.3em] text-emerald-300/70 ${
          collapsed ? "hidden" : ""
        }`}
      >
        SETTINGS
      </div>
      <nav className="flex flex-col gap-y-2 text-[1rem]">
        <NavItem href="#" icon="fa-solid fa-gear" label="Settings" />
        {!isAuthed ? (
          <div
            className={
              collapsed
                ? "mt-4 flex flex-col items-center gap-3"
                : "mt-4 grid grid-cols-5 gap-3"
            }
          >
            <Link
              href="/register"
              className={`${
                collapsed ? "w-full px-4 py-3" : "col-span-3 px-4 py-2"
              } inline-flex items-center justify-center rounded-2xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-500`}
            >
              {collapsed ? (
                <i className="fa-solid fa-user-plus"></i>
              ) : (
                "Registrarse"
              )}
            </Link>
            <Link
              href="/login"
              className={`${
                collapsed ? "w-full px-4 py-3" : "col-span-2 px-4 py-2"
              } inline-flex items-center justify-center rounded-2xl border border-white/20 text-sm font-semibold text-white transition hover:bg-white/10`}
            >
              {collapsed ? (
                <i className="fa-solid fa-right-to-bracket"></i>
              ) : (
                "Iniciar sesión"
              )}
            </Link>
          </div>
        ) : (
          <button
            onClick={logout}
            className={`mt-4 flex items-center justify-center rounded-2xl border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 ${
              collapsed ? "w-full" : ""
            }`}
            >
            {collapsed ? (
              <i className="fa-solid fa-right-from-bracket"></i>
            ) : (
              <div>
                <i className="fa-solid fa-right-from-bracket mr-2 hidden md:inline-block"></i>
                Cerrar sesión
              </div>
            )}
          </button>
        )}
      </nav>
    </aside>
  );
}
