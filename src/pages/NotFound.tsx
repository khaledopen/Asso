import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function NotFound() {
  return (
    <main className="grid min-h-[65vh] place-items-center px-5 text-center">
      <div>
        <p className="font-display text-8xl font-extrabold text-pink-200">404</p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-[#73143e]">
          Cette page s’est égarée
        </h1>
        <p className="mt-3 text-stone-600">Revenons à l’essentiel : faire grandir les sourires.</p>
        <Link className="btn-primary mt-7" to="/">
          Retour à l’accueil <ArrowRight size={17} />
        </Link>
      </div>
    </main>
  );
}

