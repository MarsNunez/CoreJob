"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearAuthSession,
  fetchJSON,
  getCurrentUser,
  getToken,
} from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [roleLabel, setRoleLabel] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const mobileAreaRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    const user = getCurrentUser();
    setCurrentUser(user || null);
    setIsAuthed(!!token && !!user);
    setRoleLabel(user?.role ? user.role : "");
  }, [pathname]);

  useEffect(() => {
    let active = true;

    const loadAvatar = async () => {
      if (!currentUser?._id) {
        if (active) setAvatarUrl("");
        return;
      }
      try {
        const profiles = await fetchJSON("/profiles", {
          suppressRedirect: true,
        });
        if (!active) return;
        const matched =
          Array.isArray(profiles) &&
          profiles.find(
            (profile) => String(profile.user_id) === String(currentUser._id)
          );
        setAvatarUrl(matched?.profile_picture || "");
      } catch {
        if (active) setAvatarUrl("");
      }
    };

    loadAvatar();
    return () => {
      active = false;
    };
  }, [currentUser?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileAreaRef.current &&
        !mobileAreaRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    clearAuthSession();
    setIsAuthed(false);
    setRoleLabel("");
    router.push("/login");
  };

  const NavItem = ({ href, icon, label }) => {
    const active = href ? pathname === href : false;
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          active
            ? "bg-emerald-600 text-white shadow-[0_0_0_1px_rgba(16,185,129,0.4)]"
            : "text-emerald-100/80 hover:bg-emerald-500/10 hover:text-white"
        }`}
      >
        {icon ? <i className={`${icon} text-[0.75rem]`}></i> : null}
        <span>{label}</span>
      </Link>
    );
  };

  const profileHref = currentUser?._id
    ? `/profile/${currentUser._id}`
    : "/profile";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(3,15,24,0.96)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">ConectaLA</span>
              <span className="text-[11px] text-emerald-100/70">
                {roleLabel || (isAuthed ? "Proveedor" : "Invitado")}
              </span>
            </div>
          </div>

          {/* Main navigation (desktop) */}
          <nav className="hidden items-center gap-2 text-xs lg:flex">
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
                href="/controlPanel"
                icon="fa-solid fa-table-columns"
                label="Control Panel"
              />
            </>
          )}
          </nav>

          {/* Right side: auth + profile (desktop) */}
          <div className="hidden items-center gap-2 lg:flex">
          <Link
            href={profileHref}
            className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-50 transition hover:border-emerald-500/60 hover:bg-emerald-500/10 sm:inline-flex"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={currentUser?.full_name || "Foto de perfil"}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <i className="fa-solid fa-user text-[0.75rem]" />
            )}
            <span className="max-w-[7rem] truncate">
              {currentUser?.full_name || "Perfil"}
            </span>
          </Link>

          {!isAuthed ? (
            <>
              <Link
                href="/register"
                className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-white/5 sm:inline-flex"
              >
                Registrarse
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
              >
                <i className="fa-solid fa-right-to-bracket text-[0.75rem]" />
                <span>Ingresar</span>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              <i className="fa-solid fa-right-from-bracket text-[0.75rem]" />
              <span>Salir</span>
            </button>
          )}
          </div>

          {/* Mobile / tablet hamburger + floating menu */}
          <div
            ref={mobileAreaRef}
            className="relative flex flex-1 items-center justify-end gap-2 lg:hidden"
          >
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-emerald-50 transition hover:border-emerald-500/60 hover:bg-emerald-500/10"
            aria-label="Abrir menú de navegación"
          >
            <i className="fa-solid fa-bars text-sm" />
          </button>
            {mobileOpen && (
            <div className="absolute right-0 top-11 z-40 w-60 rounded-2xl border border-white/10 bg-[#040f19] p-3 text-xs shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                Navegación
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                >
                  <i className="fa-solid fa-house text-[0.7rem]" />
                  <span>Inicio</span>
                </Link>
                <Link
                  href="/search"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                >
                  <i className="fa-solid fa-magnifying-glass text-[0.7rem]" />
                  <span>Buscar</span>
                </Link>
                {isAuthed && (
                  <>
                    <Link
                      href="/myservices"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                    >
                      <i className="fa-solid fa-suitcase text-[0.7rem]" />
                      <span>Mis servicios</span>
                    </Link>
                    <Link
                      href="/controlPanel"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                    >
                      <i className="fa-solid fa-table-columns text-[0.7rem]" />
                      <span>Control Panel</span>
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                Cuenta
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={profileHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={currentUser?.full_name || "Foto de perfil"}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-id-badge text-[0.7rem]" />
                  )}
                  <span>Ver perfil</span>
                </Link>

                {!isAuthed ? (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                    >
                      <i className="fa-solid fa-user-plus text-[0.7rem]" />
                      <span>Registrarse</span>
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-emerald-50 hover:bg-white/5"
                    >
                      <i className="fa-solid fa-right-to-bracket text-[0.7rem]" />
                      <span>Ingresar</span>
                    </Link>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-red-300 hover:bg-red-500/10"
                  >
                    <i className="fa-solid fa-right-from-bracket text-[0.7rem]" />
                    <span>Cerrar sesión</span>
                  </button>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
      </header>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0b1621] p-5 shadow-[0_25px_55px_rgba(0,0,0,0.55)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-300">
                <i className="fa-solid fa-right-from-bracket" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-white">
                  ¿Cerrar sesión?
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Tendrás que volver a iniciar sesión para gestionar tus servicios
                  y perfil.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
