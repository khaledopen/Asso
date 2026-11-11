import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="Un sourire pour Tissem — Accueil">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-pink-700 text-white shadow-sm transition group-hover:rotate-[-6deg]">
        <Heart fill="currentColor" size={23} />
      </span>
      <span className="leading-none">
        <span className="block text-[10px] font-bold text-stone-600">Le sourire pour</span>
        <span className="font-display text-[22px] font-extrabold italic text-pink-700">Tissem</span>
        <span className="block text-[8px] font-bold text-stone-500">et tous les enfants</span>
      </span>
    </Link>
  );
}

