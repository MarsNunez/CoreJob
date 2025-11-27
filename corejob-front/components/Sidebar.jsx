"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getCurrentUser, getToken } from "../lib/api.js";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(localStorage.getItem("Collapsed") === "1");

    const token = getToken();
    const user = getCurrentUser();
    setCurrentUser(user || null);
    setIsAuthed(!!token && !!user);
  }, [pathname]);

  const logout = () => {
    clearAuthSession();
    setIsAuthed(false);
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
    const content = (
      <div
        className={`flex gap-3 items-center ${
          collapsed && "flex-col items-center text-center"
        }`}
      >
        <i
          className={`${icon} ${collapsed && "text-[em]"} text-[1rem] w-5`}
        ></i>
        <span className={`${collapsed ? "text-[10px]" : "text-[1rem]"}`}>
          {label}
        </span>
      </div>
    );
    const base = `nav-link ${collapsed ? "flex-col items-center" : ""} ${
      active ? "nav-link-active" : ""
    } ${className}`;
    if (href) {
      return (
        <Link href={href} className={base}>
          {content}
        </Link>
      );
    }
    return (
      <button onClick={onClick} className={base + " text-left"}>
        {content}
      </button>
    );
  };

  return (
    <aside
      className={`h-dvh sticky top-0 duration-300 ${
        collapsed ? "w-20" : "w-60"
      } border-r border-neutral-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 backdrop-blur p-4 hidden md:flex md:flex-col`}
    >
      {/* Brand */}
      <div
        className={`mb-4 flex items-center ${
          collapsed ? "justify-center" : "gap-3 px-1"
        }`}
      >
        <div className="h-9 w-9 rounded-xl bg-indigo-600/10 grid place-items-center">
          <i className="fa-solid fa-plus text-indigo-600"></i>
        </div>
        {!collapsed && (
          <div className="mr-auto">
            <div className="text-sm font-semibold">CoreJob.</div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 border border-neutral-500 rounded px-2 py-0.5 inline-flex items-center gap-1">
              {isAuthed ? "Usuario" : "Invitado"}
            </div>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className="h-8 w-8 rounded-md grid place-items-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Collapse"
          >
            <i className="fa-solid fa-angles-left"></i>
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={toggleCollapsed}
          className="mb-4 h-8 w-8 rounded-md grid place-items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 self-center"
          title="Expand"
        >
          <i className="fa-solid fa-angles-right"></i>
        </button>
      )}

      {/* Overview section */}
      <div
        className={`text-xs font-medium text-neutral-400 px-1 mb-2 ${
          collapsed ? "hidden" : ""
        }`}
      >
        OVERVIEW
      </div>
      <nav className={`flex flex-col gap-3 ${collapsed && "gap-5"}`}>
        <NavItem href="/" icon="fa-solid fa-house" label="Inicio" />
        <NavItem
          href="/search"
          icon="fa-solid fa-magnifying-glass"
          label="Buscar"
        />
        {isAuthed && (
          <>
            <NavItem
              href="/myservices"
              icon="fa-solid fa-suitcase"
              label="Mis servicios"
            />
            <NavItem
              href={`/profile/${currentUser?._id ?? ""}`}
              icon="fa-solid fa-user"
              label="Perfil"
            />
          </>
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
        className={`text-xs font-medium text-neutral-400 px-1 mb-2 ${
          collapsed ? "hidden" : ""
        }`}
      >
        SETTINGS
      </div>
      <nav className="flex flex-col text-[1rem] gap-y-2">
        <NavItem href="#" icon="fa-solid fa-gear" label="Settings" />
        {!isAuthed ? (
          <div
            className={
              collapsed
                ? "mt-3 flex flex-col items-center gap-2"
                : "grid grid-cols-5 text-center gap-x-2 mt-3"
            }
          >
            <Link
              href="/register"
              className={`${
                !collapsed ? "col-span-3" : "px-3 py-3 w-full"
              } rounded-md bg-white text-black py-1 flex items-center justify-center transition hover:bg-white/80`}
            >
              {collapsed ? (
                <i className="fa-solid fa-user-plus"></i>
              ) : (
                "Register"
              )}
            </Link>
            <Link
              href="/login"
              className={`${
                !collapsed ? "col-span-2" : "px-3 py-3 w-full"
              } border rounded-md py-1 flex items-center justify-center text-white transition hover:bg-white/10`}
            >
              {collapsed ? (
                <i className="fa-solid fa-right-to-bracket"></i>
              ) : (
                "Login"
              )}
            </Link>
          </div>
        ) : (
          <button
            onClick={logout}
            className={`mt-3 flex items-center justify-center rounded-md border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 ${
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
