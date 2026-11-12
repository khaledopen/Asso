export interface BrandSettings {
  siteName: string;
  siteSubtitle: string;
  logo: string;
  phone: string;
  contactEmail: string;
  instagramUrl: string;
  tiktokUrl: string;
  helloassoUrl: string;
  donationUrl: string;
  footerDescription: string;
  footerLegal: string;
  footerAddress: string;
  footerTagline: string;
}

export interface ValueItem {
  kind: "people" | "move" | "smile" | "spark";
  title: string;
  text: string;
}

export interface HomePageContent {
  heroTitlePrefix: string;
  heroTitleEmphasis: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroMainImage: string;
  heroMainAlt: string;
  heroDetailImage: string;
  heroDetailAlt: string;
  heroNote: string;
  manifestoYear: string;
  manifestoEyebrow: string;
  manifestoText: string;
  actionsEyebrow: string;
  actionsTitle: string;
  actionsText: string;
  values: ValueItem[];
  newsEyebrow: string;
  newsTitle: string;
  newsLinkLabel: string;
  supportEyebrow: string;
  supportTitle: string;
  supportButtonLabel: string;
}

export interface PillarItem {
  number: string;
  title: string;
  text: string;
}

export interface AssociationPageContent {
  heroTitle: string;
  heroLede: string;
  storyImage: string;
  storyAlt: string;
  storyEyebrow: string;
  storyTitle: string;
  storyText: string;
  storyQuote: string;
  pillars: PillarItem[];
  ctaEyebrow: string;
  ctaTitle: string;
  ctaLinkLabel: string;
}

export interface ActionItem {
  slug: string;
  number: string;
  title: string;
  kicker: string;
  image: string;
  short: string;
  detail: string;
  isPoster?: boolean;
  highlightsTitle?: string;
  highlights?: string[];
  footnote?: string;
}

export interface NewsItem {
  slug: string;
  date: string;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  video?: string;
  videoCaption?: string;
  substripImages?: string[];
  isPoster?: boolean;
  bodyParagraphs?: string[];
  highlightsTitle?: string;
  highlights?: string[];
}

export interface GalleryItem {
  src: string;
  alt: string;
  label: string;
}

export interface HelloAssoItem {
  type: string;
  title: string;
  description: string;
  image: string;
  url: string;
  cta: string;
}

export interface DonationPageContent {
  heroTitle: string;
  heroLede: string;
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
  panelLabel: string;
  secureNoteTitle: string;
  secureNoteText: string;
  eventsEyebrow: string;
  eventsTitle: string;
  eventsIntro: string;
}

export interface ContactPageContent {
  heroTitle: string;
  heroLede: string;
  eyebrow: string;
  title: string;
  intro: string;
  venueTitle: string;
  venueLines: string[];
  hqTitle: string;
  hqLines: string[];
}

export interface LegalSectionItem {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  heroTitle: string;
  heroLede: string;
  sections: LegalSectionItem[];
}

export interface SiteContent {
  brand: BrandSettings;
  home: HomePageContent;
  association: AssociationPageContent;
  actionsPage: {
    heroTitle: string;
    heroLede: string;
  };
  actions: ActionItem[];
  newsPage: {
    heroTitle: string;
    heroLede: string;
  };
  news: NewsItem[];
  galleryPage: {
    heroTitle: string;
    heroLede: string;
  };
  gallery: GalleryItem[];
  donation: DonationPageContent;
  helloAssoActions: HelloAssoItem[];
  contact: ContactPageContent;
  legal: LegalPageContent;
}

const EXCLUDED_GALLERY_NUMBERS = new Set([
  1, 2, 3, 4, 5, 6, 13, 40, 41, 8, 11, 12, 17, 32, 50, 58,
]);

export const DEFAULT_GALLERY: GalleryItem[] = Array.from(
  { length: 75 },
  (_, index) => {
    const number = index + 1;
    if (EXCLUDED_GALLERY_NUMBERS.has(number)) return null;
    const category =
      number <= 26
        ? "Événements & fêtes"
        : number <= 39
          ? "Moments partagés"
          : number <= 52
            ? "Sorties & loisirs"
            : "Ateliers & rencontres";
    return {
      src: `/actions/action-${String(number).padStart(3, "0")}.jpg`,
      alt: `Moment partagé de l’association — ${category.toLowerCase()}`,
      label: category,
    };
  },
).filter((item): item is GalleryItem => item !== null);

