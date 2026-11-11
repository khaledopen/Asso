import { Link } from "react-router-dom";
import { Users, Target, Eye, Heart, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { PageBanner } from "../components/common/PageBanner";
import { SectionTitle } from "../components/common/SectionTitle";
import { InstagramIcon } from "../components/common/InstagramIcon";
import { img, ASSOCIATION_INFO, INSTAGRAM_URL, HELLOASSO_URL } from "../data/siteData";

export function Association() {
  return (
    <>
      <PageBanner title="L’Association" icon={Users} />
      <main>
        {/* Histoire */}
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2 lg:px-8">
            <img
              className="h-[440px] w-full rounded-[2rem] object-cover shadow-xl"
              src={img("photo-1484820540004-14229fe36ca4")}
              alt="Moments de partage de l'association"
            />
            <div>
              <p className="eyebrow">Notre histoire</p>
              <h2 className="section-title !text-left">Un sourire peut tout changer</h2>
              <p className="mt-5 leading-8 text-stone-600">
                Créée en <b>mars 2016</b> à <b>{ASSOCIATION_INFO.city}</b>, l’association
                <b> « {ASSOCIATION_INFO.name} »</b> est née de la volonté d’apporter une aide concrète,
                bienveillante et humaine aux enfants malades ou en situation de handicap, ainsi qu’à leurs familles.
              </p>
              <p className="mt-4 leading-8 text-stone-600">
                Portée par sa présidente fondatrice <b>{ASSOCIATION_INFO.president}</b> et une équipe de bénévoles dévoués,
                l’association développe des projets pour encourager la pratique sportive adaptée,
                proposer des moments de répit et faire progresser le regard de la société sur la différence.
              </p>

              <div className="mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-5 text-sm text-stone-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-pink-800">
                  <ShieldCheck size={18} />
                  <span>Association déclarée d’intérêt général (Loi 1901)</span>
                </div>
                <div className="text-xs text-stone-600">
                  RNA : <b>{ASSOCIATION_INFO.rna}</b> • SIRET : <b>{ASSOCIATION_INFO.siret}</b> • Siège : {ASSOCIATION_INFO.address}, {ASSOCIATION_INFO.postalCode} {ASSOCIATION_INFO.city}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Vision Valeurs */}
        <section className="bg-[#fff7fa] py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionTitle
              eyebrow="Nos piliers"
              title="Ce qui anime chaque action"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                [
                  Target,
                  "Notre mission",
                  "Accompagner les enfants extraordinaires au quotidien, les soutenir dans leur développement et apporter un appui moral, administratif et pratique à leurs familles.",
                ],
                [
                  Eye,
                  "Notre vision",
                  "Bâtir une société inclusive où chaque enfant, quelles que soient ses particularités, trouve sa juste place, entouré d’amour et d’opportunités d’épanouissement.",
                ],
                [
                  Heart,
                  "Nos valeurs",
                  "Inclusion inconditionnelle, bienveillance, écoute sans jugement, solidarité active et respect du rythme de chaque personne.",
                ],
              ].map(([Icon, title, desc]) => (
                <div key={title as string} className="card p-7 flex flex-col justify-between">
                  <div>
                    <Icon className="text-pink-600" size={34} />
                    <h3 className="mt-5 font-display text-xl font-extrabold text-[#73143e]">{title as string}</h3>
                    <p className="mt-3 leading-7 text-stone-600">{desc as string}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gouvernance & Équipe */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionTitle
              eyebrow="Gouvernance & Bénévolat"
              title="Une équipe engagée au grand cœur"
              text="Des femmes et des hommes mobilisés sur le terrain dans le Loiret pour faire vivre nos initiatives."
            />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-100 text-pink-700 font-display font-black text-xl">
                      JT
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-[#73143e]">
                        {ASSOCIATION_INFO.president}
                      </h3>
                      <p className="text-sm font-bold text-pink-600">Présidente Fondatrice</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-stone-600">
                    À l’initiative de l’association depuis 2016, Jamila coordonne les partenariats,
                    les événements caritatifs, les créneaux sportifs inclusifs et l’accompagnement des parents.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {ASSOCIATION_INFO.city}
                  </span>
                  <span>Bénévole engagée</span>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="card p-8 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 border-pink-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white">
                      <InstagramIcon size={24} />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-[#73143e]">
                        Notre communauté
                      </h3>
                      <p className="text-sm font-bold text-pink-600">{ASSOCIATION_INFO.instagram}</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-stone-600">
                    Découvrez les coulisses de notre vie associative, les témoignages des familles,
                    les vidéos des sessions de sport et les annonces de nos prochains événements directement sur notre profil officiel.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-pink-100">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full justify-center !py-3"
                  >
                    <span>Voir sur Instagram</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/contact" className="btn-secondary">
                Rejoindre notre équipe de bénévoles
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

