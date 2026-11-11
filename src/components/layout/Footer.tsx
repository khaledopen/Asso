import { Link } from "react-router-dom";
import { Heart, MapPin, ExternalLink } from "lucide-react";
import { Logo } from "../common/Logo";
import { InstagramIcon } from "../common/InstagramIcon";
import { nav, INSTAGRAM_URL, HELLOASSO_URL, ASSOCIATION_INFO } from "../../data/siteData";

export function Footer() {
  return (
    <footer className="bg-[#8f194d] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_1.1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-6 text-pink-100">
            Association loi 1901 créée en 2016, engagée pour l’inclusion, l’autonomie, le bien-être
            des enfants extraordinaires et le soutien indéfectible de leurs familles.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-pink-200">
            <MapPin size={15} />
            <span>{ASSOCIATION_INFO.city} — Région Centre-Val de Loire</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Liens utiles</h2>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-pink-100">
            {nav.map(({ to, label }) => (
              <Link key={to} className="hover:text-white transition" to={to}>
                {label}
              </Link>
            ))}
            <Link className="hover:text-white font-bold text-pink-200" to="/faire-un-don">
              Faire un don
            </Link>
            <Link className="hover:text-white transition" to="/mentions-legales">
              Mentions légales
            </Link>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">Restons connectés</h2>
          <p className="mt-4 text-sm leading-6 text-pink-100">
            Suivez le quotidien de l’association, les séances de sport, les photos et les événements en direct sur nos réseaux :
          </p>

          <div className="mt-4 space-y-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              <InstagramIcon size={20} className="text-pink-300" />
              <span>Instagram {ASSOCIATION_INFO.instagram}</span>
              <ExternalLink size={14} className="opacity-70" />
            </a>

            <div>
              <a
                href={HELLOASSO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-pink-200 hover:text-white transition"
              >
                <span>Page officielle sur HelloAsso</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 px-5 py-5 text-center text-xs text-pink-200 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <div>
          © {new Date().getFullYear()} {ASSOCIATION_INFO.name}. RNA {ASSOCIATION_INFO.rna}. Tous droits réservés.
        </div>
        <div className="flex gap-4">
          <Link to="/mentions-legales" className="hover:text-white underline">
            Mentions légales & Confidentialité
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white flex items-center gap-1"
          >
            <InstagramIcon size={14} /> Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

