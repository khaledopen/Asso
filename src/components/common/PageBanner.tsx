import type { ComponentType, SVGProps } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface PageBannerProps {
  title: string;
  icon?: ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>;
}

export function PageBanner({ title, icon: Icon = Heart }: PageBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#c72b70] via-[#e83e83] to-[#f093b6] text-white">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,white,transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex items-center gap-4">
          <Icon size={38} />
          <h1 className="font-display text-4xl font-extrabold md:text-5xl">{title}</h1>
        </div>
        <p className="mt-4 text-sm text-pink-50">
          <Link to="/" className="hover:underline">Accueil</Link> <span className="mx-2">›</span> {title}
        </p>
      </div>
    </section>
  );
}

