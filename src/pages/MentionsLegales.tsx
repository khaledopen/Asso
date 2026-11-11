import { ShieldCheck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageBanner } from "../components/common/PageBanner";
import { ASSOCIATION_INFO } from "../data/siteData";

export function MentionsLegales() {
  return (
    <>
      <PageBanner title="Mentions Légales" icon={ShieldCheck} />
      <main className="py-16">
        <div className="mx-auto max-w-4xl px-5 space-y-10 text-stone-700 leading-relaxed">
          {/* Bloc 1 */}
          <section className="card p-8">
            <h2 className="font-display text-2xl font-extrabold text-[#73143e]">
              1. Informations légales sur l’éditeur du site
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <b>Dénomination sociale :</b> {ASSOCIATION_INFO.name}
              </p>
              <p>
                <b>Forme juridique :</b> {ASSOCIATION_INFO.legalStatus}
              </p>
              <p>
                <b>Date de création :</b> Déclarée en mars {ASSOCIATION_INFO.foundationYear}
              </p>
              <p>
                <b>Numéro RNA :</b> {ASSOCIATION_INFO.rna} (Préfecture du Loiret)
              </p>
              <p>
                <b>Numéro SIREN :</b> {ASSOCIATION_INFO.siren}
              </p>
              <p>
                <b>Numéro SIRET :</b> {ASSOCIATION_INFO.siret}
              </p>
              <p>
                <b>Siège social :</b> {ASSOCIATION_INFO.address}, {ASSOCIATION_INFO.postalCode} {ASSOCIATION_INFO.city} (France)
              </p>
              <p>
                <b>Directrice de la publication et Présidente :</b> {ASSOCIATION_INFO.president}
              </p>
              <p>
                <b>Réseau social officiel :</b> Instagram {ASSOCIATION_INFO.instagram}
              </p>
            </div>
          </section>

          {/* Bloc 2 */}
          <section className="card p-8">
            <h2 className="font-display text-2xl font-extrabold text-[#73143e]">
              2. Hébergement du site
            </h2>
            <p className="mt-4 text-sm leading-6">
              Ce site web est hébergé sur des infrastructures cloud sécurisées conformes aux normes européennes de protection des données.
            </p>
          </section>

          {/* Bloc 3 */}
          <section className="card p-8">
            <h2 className="font-display text-2xl font-extrabold text-[#73143e]">
              3. Dons et paiements en ligne
            </h2>
            <p className="mt-4 text-sm leading-6">
              Les dons et cotisations d’adhésion pour <b>{ASSOCIATION_INFO.name}</b> sont traités via la plateforme agréée <b>HelloAsso</b> (solution de paiement 100% sécurisée dédiée aux associations françaises). Aucune coordonnée bancaire n’est traitée, transmise ni enregistrée sur le serveur du présent site.
            </p>
          </section>

          {/* Bloc 4 */}
          <section className="card p-8">
            <h2 className="font-display text-2xl font-extrabold text-[#73143e]">
              4. Données personnelles & RGPD
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD 2016/679) et à la loi « Informatique et Libertés », les informations recueillies dans le formulaire de contact font l'objet d'un traitement uniquement destiné à répondre aux demandes des utilisateurs.
              </p>
              <p>
                Ces informations ne font l'objet d'aucune cession, vente ni échange commercial avec des tiers.
              </p>
              <p>
                Vous bénéficiez d'un droit d'accès, de rectification et de suppression des données vous concernant, que vous pouvez exercer en contactant directement l’association.
              </p>
            </div>
          </section>

          {/* Bloc 5 */}
          <section className="card p-8">
            <h2 className="font-display text-2xl font-extrabold text-[#73143e]">
              5. Propriété intellectuelle
            </h2>
            <p className="mt-4 text-sm leading-6">
              Tous les éléments constitutifs du présent site (textes, logos, visuels, charte graphique) sont protégés par le droit d'auteur. Toute reproduction totale ou partielle sans autorisation expresse de l'association est interdite.
            </p>
          </section>

          <div className="text-center pt-4">
            <Link to="/" className="btn-primary">
              Retour à l’accueil <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

