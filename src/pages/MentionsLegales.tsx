import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function MentionsLegales() {
  return (
    <main>
      <section className="page-hero">
        <div>
          <span>07</span>
          <div>
            <p className="eyebrow">
              <span /> Un sourire pour Tissem
            </p>
            <h1>Mentions légales & confidentialité.</h1>
            <p>Transparence, cadre juridique et respect de la vie privée.</p>
          </div>
        </div>
      </section>

      <div className="legal-page">
        <section className="legal-section">
          <p className="eyebrow">
            <span /> Éditeur
          </p>
          <h2>1. Identification de l’association</h2>
          <p>
            <b>Dénomination :</b> Association Un sourire pour Tissem et tous les enfants
          </p>
          <p>
            <b>Forme juridique :</b> Association loi 1901 à but non lucratif (déclarée en mars 2016)
          </p>
          <p>
            <b>Numéro RNA :</b> W452013082 (Préfecture du Loiret)
          </p>
          <p>
            <b>SIREN :</b> 895 052 363 · <b>SIRET :</b> 895 052 363 00010
          </p>
          <p>
            <b>Siège social :</b> 48 Rue de Monteloup, 45380 La Chapelle-Saint-Mesmin, France
          </p>
          <p>
            <b>Présidente & Directrice de la publication :</b> Jamila Tighadouini
          </p>
          <p>
            <b>Téléphone :</b> <a href="tel:+33617037095">06 17 03 70 95</a>
          </p>
          <p>
            <b>Lieu des activités régulières :</b> L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans
          </p>
        </section>

        <section className="legal-section">
          <p className="eyebrow">
            <span /> Hébergement
          </p>
          <h2>2. Hébergement du site</h2>
          <p>
            Ce site est hébergé sur des infrastructures cloud sécurisées conformes aux normes européennes de protection des données (RGPD).
          </p>
        </section>

        <section className="legal-section">
          <p className="eyebrow">
            <span /> Dons & Paiements
          </p>
          <h2>3. Collecte de dons et paiements sécurisés</h2>
          <p>
            Les dons et adhésions sont collectés via la plateforme officielle agréée <b>HelloAsso</b>. Aucune donnée bancaire n’est stockée ou traitée par le présent site web.
          </p>
        </section>

        <section className="legal-section">
          <p className="eyebrow">
            <span /> RGPD
          </p>
          <h2>4. Protection des données personnelles</h2>
          <p>
            Les données transmises via le formulaire de contact sont strictement utilisées pour répondre aux demandes des utilisateurs. Elles ne sont ni cédées, ni vendues. Vous disposez d’un droit d’accès, de rectification et d’effacement en contactant directement l’association.
          </p>
        </section>

        <section className="legal-section">
          <p className="eyebrow">
            <span /> Propriété
          </p>
          <h2>5. Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus, textes, photographies d’activités et visuels (notamment la Mallette Handi’Cap) sont la propriété de l’association ou diffusés avec accord. Toute reproduction non autorisée est interdite.
          </p>
        </section>

        <div style={{ marginTop: "30px" }}>
          <Link to="/" className="arrow-link">
            Retourner à l’accueil <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
  );
}
