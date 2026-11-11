import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import type { NewsItem } from "../../types";

interface NewsCardProps {
  item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="card overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            src={item.image}
            alt={item.title}
            loading="lazy"
          />
        </div>
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-700">
            <CalendarDays size={14} />
            <span>{item.date}</span>
            <span>•</span>
            <span className="rounded-full bg-pink-100 px-2.5 py-0.5 text-pink-800">{item.category}</span>
          </div>
          <h3 className="mt-3 font-display text-xl font-extrabold text-[#73143e] leading-snug">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{item.excerpt}</p>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Link
          to={`/actualites/${item.slug}`}
          className="inline-flex items-center gap-2 font-bold text-pink-700 hover:text-pink-800 transition"
        >
          Lire la suite <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