const DEFAULT_HELLOASSO_URL =
  "https://www.helloasso.com/associations/association-un-sourire-pour-tissem-et-tous-les-enfants";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brand: {
    siteName: "Un sourire pour Tissem",
    siteSubtitle: "et tous les enfants",
    logo: "/official/logo-tissem.jpg",
    phone: "06 17 03 70 95",
    contactEmail: "Unsourirepourtissem@gmail.com",
    instagramUrl: "https://www.instagram.com/un_sourire_pour_tissem",
    tiktokUrl: "https://www.tiktok.com/@unsourirepourtissem?_r=1&_t=ZS-9BLHUdvaJCz",
    helloassoUrl: DEFAULT_HELLOASSO_URL,
    donationUrl: `${DEFAULT_HELLOASSO_URL}/collectes/100000-euros-pour-faire-grandir-les-sourires`,
    footerDescription:
      "Une association du Loiret (loi 1901) engagée depuis 2016 auprès des enfants en situation de handicap et de leurs familles.",
    footerLegal: "RNA : W452013082 · SIREN : 895 052 363",
    footerAddress:
      "Certaines activités ont lieu à L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans.",
    footerTagline: "Inclusion · Autonomie · Bien-être",
  },
  home: {
    heroTitlePrefix: "Ouvrir les portes de",
    heroTitleEmphasis: "l’inclusion.",
    heroSubtitle:
      "Nous accompagnons les enfants extraordinaires et leurs familles avec des activités qui font bouger, apprendre, rencontrer et grandir.",
    heroPrimaryCta: "Voir nos actions",
    heroSecondaryCta: "Comprendre notre engagement",
    heroMainImage: "/actions/action-035.jpg",
    heroMainAlt: "Un moment inclusif lors d’un événement de l’association",
    heroDetailImage: "/official/mallette-handicap.jpg",
    heroDetailAlt: "La Mallette Handi’Cap",
    heroNote: "Ensemble, faisons grandir leurs sourires.",
    manifestoYear: "2016",
    manifestoEyebrow: "Notre point de départ",
    manifestoText:
      "Une association née d’une histoire familiale, devenue un engagement collectif auprès des enfants en situation de handicap et de leurs familles.",
    actionsEyebrow: "Sur le terrain",
    actionsTitle: "Des actions avec du mouvement, du concret et du lien.",
    actionsText:
      "Pas de grands discours : des outils, des séances et des rencontres qui rendent l’inclusion visible et vivante.",
    values: [
      {
        kind: "people",
        title: "Inclure",
        text: "Créer une place réelle pour chacun.",
      },
      {
        kind: "move",
        title: "Faire bouger",
        text: "Retrouver confiance par l’activité.",
      },
      {
        kind: "smile",
        title: "Soutenir",
        text: "Être aux côtés des enfants et des familles.",
      },
    ],
    newsEyebrow: "La vie de l’association",
    newsTitle: "Ce qui se passe, pour de vrai.",
    newsLinkLabel: "Toutes les actualités",
    supportEyebrow: "Donner un coup de pouce",
    supportTitle: "Chaque soutien rend une action possible.",
    supportButtonLabel: "Soutenir l’association",
  },
  association: {
    heroTitle: "Une histoire devenue engagement.",
    heroLede:
      "Depuis 2016, l’association agit dans le Loiret pour les enfants en situation de handicap et leurs familles.",
    storyImage: "/actions/action-071.jpg",
    storyAlt: "Moment de partage avec Tissem et les bénévoles de l’association",
    storyEyebrow: "Notre histoire",
    storyTitle: "Faire de l’expérience vécue une force collective.",
    storyText:
      "Un sourire pour Tissem et tous les enfants porte une parole simple : les enfants extraordinaires doivent pouvoir participer, découvrir, bouger et s’épanouir comme les autres.",
    storyQuote:
      "« Ensemble pour accompagner les enfants extraordinaires et faire grandir leurs sourires. »",
    pillars: [
      {
        number: "01",
        title: "Notre mission",
        text: "Créer des activités accessibles et des outils de sensibilisation qui soutiennent l’inclusion et l’autonomie.",
      },
      {
        number: "02",
        title: "Notre manière d’agir",
        text: "Partir du réel, écouter les familles, travailler avec les acteurs locaux et proposer des formats concrets.",
      },
      {
        number: "03",
        title: "Notre territoire",
        text: "Orléans, La Chapelle-Saint-Mesmin et plus largement le Loiret, au fil des rencontres et partenariats.",
      },
    ],
    ctaEyebrow: "Participer",
    ctaTitle: "Vous avez du temps, une idée ou une compétence à partager ?",
    ctaLinkLabel: "Parlons-en",
  },
  actionsPage: {
    heroTitle: "Agir, simplement et concrètement.",
    heroLede:
      "Des actions construites autour de l’inclusion, du mouvement, de l’autonomie et du bien-être.",
  },
  actions: [
    {
      slug: "mallette-handicap",
      number: "01",
      title: "Mallette Handi’Cap",
      kicker: "Inclusion · Autonomie · Bien-être",
      image: "/official/mallette-handicap.jpg",
      short:
        "Une mallette pensée pour sensibiliser au handicap et ouvrir, concrètement, les portes de l’inclusion.",
      detail:
        "La Mallette Handi’Cap rassemble des supports ludiques, sensoriels et pédagogiques. Elle permet d’aborder les différences avec les enfants, de mieux comprendre certaines situations de handicap et d’encourager l’autonomie.",
      isPoster: true,
    },
    {
      slug: "handi-zumba",
      number: "02",
      title: "Handi’Zumba",
      kicker: "Bouger · S’amuser · Se dépasser",
      image: "/official/handi-zumba.jpg",
      short:
        "Une activité gratuite, inclusive et joyeuse, conçue pour les enfants en situation de handicap.",
      detail:
        "Avec la coach Nassima à L’Argonaute d’Orléans, Handi’Zumba transforme la danse en espace de confiance, de plaisir et de convivialité. 100% gratuit, chacun participe à son rythme, dans un cadre accueillant et accessible.",
      isPoster: true,
      highlightsTitle: "Détails de la séance (affiche officielle) :",
      highlights: [
        "Tarif : 100% GRATUIT pour tous les enfants en situation de handicap",
        "Encadrement : Avec la coach Nassima",
        "Lieu : L’Argonaute — 73 boulevard Marie Stuart, 45100 Orléans (quartier de l'Argonne)",
        "Horaires : Samedi de 14h30 à 15h30",
        "Au programme : Activité inclusive, confiance en soi, plaisir de bouger, convivialité",
      ],
    },
    {
      slug: "sport-solidaire",
      number: "03",
      title: "Sport solidaire",
      kicker: "Confiance · Énergie · Partage",
      image: "/actions/action-051.jpg",
      short:
        "Des séances, sorties et défis collectifs pour créer du lien et rendre l’activité plus accessible.",
      detail:
        "L’association développe des rendez-vous sportifs conviviaux pour faire du mouvement un outil de bien-être, de confiance et d’inclusion.",
    },
    {
      slug: "sensibilisation",
      number: "04",
      title: "Rencontres & sensibilisation",
      kicker: "Écouter · Comprendre · Rassembler",
      image: "/actions/action-059.jpg",
      short:
        "Des ateliers, événements et rencontres pour faire évoluer les regards et soutenir les familles.",
      detail:
        "Forums, jeux de sensibilisation, rencontres associatives et accueil de jeunes : l’association crée des occasions concrètes de dialoguer autour du handicap et du vivre-ensemble.",
    },
  ],
  newsPage: {
    heroTitle: "La vie de l’association.",
    heroLede:
      "Actions, rencontres, ateliers : des nouvelles ancrées dans le quotidien.",
  },
  news: [
    {
      slug: "salon-solidaire",
      date: "10.11.2026",
      category: "Événement",
      title: "Au cœur du Salon Solidaire : rencontres et partage",
      excerpt:
        "Retour en vidéo et en images sur notre présence au Salon Solidaire : une journée d’échanges, de sensibilisation et d’énergie collective.",
      image: "/actions/action-060.jpg",
      video: "/official/salon-solidaire.mp4",
      videoCaption: "Vidéo : Au stand de l’association au Salon Solidaire",
      substripImages: [
        "/actions/action-061.jpg",
        "/actions/action-059.jpg",
      ],
      bodyParagraphs: [
        "L’association Un sourire pour Tissem et tous les enfants a participé avec cœur et enthousiasme au Salon Solidaire. Cet événement a été une opportunité majeure de faire connaître nos initiatives, d’échanger avec les familles et de renforcer les liens avec les acteurs associatifs et solidaires de notre territoire.",
        "Retrouvez dans la vidéo ci-contre l’ambiance chaleureuse de notre stand, la curiosité des visiteurs pour nos outils pédagogiques et le dynamisme de notre équipe mobilisée tout au long de la journée.",
        "Chaque rencontre sur le terrain contribue à faire évoluer les regards sur le handicap et à ouvrir les portes d’une société plus inclusive pour tous les enfants.",
      ],
      highlightsTitle: "Les temps forts de notre stand :",
      highlights: [
        "Sensibilisation ludique et immersive : Démonstration active des boîtes sensorielles et des modules de la Mallette Handi’Cap (sensibilisation aux handicaps moteurs et à l’autisme).",
        "Rencontres & écoute des familles : Présentation de nos activités hebdomadaires et mensuelles (séances Handi’Zumba 100% gratuites, sorties nature et sport adapté).",
        "Mobilisation de la jeunesse : Présence active de nos stagiaires et jeunes bénévoles pour accueillir et renseigner les visiteurs avec bienveillance.",
        "Partage et synergie locale : Rencontres enrichissantes avec d’autres associations du Loiret pour imaginer de futures collaborations solidaires.",
      ],
    },
    {
      slug: "mallette-handicap-novembre",
      date: "06.11.2026",
      category: "Projet",
      title: "La Mallette Handi’Cap prend forme",
      excerpt:
        "Un outil visuel et sensoriel autour de l’inclusion, de l’autonomie et du bien-être.",
      image: "/official/mallette-handicap.jpg",
      isPoster: true,
    },
    {
      slug: "accueil-stagiaires",
      date: "19.10.2026",
      category: "Vie associative",
      title: "Transmettre aussi aux jeunes",
      excerpt:
        "L’association accueille des stagiaires et leur fait découvrir le fonctionnement d’un projet solidaire.",
      image: "/official/equipe-stagiaires.jpg",
    },
    {
      slug: "handi-zumba-octobre",
      date: "17.10.2026",
      category: "Activité",
      title: "Séance découverte Handi’Zumba à Orléans",
      excerpt:
        "Bouger, s’amuser et se dépasser ensemble avec la coach Nassima à L’Argonaute.",
      image: "/official/handi-zumba.jpg",
      isPoster: true,
      bodyParagraphs: [
        "L’association Un sourire pour Tissem et tous les enfants organise des séances découvertes Handi’Zumba animées par la coach Nassima à L’Argonaute d’Orléans.",
      ],
      highlightsTitle: "Informations pratiques & affiche :",
      highlights: [
        "Tarif : Gratuit pour tous les enfants en situation de handicap",
        "Coach : Nassima",
        "Lieu : L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans (quartier de l'Argonne)",
        "Horaires : 14h30 à 15h30",
        "Inscriptions : Obligatoire sur HelloAsso ou au 06 17 03 70 95",
      ],
    },
    {
      slug: "vivre-ensemble",
      date: "30.09.2026",
      category: "Rencontre",
      title: "Tous différents, tous ensemble",
      excerpt:
        "Des sorties, des activités adaptées et des temps collectifs pour parler d’inclusion autrement.",
      image: "/actions/action-052.jpg",
    },
  ],
  galleryPage: {
    heroTitle: "Des moments, pas une vitrine.",
    heroLede:
      "Les actions, sorties, ateliers et rencontres qui font vivre l’association, en images.",
  },
  gallery: DEFAULT_GALLERY,
  donation: {
    heroTitle: "Soutenir une action concrète.",
    heroLede:
      "Votre générosité aide l’association à développer ses activités auprès des enfants et des familles.",
    eyebrow: "À quoi sert votre soutien ?",
    title: "Du matériel, des activités, des rencontres.",
    intro:
      "Les dons permettent de préparer des outils adaptés, d’organiser des séances inclusives et d’accompagner les projets de l’association.",
    bullets: [
      "Matériel sensoriel et pédagogique (Mallette Handi’Cap)",
      "Activités sportives inclusives (Handi’Zumba, sport solidaire à L’Argonaute)",
      "Actions de sensibilisation et accompagnement des familles",
    ],
    panelLabel: "Choisir un montant indicatif",
    secureNoteTitle: "Collecte sécurisée sur HelloAsso.",
    secureNoteText:
      "Le paiement et les coordonnées bancaires sont entièrement gérés sur la plateforme officielle.",
    eventsEyebrow: "Sur HelloAsso",
    eventsTitle: "Les campagnes et événements de l’association.",
    eventsIntro:
      "Chaque carte ouvre la page officielle correspondante. Les événements passés restent visibles comme témoignage des actions menées.",
  },
  helloAssoActions: [
    {
      type: "Collecte en cours",
      title: "100 000 € pour faire grandir les sourires",
      description:
        "Une campagne pour financer un local associatif, des activités inclusives, du matériel adapté et des temps de répit pour les familles.",
      image: "/actions/action-071.jpg",
      url: `${DEFAULT_HELLOASSO_URL}/collectes/100000-euros-pour-faire-grandir-les-sourires`,
      cta: "Soutenir la campagne",
    },
    {
      type: "Événement terminé · 17 oct. 2026",
      title: "Séance découverte Handi’Zumba",
      description:
        "Une heure de danse accessible aux enfants en situation de handicap, pour bouger, se défouler et partager un moment joyeux.",
      image: "/official/handi-zumba.jpg",
      url: `${DEFAULT_HELLOASSO_URL}/evenements/seance-decouverte-handi-zumba`,
      cta: "Voir la page officielle",
    },
    {
      type: "Événement terminé · 11 oct. 2026",
      title: "Séance découverte Zumba Kids",
      description:
        "Un après-midi de danse, d’énergie et de plaisir proposé aux enfants de 7 à 8 ans à L’Argonaute d’Orléans.",
      image: "/actions/action-051.jpg",
      url: `${DEFAULT_HELLOASSO_URL}/evenements/seance-decouverte-zumba-kids`,
      cta: "Voir la page officielle",
    },
    {
      type: "Événement terminé · 10 oct. 2026",
      title: "Zumba, renforcement & stretching",
      description:
        "Une séance découverte 100 % femmes réunissant Zumba, renforcement musculaire et stretching à L’Argonaute.",
      image: "/actions/action-035.jpg",
      url: `${DEFAULT_HELLOASSO_URL}/evenements/seance-decouverte-zumba-et-stretching`,
      cta: "Voir la page officielle",
    },
  ],
  contact: {
    heroTitle: "Parlons de votre idée.",
    heroLede:
      "Une question sur une activité, une proposition de partenariat ou l’envie de devenir bénévole ?",
    eyebrow: "Contact & coordonnées",
    title: "Nous sommes basés dans le Loiret.",
    intro: "Pour les informations sur les activités et inscriptions :",
    venueTitle: "Lieu de certaines activités",
    venueLines: [
      "L’Argonaute",
      "73 boulevard Marie Stuart",
      "45100 Orléans",
    ],
    hqTitle: "Siège social",
    hqLines: [
      "48 Rue de Monteloup",
      "45380 La Chapelle-Saint-Mesmin",
    ],
  },
  legal: {
    heroTitle: "Mentions légales & confidentialité.",
    heroLede: "Transparence, cadre juridique et respect de la vie privée.",
    sections: [
      {
        eyebrow: "Éditeur",
        title: "1. Identification de l’association",
        paragraphs: [
          "Dénomination : Association Un sourire pour Tissem et tous les enfants",
          "Forme juridique : Association loi 1901 à but non lucratif (déclarée en mars 2016)",
          "Numéro RNA : W452013082 (Préfecture du Loiret)",
          "SIREN : 895 052 363 · SIRET : 895 052 363 00010",
          "Siège social : 48 Rue de Monteloup, 45380 La Chapelle-Saint-Mesmin, France",
          "Présidente & Directrice de la publication : Jamila Tighadouini",
          "Téléphone : 06 17 03 70 95",
          "Lieu des activités régulières : L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans",
        ],
      },
      {
        eyebrow: "Hébergement",
        title: "2. Hébergement du site",
        paragraphs: [
          "Ce site est hébergé sur des infrastructures cloud sécurisées conformes aux normes européennes de protection des données (RGPD).",
        ],
      },
      {
        eyebrow: "Dons & Paiements",
        title: "3. Collecte de dons et paiements sécurisés",
        paragraphs: [
          "Les dons et adhésions sont collectés via la plateforme officielle agréée HelloAsso. Aucune coordonnée bancaire n’est stockée ou traitée par le présent site web.",
        ],
      },
      {
        eyebrow: "RGPD",
        title: "4. Protection des données personnelles",
        paragraphs: [
          "Les données transmises via le formulaire de contact sont strictement utilisées pour répondre aux demandes des utilisateurs. Elles ne sont ni cédées, ni vendues. Vous disposez d’un droit d’accès, de rectification et d’effacement en contactant directement l’association.",
        ],
      },
      {
        eyebrow: "Propriété",
        title: "5. Propriété intellectuelle",
        paragraphs: [
          "L’ensemble des contenus, textes, photographies d’activités et visuels (notamment la Mallette Handi’Cap) sont la propriété de l’association ou diffusés avec accord. Toute reproduction non autorisée est interdite.",
        ],
      },
    ],
  },
};

