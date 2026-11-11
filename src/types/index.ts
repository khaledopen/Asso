export interface Action {
  slug: string;
  title: string;
  image: string;
  short: string;
  detail: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
}

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
}

export interface NavItem {
  to: string;
  label: string;
}

