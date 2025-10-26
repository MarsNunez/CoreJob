export default function Footer() {
  return (
    <footer className="text-neutral-100 bg-[radial-gradient(circle_at_top_right,#0f5f4c,#0b3b30)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 grid place-items-center">
                <i className="fa-solid fa-plus text-white/90"></i>
              </div>
              <span className="text-lg font-semibold tracking-wide">
                SchoolManager
              </span>
            </div>
            <p className="mt-4 text-sm text-neutral-200/80 leading-relaxed max-w-prose">
              Simplifica la gestión académica con paneles claros, flujos rápidos
              y una experiencia enfocada en lo importante.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-200/80">
              Recursos
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Documentación
                </a>
              </li>
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Soporte
                </a>
              </li>
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Estado
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-200/80">
              Compañía
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Acerca
                </a>
              </li>
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Privacidad
                </a>
              </li>
              <li>
                <a className="hover:text-white/90 transition-colors" href="#">
                  Términos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-xs text-neutral-200/70">
            © {new Date().getFullYear()} SchoolManager. Todos los derechos
            reservados.
          </p>
          <div className="flex items-center gap-4 text-neutral-200/80">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white/90 transition-colors"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </a>
            <a
              href="#"
              aria-label="GitHub"
              className="hover:text-white/90 transition-colors"
            >
              <i className="fa-brands fa-github"></i>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white/90 transition-colors"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