export function mergeSiteContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  if (!partial || typeof partial !== "object") return DEFAULT_SITE_CONTENT;
  return {
    brand: { ...DEFAULT_SITE_CONTENT.brand, ...(partial.brand || {}) },
    home: {
      ...DEFAULT_SITE_CONTENT.home,
      ...(partial.home || {}),
      values: Array.isArray(partial.home?.values) && partial.home.values.length > 0
        ? partial.home.values
        : DEFAULT_SITE_CONTENT.home.values,
    },
    association: {
      ...DEFAULT_SITE_CONTENT.association,
      ...(partial.association || {}),
      pillars: Array.isArray(partial.association?.pillars) && partial.association.pillars.length > 0
        ? partial.association.pillars
        : DEFAULT_SITE_CONTENT.association.pillars,
    },
    actionsPage: {
      ...DEFAULT_SITE_CONTENT.actionsPage,
      ...(partial.actionsPage || {}),
    },
    actions: Array.isArray(partial.actions) ? partial.actions : DEFAULT_SITE_CONTENT.actions,
    newsPage: {
      ...DEFAULT_SITE_CONTENT.newsPage,
      ...(partial.newsPage || {}),
    },
    news: Array.isArray(partial.news) ? partial.news : DEFAULT_SITE_CONTENT.news,
    galleryPage: {
      ...DEFAULT_SITE_CONTENT.galleryPage,
      ...(partial.galleryPage || {}),
    },
    gallery: Array.isArray(partial.gallery) ? partial.gallery : DEFAULT_SITE_CONTENT.gallery,
    donation: {
      ...DEFAULT_SITE_CONTENT.donation,
      ...(partial.donation || {}),
      bullets: Array.isArray(partial.donation?.bullets)
        ? partial.donation.bullets
        : DEFAULT_SITE_CONTENT.donation.bullets,
    },
    helloAssoActions: Array.isArray(partial.helloAssoActions)
      ? partial.helloAssoActions
      : DEFAULT_SITE_CONTENT.helloAssoActions,
    contact: {
      ...DEFAULT_SITE_CONTENT.contact,
      ...(partial.contact || {}),
      venueLines: Array.isArray(partial.contact?.venueLines)
        ? partial.contact.venueLines
        : DEFAULT_SITE_CONTENT.contact.venueLines,
      hqLines: Array.isArray(partial.contact?.hqLines)
        ? partial.contact.hqLines
        : DEFAULT_SITE_CONTENT.contact.hqLines,
    },
    legal: {
      ...DEFAULT_SITE_CONTENT.legal,
      ...(partial.legal || {}),
      sections: Array.isArray(partial.legal?.sections)
        ? partial.legal.sections
        : DEFAULT_SITE_CONTENT.legal.sections,
    },
  };
}
