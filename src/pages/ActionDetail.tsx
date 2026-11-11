import { useParams, Link } from "react-router-dom";
import { ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { NotFound } from "./NotFound";
import { actions, INSTAGRAM_URL, ASSOCIATION_INFO } from "../data/siteData";

export function ActionDetail() {
  const { slug } = useParams();
  const action = actions.find((x) => x.slug === slug);

  if (!action) {
    return <NotFound />;
  }

  return (
    <>
      <PageBanner title={action.title} icon={CalendarDays} />
      <main className="py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 md:grid-cols-2">
          <div>
            <img
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl"
              src={action.image}
              alt={action.title}
            />
            <div className="mt-4 rounded-2xl border border-pink-100 bg-pink-50 p-4 flex items-center justify-between text-sm">
              <span className="font-bold text-pink-800">Action proposée par l'association</span>
              <span className="text-xs text-stone-500">{ASSOCIATION_INFO.city}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="eyebrow">Action solidaire & inclusive</p>
              <h2 className="section-title !text-left">{action.title}</h2>
              <p className="mt-5 text-lg font-medium text-stone-700 leading-relaxed">
                {action.short}
              </p>
              <p className="mt-4 leading-8 text-stone-600">
                {action.detail}
              </p>

              <div className="mt-6 rounded-2xl bg-[#fff7fa] border border-pink-100 p-5 text-sm text-stone-700">
                <p className="font-bold text-pink-700">Vous souhaitez inscrire votre enfant ou participer ?</p>
                <p className="mt-1 text-xs text-stone-600">
                  Contactez-nous directement via notre formulaire ou suivez les sessions annoncées en temps réel sur notre Instagram <b>{ASSOCIATION_INFO.instagram}</b>.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary" to="/contact">
                Nous contacter <ArrowRight size={17} />
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <InstagramIcon size={17} />
                <span>Voir sur Instagram</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

