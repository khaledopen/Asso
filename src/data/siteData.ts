import type { Action, NewsItem, GalleryItem, NavItem } from "../types";

export const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=82`;

export const INSTAGRAM_URL = "https://www.instagram.com/un_sourire_pour_tissem";
export const INSTAGRAM_HANDLE = "@un_sourire_pour_tissem";
export const HELLOASSO_URL = "https://www.helloasso.com/associations/association-un-sourire-pour-tissem-et-tous-les-enfants";
export const HELLOASSO_DONATION_URL = "https://www.helloasso.com/associations/association-un-sourire-pour-tissem-et-tous-les-enfants/formulaires/1";

export const ASSOCIATION_INFO = {
  name: "Un sourire pour Tissem et tous les enfants",
  shortName: "Un sourire pour Tissem",
  president: "Jamila Tighadouini",
  foundationYear: "2016",
  legalStatus: "Association loi 1901 à but non lucratif",
  rna: "W452013082",
  siren: "895 052 363",
  siret: "895 052 363 00010",
  address: "48 Rue de Monteloup",
  postalCode: "45380",
  city: "La Chapelle-Saint-Mesmin",
  region: "Loiret (Centre-Val de Loire, métropole d'Orléans)",
  instagram: INSTAGRAM_HANDLE,
  instagramUrl: INSTAGRAM_URL,
  helloAssoUrl: HELLOASSO_URL,
};

export const actions: Action[] = [
  {
    slug: "handi-boxe-feminine",
    title: "Handi’Boxe & Boxe Féminine",
    image: img("photo-1549060279-7e168fcee0c2"),
    short: "Des séances de sport inclusif et de boxe pour développer la confiance, le souffle et le plaisir d’être ensemble.",
    detail: "Pensée pour toutes et tous, cette activité favorise l'inclusion, la motricité, la canalisation de l'énergie et la confiance en soi. Des cours inclusifs et des sessions féminines conviviales sont régulièrement organisés pour rompre l'isolement et partager de belles valeurs sportives.",
  },
  {
    slug: "handi-zumba",
    title: "Handi’Zumba & Expression Corporelle",
    image: img("photo-1503454537195-1dcabb73ffb9"),
    short: "Bouger, danser et s’amuser au rythme de la musique dans une ambiance chaleureuse et bienveillante.",
    detail: "Des sessions adaptées au rythme de chaque enfant et participant. La musique et le mouvement permettent de libérer les émotions, d'encourager la coordination et surtout de créer d'immenses moments de joie collective.",
  },
  {
    slug: "accompagnement-familles",
    title: "Soutien & Entraide aux Familles",
    image: img("photo-1577896851231-70ef18881754"),
    short: "Aide administrative (MDPH, démarches), écoute sans jugement et solidarité entre parents d’enfants extraordinaires.",
    detail: "Le quotidien avec un enfant en situation de handicap peut être un parcours du combattant. L'association accompagne les familles pour leurs démarches administratives, dossiers d'aides et propose des temps d'échange chaleureux pour que personne ne se sente seul.",
  },
  {
    slug: "sorties-evenements-inclusifs",
    title: "Sorties & Événements Solidaires",
    image: img("photo-1484820540004-14229fe36ca4"),
    short: "Des journées récréatives, rencontres en plein air et festivités conçues pour illuminer le quotidien des enfants.",
    detail: "Pour que chaque enfant puisse vivre des moments magiques : sorties culturelles, journées du sourire, fêtes solidaires et ateliers partagés en famille. Ces événements renforcent les liens et favorisent un vrai regard inclusif.",
  },
  {
    slug: "mallette-pedagogique",
    title: "Mallette Handi’Cap & Ateliers Sensoriels",
    image: img("photo-1596461404969-9ae70f2830c1"),
    short: "Du matériel sensoriel et des jeux adaptés pour favoriser l’éveil, la communication et l’autonomie.",
    detail: "Mise à disposition de matériel pédagogique et d'outils sensoriels adaptés aux enfants ayant des besoins spécifiques. Un accompagnement concret pour progresser dans l'autonomie et le bien-être.",
  },
];

export const news: NewsItem[] = [
  {
    slug: "suivez-nous-sur-instagram",
    title: "Rejoignez la communauté sur Instagram @un_sourire_pour_tissem",
    date: "En continu",
    category: "Réseaux Sociaux",
    image: img("photo-1611162617213-7d7a39e9b1d7"),
    excerpt: "Photos des séances, vidéos des entraînements, sourires des enfants et actualités en direct : suivez nos stories quotidiennes sur Instagram !",
  },
  {
    slug: "seances-sport-inclusif-orleans",
    title: "Séances de sport inclusif et bien-être à La Chapelle-Saint-Mesmin",
    date: "10 octobre 2026",
    category: "Activités",
    image: img("photo-1549060279-7e168fcee0c2"),
    excerpt: "Reprise des entraînements avec des activités adaptées à toutes et tous : dépassement de soi, rires et énergie positive au rendez-vous.",
  },
  {
    slug: "permanences-accompagnement-familles",
    title: "Accompagnement des familles : aide aux démarches et écoute",
    date: "25 septembre 2026",
    category: "Solidarité",
    image: img("photo-1577896851231-70ef18881754"),
    excerpt: "Besoin de conseils pour un dossier ou simplement envie d'échanger avec d'autres parents ? L'association reste mobilisée à vos côtés.",
  },
  {
    slug: "campagne-adhesions-dons-helloasso",
    title: "Adhésions & Dons : soutenez l'association sur HelloAsso",
    date: "1 septembre 2026",
    category: "Soutien",
    image: img("photo-1532629345422-7515f3d16bb6"),
    excerpt: "Chaque don ou adhésion permet de financer du matériel adapté, des ateliers et des activités pour les enfants.",
  },
];

export const gallery: GalleryItem[] = [
  { src: img("photo-1504151932400-72d4384f04b3"), alt: "Sourires et joie partagés lors d’un événement solidaire", category: "Événements" },
  { src: img("photo-1549060279-7e168fcee0c2"), alt: "Séance d'activité sportive inclusive et dynamique", category: "Sport Inclusif" },
  { src: img("photo-1503454537195-1dcabb73ffb9"), alt: "Enfant souriant et épanoui pendant une activité", category: "Activités" },
  { src: img("photo-1577896851231-70ef18881754"), alt: "Moment d'échange et d'apprentissage bienveillant", category: "Ateliers" },
  { src: img("photo-1484820540004-14229fe36ca4"), alt: "Rencontre solidaire et chaleureuse en groupe", category: "Événements" },
  { src: img("photo-1596461404969-9ae70f2830c1"), alt: "Matériel sensoriel et jeux ludiques adaptés", category: "Matériel Adapté" },
];

export const nav: NavItem[] = [
  { to: "/", label: "Accueil" },
  { to: "/association", label: "L’Association" },
  { to: "/actions", label: "Nos Actions" },
  { to: "/actualites", label: "Actualités" },
  { to: "/galerie", label: "Galerie" },
  { to: "/contact", label: "Contact" },
];
