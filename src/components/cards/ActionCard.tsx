import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Action } from "../../types";

interface ActionCardProps {
  action: Action;
}

export function ActionCard({ action }: ActionCardProps) {
  return (
    <article className="card group overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative h-52 overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            src={action.image}
            alt={action.title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
        </div>
        <div className="p-6 pb-2">
          <h3 className="font-display text-xl font-extrabold text-[#73143e]">{action.title}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{action.short}</p>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Link
          to={`/actions/${action.slug}`}
          className="inline-flex items-center gap-2 font-bold text-pink-700 hover:text-pink-800 transition"
        >
          En savoir plus <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

