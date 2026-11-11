import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { gallery, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "../data/siteData";

export function Galerie() {
  const [cat, setCat] = useState("Toutes");
  const [selected, setSelected] = useState<number | null>(null);

  const cats = ["Toutes", ...new Set(gallery.map((g) => g.category))];
  const shown = gallery.filter((g) => cat === "Toutes" || g.category === cat);

  return (
    <>
      <PageBanner title="Galerie" icon={ImageIcon} />
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Instagram Callout */}
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-stone-600">
              Découvrez en images nos ateliers, nos séances sportives et les moments inoubliables partagés avec les enfants.
            </p>
            <div className="mt-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700 hover:bg-pink-100 transition shadow-sm"
              >
                <InstagramIcon size={16} />
                <span>Voir encore plus de photos et stories sur {INSTAGRAM_HANDLE}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="mb-9 flex flex-wrap justify-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                className={`filter-chip ${cat === c ? "selected" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid auto-rows-[240px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((g, i) => (
              <button
                key={g.src}
                onClick={() => setSelected(i)}
                className={`group relative overflow-hidden rounded-2xl text-left ${
                  i === 0 ? "sm:row-span-2 sm:h-full" : ""
                }`}
                aria-label={`Agrandir : ${g.alt}`}
              >
                <img
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                  <ZoomIn size={36} />
                </span>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition">
                  {g.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/92 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Aperçu plein écran"
          >
            <button
              className="absolute right-5 top-5 text-white/80 hover:text-white transition p-2"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              <X size={34} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-2"
              onClick={() => setSelected((selected - 1 + shown.length) % shown.length)}
              aria-label="Image précédente"
            >
              <ChevronLeft size={42} />
            </button>

            <div className="flex flex-col items-center max-w-[88vw]">
              <img
                className="max-h-[78vh] max-w-[86vw] rounded-2xl object-contain shadow-2xl"
                src={shown[selected].src}
                alt={shown[selected].alt}
              />
              <p className="mt-3 text-center text-sm font-semibold text-white/90">
                {shown[selected].alt}
              </p>
            </div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition p-2"
              onClick={() => setSelected((selected + 1) % shown.length)}
              aria-label="Image suivante"
            >
              <ChevronRight size={42} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

