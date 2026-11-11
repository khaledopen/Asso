import { useParams, Link } from "react-router-dom";
import { CalendarDays, ArrowRight, ExternalLink } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { NotFound } from "./NotFound";
import { news, INSTAGRAM_URL, ASSOCIATION_INFO } from "../data/siteData";

export function NewsDetail() {
  const { slug } = useParams();
  const item = news.find((x) => x.slug === slug);

  if (!item) {
    return <NotFound />;
  }

  return (
    <>
      <PageBanner title={item.title} icon={CalendarDays} />
      <article className="mx-auto max-w-4xl px-5 py-16">
        <img
          className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl"
          src={item.image}
          alt={item.title}
        />

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-bold text-pink-700">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={16} />
            {item.date}
          </span>
          <span>•</span>
          <span className="rounded-full bg-pink-100 px-3 py-1 text-pink-800">
            {item.category}
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-extrabold text-[#73143e] md:text-4xl">
          {item.title}
        </h1>

        <p className="mt-6 text-xl leading-9 text-stone-700 font-medium">
          {item.excerpt}
        </p>

        <div className="mt-8 rounded-2xl border border-pink-100 bg-[#fff7fa] p-6 text-sm text-stone-700 space-y-3">
          <p className="font-bold text-pink-800">
            Retrouvez tous les détails et les réactions sur nos réseaux
          </p>
          <p className="leading-6">
            Pour réagir à cet article, poser une question ou voir les vidéos des événements, rendez-vous sur le compte Instagram officiel de l’association <b>{ASSOCIATION_INFO.instagram}</b>.
          </p>
          <div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-pink-700"
            >
              <InstagramIcon size={16} />
              <span>Voir sur Instagram</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center border-t border-stone-200 pt-6">
          <Link to="/actualites" className="btn-secondary !py-2.5 !px-5 text-sm">
            ← Toutes les actualités
          </Link>
          <Link to="/contact" className="btn-primary !py-2.5 !px-5 text-sm">
            Nous contacter <ArrowRight size={15} />
          </Link>
        </div>
      </article>
    </>
  );
}

