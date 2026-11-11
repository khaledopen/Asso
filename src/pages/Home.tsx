import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, ArrowRight, Users, Accessibility, Sparkles, HandHeart, Star, ExternalLink,
} from "lucide-react";
import { Reveal } from "../components/common/Reveal";
import { SectionTitle } from "../components/common/SectionTitle";
import { ActionCard } from "../components/cards/ActionCard";
import { NewsCard } from "../components/cards/NewsCard";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { actions, news, img, INSTAGRAM_URL, INSTAGRAM_HANDLE, ASSOCIATION_INFO } from "../data/siteData";

export function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-grid relative overflow-hidden">
        <div className="mx-auto grid min-h-[640px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge">Association loi 1901 • Depuis {ASSOCIATION_INFO.foundationYear}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-800">
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                {ASSOCIATION_INFO.city}
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-[#73143e]">
              Ensemble,<br />
              faisons grandir<br />
              <span className="text-pink-600">leurs sourires</span> ♡
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-stone-700">
              Accompagner les enfants extraordinaires, soutenir leurs familles au quotidien et favoriser l’inclusion par le sport, les loisirs et la solidarité.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link className="btn-primary" to="/faire-un-don">
                Faire un don <Heart size={17} />
              </Link>
              <Link className="btn-secondary" to="/association">
                Découvrir l’association <ArrowRight size={17} />
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50/80 px-4 py-3 text-sm font-bold text-pink-700 transition hover:bg-pink-100"
              >
                <InstagramIcon size={18} />
                <span>{INSTAGRAM_HANDLE}</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-[45%_55%_50%_50%] bg-pink-200/65 blur-sm" />
            <img
              className="relative h-[480px] sm:h-[520px] w-full rounded-[3rem_3rem_1rem_3rem] object-cover shadow-2xl"
              src={img("photo-1503454537195-1dcabb73ffb9")}
              alt="Enfant souriant et épanoui"
            />
            <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-xl flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-pink-50 text-pink-600">
                <Heart fill="currentColor" size={26} />
              </span>
              <div>
                <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Engagement</p>
                <p className="text-sm font-extrabold text-[#73143e]">Plus de 8 ans d’actions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Instagram Spotlight Banner */}
      <section className="bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 py-6 text-white shadow-inner">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:flex-row sm:text-left lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-md">
              <InstagramIcon size={26} className="text-white" />
            </span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-pink-100">Direct Instagram</p>
              <h2 className="text-lg font-bold">Suivez nos entraînements, sourires et événements sur {INSTAGRAM_HANDLE}</h2>
            </div>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-extrabold text-pink-700 shadow-md transition hover:bg-pink-50 hover:scale-105"
          >
            <span>Voir les publications</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 lg:px-8">
          <Reveal>
            <img
              className="h-[420px] w-full rounded-[2rem] object-cover shadow-xl"
              src={img("photo-1484820540004-14229fe36ca4")}
              alt="Activité collective et inclusive"
              loading="lazy"
            />
          </Reveal>
          <Reveal>
            <p className="eyebrow">Notre mission</p>
            <h2 className="section-title !text-left">Faire une vraie place à chaque enfant</h2>
            <p className="mt-5 leading-8 text-stone-600">
              Fondée par <b>{ASSOCIATION_INFO.president}</b> en {ASSOCIATION_INFO.foundationYear} à <b>{ASSOCIATION_INFO.city}</b>, l’association
              « Un sourire pour Tissem et tous les enfants » agit chaque jour pour soutenir les familles,
              rompre l’isolement et offrir des activités adaptées et inclusives (sport, loisirs, sorties).
            </p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="mini-card">
                <Users className="text-pink-600" />
                <div>
                  <b>Créer du lien</b>
                  <p className="text-xs text-stone-500">Solidarité entre familles</p>
                </div>
              </div>
              <div className="mini-card">
                <Accessibility className="text-pink-600" />
                <div>
                  <b>Favoriser l’autonomie</b>
                  <p className="text-xs text-stone-500">Activités physiques et ludiques</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Nos Principales Actions */}
      <section className="bg-[#fff7fa] py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle
            eyebrow="Agir ensemble"
            title="Nos principales actions"
            text="Des initiatives concrètes, pensées avec bienveillance pour bouger, apprendre et s’épanouir."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {actions.slice(0, 3).map((a) => (
              <Reveal key={a.slug}>
                <ActionCard action={a} />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/actions" className="btn-secondary">
              Voir toutes nos actions <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle
            eyebrow="Ce qui nous guide"
            title="Des valeurs qui nous rassemblent"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              [Users, "Inclusion"],
              [Heart, "Bienveillance"],
              [HandHeart, "Solidarité"],
              [Sparkles, "Autonomie"],
              [Star, "Épanouissement"],
            ].map(([Icon, label]) => (
              <Reveal key={label as string}>
                <div className="value-card">
                  <span>
                    <Icon size={26} />
                  </span>
                  <h3>{label as string}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle
            eyebrow="À la une"
            title="Les dernières actualités"
            text="Les rendez-vous, nouveautés et temps forts de notre association."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <Reveal key={n.slug}>
                <NewsCard item={n} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 py-20 lg:px-8">
        <Reveal className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#b92264] to-[#ef4b8d] p-10 text-white shadow-xl md:p-14">
          <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.2em] text-pink-100">Soutenez notre cause</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold md:text-4xl">
                Votre générosité fait grandir de vrais sourires.
              </h2>
              <p className="mt-2 text-pink-100 max-w-xl text-sm">
                Participez à nos campagnes de dons et d'adhésions via notre plateforme partenaire sécurisée HelloAsso.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-white" to="/faire-un-don">
                Faire un don <Heart size={18} />
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white inline-flex items-center gap-2"
              >
                <InstagramIcon size={18} />
                <span>Nous suivre</span>
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

