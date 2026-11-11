import { useState } from "react";
import { Search, CalendarDays, ExternalLink } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { NewsCard } from "../components/cards/NewsCard";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { news, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "../data/siteData";

export function Actualites() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Toutes");

  const cats = ["Toutes", ...new Set(news.map((n) => n.category))];

  const filtered = news.filter((n) => {
    const matchesCat = cat === "Toutes" || n.category === cat;
    const matchesSearch = `${n.title} ${n.excerpt} ${n.category}`
      .toLowerCase()
      .includes(q.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <PageBanner title="Actualités" icon={CalendarDays} />
      <main className="py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Instagram Banner Callout */}
          <div className="mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20">
                <InstagramIcon size={24} className="text-white" />
              </span>
              <div>
                <p className="font-bold text-sm">L'actualité en direct sur les réseaux</p>
                <p className="text-xs text-pink-100">Nos photos, stories et vidéos sont publiées en temps réel sur {INSTAGRAM_HANDLE}</p>
              </div>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-pink-700 hover:bg-pink-50 transition"
            >
              <span>Ouvrir Instagram</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Search & Filter */}
          <div className="mb-10 flex flex-col gap-4 rounded-2xl bg-stone-50 p-5 md:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Rechercher une actualité</span>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={19} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="input !pl-11"
                placeholder="Rechercher une actualité, un thème, une date…"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {cats.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`filter-chip ${cat === c ? "selected" : ""}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="placeholder-panel">
              <Search />
              <h3>Aucune actualité ne correspond à votre recherche</h3>
              <p className="text-xs text-stone-500">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

