import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { Logo } from "../common/Logo";
import { InstagramIcon } from "../common/InstagramIcon";
import { nav, INSTAGRAM_URL } from "../../data/siteData";

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {label}
            </NavLink>
          ))}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Suivre l'association sur Instagram"
            className="group flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white shadow-sm transition hover:scale-105 hover:shadow-md"
            title="Instagram @un_sourire_pour_tissem"
          >
            <InstagramIcon size={19} />
          </a>

          <Link className="btn-primary !px-5 !py-3" to="/faire-un-don">
            Faire un don <Heart size={16} />
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white"
          >
            <InstagramIcon size={18} />
          </a>
          <button
            className="icon-button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-pink-100 bg-white lg:hidden"
            aria-label="Navigation mobile"
          >
            <div className="space-y-1 px-5 py-5">
              {nav.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 font-bold transition ${
                      isActive ? "bg-pink-50 text-pink-700" : "text-stone-700 hover:bg-stone-50"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              <div className="pt-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-pink-50 px-4 py-3 font-bold text-pink-700 transition hover:bg-pink-100"
                >
                  <InstagramIcon size={19} />
                  <span>Instagram @un_sourire_pour_tissem</span>
                </a>
              </div>

              <Link className="btn-primary mt-3 w-full" to="/faire-un-don">
                Faire un don <Heart size={17} />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

