import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ChevronLeft, ChevronRight, Menu, Play, Search, ShieldCheck, X } from "lucide-react";
import { ContentProvider, useSiteContent } from "./context/ContentContext";
import Admin from "./pages/Admin";
import type { ActionItem, ValueItem } from "./data/siteContent";

const nav = [
  ["/", "Accueil"],
  ["/association", "L’association"],
  ["/actions", "Nos actions"],
  ["/actualites", "Actualités"],
  ["/galerie", "Galerie"],
  ["/contact", "Contact"],
];

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("0") && digits.length === 10) {
    return `tel:+33${digits.slice(1)}`;
  }
  return `tel:${digits}`;
}

function Mark({ kind = "smile" }: { kind?: ValueItem["kind"] }) {
  if (kind === "spark") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c1 18 10 27 28 28-18 1-27 10-28 28-1-18-10-27-28-28 18-1 27-10 28-28Z"/></svg>;
  if (kind === "people") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="19" r="8"/><circle cx="44" cy="22" r="6"/><path d="M6 54c2-14 8-21 17-21s15 7 17 21M37 51c1-10 5-15 12-15 5 0 9 4 11 12"/></svg>;
  if (kind === "move") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="36" cy="10" r="6"/><path d="m30 21-8 13 13 7 8-12m-11-8 13 3 7 10M35 41l-9 17m12-15 13 13"/></svg>;
  return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M10 22c7-15 22-15 22 0 0-15 15-15 22 0 4 12-9 24-22 34C19 46 6 34 10 22Z"/><path d="M21 32c7 7 15 7 22 0"/></svg>;
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>;
}

function Logo() {
  const { content } = useSiteContent();
  return (
    <Link to="/" className="brand" aria-label={`${content.brand.siteName} — Accueil`}>
      <img src={content.brand.logo} alt={`Logo ${content.brand.siteName}`}/>
      <span>
        <b>{content.brand.siteName}</b>
        <small>{content.brand.siteSubtitle}</small>
      </span>
    </Link>
  );
}

function Header() {
  const { content } = useSiteContent();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo/>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? "active" : ""}>
              {label}
            </NavLink>
          ))}
          <div className="nav-socials">
            {content.brand.instagramUrl && (
              <a href={content.brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="insta-link" title="Instagram @un_sourire_pour_tissem" aria-label="Instagram">
                <InstagramIcon size={19}/>
              </a>
            )}
            {content.brand.tiktokUrl && (
              <a href={content.brand.tiktokUrl} target="_blank" rel="noopener noreferrer" className="insta-link" title="TikTok @unsourirepourtissem" aria-label="TikTok">
                <TikTokIcon size={19}/>
              </a>
            )}
          </div>
          <Link to="/faire-un-don" className="donate-link">Faire un don <span>↗</span></Link>
        </nav>
        <button className="menu-button" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label="Ouvrir le menu">
          {open ? <X/> : <Menu/>}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} aria-label="Navigation mobile">
            <div>
              {nav.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
              <div className="mobile-socials">
                {content.brand.instagramUrl && (
                  <a href={content.brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="insta-link" title="Instagram" aria-label="Instagram">
                    <InstagramIcon size={20}/>
                  </a>
                )}
                {content.brand.tiktokUrl && (
                  <a href={content.brand.tiktokUrl} target="_blank" rel="noopener noreferrer" className="insta-link" title="TikTok" aria-label="TikTok">
                    <TikTokIcon size={20}/>
                  </a>
                )}
              </div>
              <Link to="/faire-un-don">Faire un don</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const { content } = useSiteContent();
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Logo/>
            <p>{content.brand.footerDescription}</p>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#aaa0a5" }}>{content.brand.footerLegal}</p>
          </div>
          <div>
            <span className="footer-label">Explorer</span>
            {nav.slice(1).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
            <Link to="/mentions-legales">Mentions légales</Link>
          </div>
          <div>
            <span className="footer-label">Nous retrouver</span>
            <p><b>Orléans et le Loiret</b><br/>{content.brand.footerAddress}</p>
            <p>Informations : <a href={phoneHref(content.brand.phone)}>{content.brand.phone}</a></p>
            <p style={{ marginTop: "12px" }}>
              <a href={content.brand.helloassoUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#ff86b7", fontSize: "13px", fontWeight: 600 }}>
                Page officielle HelloAsso ↗
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {content.brand.siteName}</span>
          <div><Link to="/mentions-legales" style={{ color: "inherit" }}>Mentions légales & RGPD</Link></div>
          <span>{content.brand.footerTagline}</span>
        </div>
      </div>
    </footer>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pathname]);
  return null;
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 34, filter: "blur(7px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-70px" }} transition={{ duration: .72, delay, ease: [.22, 1, .36, 1] }}>
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow"><span/> {children}</p>;
}

function Intro({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="section-intro">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ArrowLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <Link to={to} className="arrow-link">{children}<ArrowRight size={17}/></Link>;
}

function PageHero({
  index,
  title,
  lede,
  eyebrow,
}: {
  index?: string;
  title: string;
  lede: string;
  eyebrow?: string;
}) {
  const { content } = useSiteContent();
  const isDate = Boolean(index && index.includes("."));
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {index && <span className={isDate ? "hero-date-badge" : "hero-number"}>{index}</span>}
        <div className="page-hero-content">
          <Eyebrow>{eyebrow || content.brand.siteName}</Eyebrow>
          <h1>{title}</h1>
          <p>{lede}</p>
        </div>
      </div>
    </section>
  );
}

function ActionRow({ action, reverse = false }: { action: ActionItem; reverse?: boolean }) {
  const isPoster = Boolean(action.isPoster || action.slug === "handi-zumba" || action.slug === "mallette-handicap");
  return (
    <article className={`action-row ${reverse ? "reverse" : ""}`}>
      <motion.div
        className={`action-image ${isPoster ? "framed-action" : ""}`}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true }}
        transition={{ duration: .85, ease: [.22, 1, .36, 1] }}
      >
        <motion.img
          src={action.image}
          alt={action.title}
          loading="lazy"
          className={isPoster ? "action-poster" : "action-photo"}
          initial={{ scale: 1.04 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.15, ease: [.22, 1, .36, 1] }}
        />
        <span>{action.number}</span>
      </motion.div>
      <div className="action-copy">
        <p className="micro">{action.kicker}</p>
        <h3>{action.title}</h3>
        <p>{action.short}</p>
        <ArrowLink to={`/actions/${action.slug}`}>Découvrir l’action</ArrowLink>
      </div>
    </article>
  );
}

function Home() {
  const { content } = useSiteContent();
  const h = content.home;
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner">
          <motion.div className="hero-copy" initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
            <h1>{h.heroTitlePrefix} <em>{h.heroTitleEmphasis}</em></h1>
            <p>{h.heroSubtitle}</p>
            <div className="hero-actions">
              <Link to="/actions" className="solid-button">{h.heroPrimaryCta} <ArrowRight size={17}/></Link>
              <Link to="/association" className="text-button">{h.heroSecondaryCta}</Link>
            </div>
          </motion.div>
          <motion.div className="hero-collage" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .08, ease: [.22, 1, .36, 1] }}>
            <img className="hero-main" src={h.heroMainImage} alt={h.heroMainAlt}/>
            <img className="hero-detail" src={h.heroDetailImage} alt={h.heroDetailAlt}/>
            <div className="hero-note">
              <Mark kind="smile"/>
              <span>{h.heroNote}</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Reveal>
        <section className="manifesto">
          <div className="manifesto-inner">
            <span className="big-number">{h.manifestoYear}</span>
            <div>
              <Eyebrow>{h.manifestoEyebrow}</Eyebrow>
              <p>{h.manifestoText}</p>
            </div>
            <Mark kind="spark"/>
          </div>
        </section>
      </Reveal>
      <section className="actions-section">
        <Intro eyebrow={h.actionsEyebrow} title={h.actionsTitle} text={h.actionsText}/>
        <div>
          {content.actions.slice(0, 3).map((action, i) => (
            <Reveal key={action.slug}><ActionRow action={action} reverse={i % 2 === 1}/></Reveal>
          ))}
        </div>
      </section>
      <Reveal>
        <section className="values-band">
          <div className="values-inner">
            {h.values.map((val, idx) => (
              <div key={idx}><Mark kind={val.kind}/><span>{val.title}</span><p>{val.text}</p></div>
            ))}
          </div>
        </section>
      </Reveal>
      <section className="news-section">
        <div className="news-heading">
          <Intro eyebrow={h.newsEyebrow} title={h.newsTitle}/>
          <ArrowLink to="/actualites">{h.newsLinkLabel}</ArrowLink>
        </div>
        <div className="news-strip">
          {content.news.slice(0, 3).map((item) => (
            <Reveal key={item.slug}>
              <article className="news-card">
                <Link to={`/actualites/${item.slug}`}>
                  <div className="card-media">
                    <img src={item.image} alt={item.title} loading="lazy"/>
                    {item.video && (
                      <span className="media-badge">
                        <Play size={12} fill="currentColor"/> Vidéo
                      </span>
                    )}
                  </div>
                  <span className="news-meta">{item.date} — {item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <Reveal>
        <section className="support">
          <div className="support-inner">
            <Mark kind="spark"/>
            <div>
              <Eyebrow>{h.supportEyebrow}</Eyebrow>
              <h2>{h.supportTitle}</h2>
            </div>
            <Link to="/faire-un-don" className="light-button">{h.supportButtonLabel} <ArrowRight size={17}/></Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function Association() {
  const { content } = useSiteContent();
  const a = content.association;
  return (
    <main>
      <PageHero index="01" title={a.heroTitle} lede={a.heroLede}/>
      <Reveal>
        <section className="story-layout">
          <div className="story-photo">
            <img src={a.storyImage} alt={a.storyAlt} loading="lazy"/>
          </div>
          <div className="story-copy">
            <Eyebrow>{a.storyEyebrow}</Eyebrow>
            <h2>{a.storyTitle}</h2>
            <p>{a.storyText}</p>
            <blockquote>{a.storyQuote}</blockquote>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="editorial-grid">
          {a.pillars.map((pil) => (
            <div key={pil.number}>
              <span>{pil.number}</span>
              <h3>{pil.title}</h3>
              <p>{pil.text}</p>
            </div>
          ))}
        </section>
      </Reveal>
      <Reveal>
        <section className="plain-cta">
          <div>
            <Eyebrow>{a.ctaEyebrow}</Eyebrow>
            <h2>{a.ctaTitle}</h2>
          </div>
          <ArrowLink to="/contact">{a.ctaLinkLabel}</ArrowLink>
        </section>
      </Reveal>
    </main>
  );
}

function Actions() {
  const { content } = useSiteContent();
  return (
    <main>
      <PageHero index="02" title={content.actionsPage.heroTitle} lede={content.actionsPage.heroLede}/>
      <section className="actions-page">
        {content.actions.map((a, i) => (
          <Reveal key={a.slug}><ActionRow action={a} reverse={i % 2 === 1}/></Reveal>
        ))}
      </section>
    </main>
  );
}

function ActionDetail() {
  const { content } = useSiteContent();
  const { slug } = useParams();
  const a = content.actions.find(x => x.slug === slug);
  if (!a) return <NotFound/>;
  const isZumba = a.slug === "handi-zumba";
  const isPoster = Boolean(a.isPoster || isZumba || a.slug === "mallette-handicap");
  return (
    <main>
      <PageHero index={a.number} title={a.title} lede={a.kicker}/>
      <div className="detail-wrapper">
        <div className="back-bar">
          <Link to="/actions" className="back-link">
            <ChevronLeft size={18}/> Retour à toutes les actions
          </Link>
        </div>
        <section className="detail-layout">
          <img
            src={a.image}
            alt={isZumba ? "Affiche officielle Handi'Zumba - Un sourire pour Tissem" : a.title}
            className={isPoster ? "detail-poster" : "detail-photo"}
          />
          <div>
            <Eyebrow>{isZumba ? "Affiche & informations officielles" : "Ce que nous faisons"}</Eyebrow>
            <h2>{a.short}</h2>
            <p>{a.detail}</p>
            {a.highlights && a.highlights.length > 0 ? (
              <>
                <div className="fact-note" style={{ marginTop: "24px", background: "var(--blush)", padding: "18px 22px", borderRadius: "0 12px 12px 0" }}>
                  {a.highlightsTitle && (
                    <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--deep)", marginBottom: "8px" }}>{a.highlightsTitle}</p>
                  )}
                  <ul style={{ display: "grid", gap: "6px", fontSize: "13.5px", lineHeight: 1.5, paddingLeft: "18px", color: "var(--ink)" }}>
                    {a.highlights.map((line, i) => <li key={i}>{line}</li>)}
                  </ul>
                </div>
                {isZumba && (
                  <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--muted)" }}>
                    <strong>Inscriptions obligatoires :</strong> sur HelloAsso ou au <a href={phoneHref(content.brand.phone)} style={{ fontWeight: 600, color: "var(--deep)" }}>{content.brand.phone}</a>.
                  </p>
                )}
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "24px", flexWrap: "wrap" }}>
                  <a href={content.brand.helloassoUrl} target="_blank" rel="noopener noreferrer" className="solid-button">S’inscrire sur HelloAsso ↗</a>
                  <ArrowLink to="/contact">Nous contacter</ArrowLink>
                </div>
              </>
            ) : (
              <>
                <div className="fact-note">
                  Les dates et modalités d’inscription sont communiquées pour chaque rendez-vous. Contactez l’association pour connaître la prochaine session.
                </div>
                <ArrowLink to="/contact">Demander des informations</ArrowLink>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Actualites() {
  const { content } = useSiteContent();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Toutes");
  const cats = ["Toutes", ...new Set(content.news.map(n => n.category))];
  const filtered = useMemo(
    () => content.news.filter(n => (cat === "Toutes" || n.category === cat) && `${n.title} ${n.excerpt}`.toLowerCase().includes(q.toLowerCase())),
    [content.news, q, cat],
  );
  return (
    <main>
      <PageHero index="03" title={content.newsPage.heroTitle} lede={content.newsPage.heroLede}/>
      <section className="news-page">
        <div className="filter-bar">
          <label>
            <Search size={18}/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher"/>
            <span className="sr-only">Rechercher une actualité</span>
          </label>
          <div>
            {cats.map(c => <button key={c} onClick={() => setCat(c)} className={cat === c ? "active" : ""}>{c}</button>)}
          </div>
        </div>
        <div className="journal-grid">
          {filtered.map(n => (
            <article key={n.slug}>
              <Link to={`/actualites/${n.slug}`}>
                <div className="card-media">
                  <img src={n.image} alt={n.title} loading="lazy"/>
                  {n.video && (
                    <span className="media-badge">
                      <Play size={12} fill="currentColor"/> Vidéo
                    </span>
                  )}
                </div>
                <span>{n.date} — {n.category}</span>
                <h2>{n.title}</h2>
                <p>{n.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function NewsDetail() {
  const { content } = useSiteContent();
  const { slug } = useParams();
  const n = content.news.find(x => x.slug === slug);
  if (!n) return <NotFound/>;
  const isZumba = n.slug === "handi-zumba-octobre";
  const isPoster = Boolean(n.isPoster || isZumba || n.slug === "mallette-handicap-novembre");
  const isSalon = n.slug === "salon-solidaire";
  const paragraphs = n.bodyParagraphs || [];
  return (
    <main>
      <PageHero
        index={n.date}
        eyebrow={`Actualité · ${n.category}`}
        title={n.title}
        lede={n.excerpt}
      />
      <div className="detail-wrapper">
        <div className="back-bar">
          <Link to="/actualites" className="back-link">
            <ChevronLeft size={18}/> Retour à toutes les actualités
          </Link>
        </div>
        <article className="article-page">
          {n.video ? (
            <div className="detail-media-column">
              <div className="detail-video-wrapper">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={n.image}
                  className="detail-video"
                >
                  <source src={n.video} type="video/mp4"/>
                  Votre navigateur ne supporte pas la lecture de vidéos MP4.
                </video>
                <div className="video-caption">
                  <Play size={14} fill="currentColor"/>
                  <span>{n.videoCaption || "Vidéo de l’événement"}</span>
                </div>
              </div>
              {n.substripImages && n.substripImages.length > 0 && (
                <div className="detail-photo-substrip">
                  {n.substripImages.map((src, i) => (
                    <img key={i} src={src} alt={n.title} loading="lazy"/>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <img
              src={n.image}
              alt={isZumba ? "Affiche officielle Handi'Zumba - Un sourire pour Tissem" : n.title}
              className={isPoster ? "detail-poster" : "detail-photo"}
            />
          )}
          <div>
            <Eyebrow>Actualité de l’association · {n.category}</Eyebrow>
            <p className="article-lead">{n.excerpt}</p>
            {paragraphs.length > 0 ? (
              <>
                {paragraphs[0] && <p>{paragraphs[0]}</p>}
                {n.highlights && n.highlights.length > 0 && (
                  <div className="fact-note" style={{ marginTop: "20px", background: "var(--blush)", padding: "18px 22px", borderRadius: "0 12px 12px 0" }}>
                    {n.highlightsTitle && (
                      <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--deep)", marginBottom: "8px" }}>{n.highlightsTitle}</p>
                    )}
                    <ul style={{ display: "grid", gap: "6px", fontSize: "13.5px", lineHeight: 1.5, paddingLeft: "18px", color: "var(--ink)" }}>
                      {n.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}
                {isSalon && paragraphs.length > 1 && (
                  <h3 style={{ fontSize: "20px", marginTop: "26px", marginBottom: "10px", color: "var(--ink)" }}>Revivez l’ambiance en vidéo</h3>
                )}
                {paragraphs.slice(1).map((p, i) => (
                  <p key={i} style={i > 0 ? { marginTop: "12px" } : undefined}>{p}</p>
                ))}
                <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "28px", flexWrap: "wrap" }}>
                  {isZumba ? (
                    <>
                      <a href={content.brand.helloassoUrl} target="_blank" rel="noopener noreferrer" className="solid-button">S’inscrire sur HelloAsso ↗</a>
                      <ArrowLink to="/contact">Nous poser une question</ArrowLink>
                    </>
                  ) : (
                    <>
                      <Link to="/faire-un-don" className="solid-button">Soutenir nos actions ↗</Link>
                      <ArrowLink to="/actions/mallette-handicap">Découvrir la Mallette Handi’Cap</ArrowLink>
                      <ArrowLink to="/contact">Rejoindre l’équipe</ArrowLink>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <p>Cette actualité reprend une action publiée par l’association. Pour les prochaines dates et les modalités à jour, contactez directement l’équipe.</p>
                <ArrowLink to="/contact">Contacter l’association</ArrowLink>
              </>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}

function Galerie() {
  const { content } = useSiteContent();
  const [selected, setSelected] = useState<number | null>(null);
  const [category, setCategory] = useState("Toutes");
  const [page, setPage] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const itemsPerPage = 12;
  const categories = useMemo(
    () => ["Toutes", ...Array.from(new Set(content.gallery.map(item => item.label)))],
    [content.gallery],
  );
  const shown = useMemo(
    () => category === "Toutes" ? content.gallery : content.gallery.filter(item => item.label === category),
    [content.gallery, category],
  );
  const pageCount = Math.max(1, Math.ceil(shown.length / itemsPerPage));
  const safePage = Math.min(page, pageCount);
  const pageStart = (safePage - 1) * itemsPerPage;
  const paged = shown.slice(pageStart, pageStart + itemsPerPage);

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    setSelected(null);
    window.requestAnimationFrame(() => document.querySelector(".gallery-section")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowLeft") setSelected(prev => prev !== null ? (prev - 1 + shown.length) % shown.length : null);
      if (e.key === "ArrowRight") setSelected(prev => prev !== null ? (prev + 1) % shown.length : null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, shown.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const distance = touchStartX - e.changedTouches[0].clientX;
    if (distance > 45) {
      setSelected(prev => prev !== null ? (prev + 1) % shown.length : null);
    } else if (distance < -45) {
      setSelected(prev => prev !== null ? (prev - 1 + shown.length) % shown.length : null);
    }
    setTouchStartX(null);
  };

  return (
    <main>
      <PageHero index="04" title={content.galleryPage.heroTitle} lede={content.galleryPage.heroLede}/>
      <section className="gallery-section">
        <div className="gallery-filters">
          {categories.map(item => (
            <button key={item} type="button" className={category === item ? "active" : ""} onClick={() => { setCategory(item); setPage(1); setSelected(null); }}>
              {item}
            </button>
          ))}
        </div>
        <div className="gallery-grid" aria-live="polite">
          {paged.map((g, i) => (
            <motion.button
              key={`${g.src}-${pageStart + i}`}
              type="button"
              onClick={() => setSelected(pageStart + i)}
              className="gallery-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: .45, delay: Math.min((i % 6) * .04, .24) }}
            >
              <img src={g.src} alt={g.alt} loading="lazy"/>
            </motion.button>
          ))}
        </div>
        {pageCount > 1 && (
          <nav className="gallery-pagination" aria-label="Pagination de la galerie">
            <button type="button" className="pagination-arrow" onClick={() => changePage(safePage - 1)} disabled={safePage === 1} aria-label="Page précédente">
              <ChevronLeft size={18}/><span>Précédente</span>
            </button>
            <div>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(number => (
                <button key={number} type="button" className={number === safePage ? "active" : ""} onClick={() => changePage(number)} aria-current={number === safePage ? "page" : undefined} aria-label={`Page ${number}`}>
                  {number}
                </button>
              ))}
            </div>
            <button type="button" className="pagination-arrow" onClick={() => changePage(safePage + 1)} disabled={safePage === pageCount} aria-label="Page suivante">
              <span>Suivante</span><ChevronRight size={18}/>
            </button>
          </nav>
        )}
      </section>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selected !== null && shown[selected] && (
            <motion.div
              className="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="lightbox-topbar">
                <span className="lightbox-counter">{selected + 1} / {shown.length}</span>
                <button type="button" className="lightbox-btn lightbox-close" onClick={() => setSelected(null)} aria-label="Fermer la vue agrandie">
                  <X size={24}/>
                </button>
              </div>
              <button type="button" className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + shown.length) % shown.length); }} aria-label="Photo précédente">
                <ChevronLeft size={30}/>
              </button>
              <motion.figure key={shown[selected].src} className="lightbox-figure" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .2 }} onClick={e => e.stopPropagation()}>
                <img src={shown[selected].src} alt={shown[selected].alt}/>
              </motion.figure>
              <button type="button" className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % shown.length); }} aria-label="Photo suivante">
                <ChevronRight size={30}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </main>
  );
}

function Donation() {
  const { content } = useSiteContent();
  const d = content.donation;
  const [amount, setAmount] = useState("25 €");
  return (
    <main>
      <PageHero index="05" title={d.heroTitle} lede={d.heroLede}/>
      <Reveal>
        <section className="donation-layout">
          <div>
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2>{d.title}</h2>
            <p>{d.intro}</p>
            <ul>
              {d.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
          <div className="donation-panel">
            <span className="panel-label">{d.panelLabel}</span>
            <div className="amounts">
              {["5 €", "10 €", "25 €", "50 €", "Libre"].map(a => (
                <button key={a} className={amount === a ? "active" : ""} onClick={() => setAmount(a)}>{a}</button>
              ))}
            </div>
            {amount === "Libre" && <input inputMode="decimal" placeholder="Votre montant personnalisé (€)"/>}
            <div className="secure-note">
              <ShieldCheck size={20}/>
              <p><b>{d.secureNoteTitle}</b><br/>{d.secureNoteText}</p>
            </div>
            <a href={content.brand.donationUrl} target="_blank" rel="noopener noreferrer" className="solid-button full" style={{ textAlign: "center", justifyContent: "center", textDecoration: "none" }}>
              Continuer sur HelloAsso ({amount}) <ArrowRight size={17}/>
            </a>
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <a href={content.brand.helloassoUrl} target="_blank" rel="noopener noreferrer" className="text-button">
                Découvrir le profil de l’association ↗
              </a>
            </div>
          </div>
        </section>
      </Reveal>
      <section className="helloasso-events">
        <Reveal>
          <div className="events-heading">
            <div><Eyebrow>{d.eventsEyebrow}</Eyebrow><h2>{d.eventsTitle}</h2></div>
            <p>{d.eventsIntro}</p>
          </div>
        </Reveal>
        <div className="event-grid">
          {content.helloAssoActions.map((item, index) => (
            <Reveal key={`${item.url}-${index}`} delay={index * .06}>
              <motion.a className="event-card" href={item.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -7 }} transition={{ duration: .25 }}>
                <div className="event-card-media"><img src={item.image} alt="" loading="lazy"/><span>{item.type}</span></div>
                <div className="event-card-copy"><h3>{item.title}</h3><p>{item.description}</p><b>{item.cta} <ArrowRight size={16}/></b></div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}

const schema = z.object({
  name: z.string().min(2, "Indiquez votre nom."),
  email: z.string().email("Email invalide."),
  subject: z.string().min(3, "Précisez le sujet."),
  message: z.string().min(10, "Écrivez au moins 10 caractères."),
  consent: z.literal(true, { message: "Votre accord est nécessaire." }),
});
type FormData = z.infer<typeof schema>;

function Contact() {
  const { content } = useSiteContent();
  const c = content.contact;
  const contactEmail = content.brand.contactEmail;
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const sendMessage = async (val: FormData) => {
    if (website) { setStatus("success"); return; }
    setStatus("sending");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: val.name,
          email: val.email,
          subject: val.subject,
          message: val.message,
          consent: val.consent,
          website,
        }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Échec de l’envoi");
      }
      setStatus("success");
      reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : null);
      setStatus("error");
    }
  };

  return (
    <main>
      <PageHero index="06" title={c.heroTitle} lede={c.heroLede}/>
      <section className="contact-layout">
        <div>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2>{c.title}</h2>
          <p>{c.intro}</p>
          <a className="contact-phone" href={phoneHref(content.brand.phone)}>{content.brand.phone}</a>
          <a className="contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <p className="venue">
            <b>{c.venueTitle}</b>
            {c.venueLines.map((line, i) => <span key={i}><br/>{line}</span>)}
          </p>
          <p className="venue" style={{ marginTop: "18px" }}>
            <b>{c.hqTitle}</b>
            {c.hqLines.map((line, i) => <span key={i}><br/>{line}</span>)}
          </p>
        </div>
        <form onSubmit={handleSubmit(sendMessage)} noValidate>
          <label className="form-honeypot" aria-hidden="true">
            <span>Site internet</span>
            <input tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)}/>
          </label>
          {[["name", "Nom complet", "text"], ["email", "Adresse email", "email"], ["subject", "Sujet", "text"]].map(([key, label, type]) => (
            <label key={key}>
              <span>{label}</span>
              <input type={type} autoComplete={key === "name" ? "name" : key === "email" ? "email" : "off"} {...register(key as keyof FormData)}/>
              {errors[key as keyof FormData] && <small>{errors[key as keyof FormData]?.message}</small>}
            </label>
          ))}
          <label>
            <span>Votre message</span>
            <textarea rows={5} {...register("message")}/>
            {errors.message && <small>{errors.message.message}</small>}
          </label>
          <label className="consent">
            <input type="checkbox" {...register("consent")}/>
            <span>J’accepte que mes informations soient transmises à l’association afin de répondre à ma demande.</span>
          </label>
          {errors.consent && <small>{errors.consent.message}</small>}
          <button className="solid-button" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Envoi en cours…" : "Envoyer le message"} {status !== "sending" && <ArrowRight size={17}/>}
          </button>
          {status === "success" && (
            <div className="form-notice success" role="status">
              <p><b>Votre message a bien été envoyé.</b></p>
              <p>Un accusé de réception vient de vous être envoyé et l’association vous répondra depuis {contactEmail}.</p>
            </div>
          )}
          {status === "error" && (
            <div className="form-notice error" role="alert">
              <p><b>Le message n’a pas pu être envoyé.</b></p>
              <p>{errorMessage ? `${errorMessage} ` : ""}Vous pouvez réessayer ou écrire directement à <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</p>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

function MentionsLegales() {
  const { content } = useSiteContent();
  const l = content.legal;
  return (
    <main>
      <PageHero index="07" title={l.heroTitle} lede={l.heroLede}/>
      <div className="legal-page">
        {l.sections.map((sec, idx) => (
          <section key={idx} className="legal-section">
            <Eyebrow>{sec.eyebrow}</Eyebrow>
            <h2>{sec.title}</h2>
            {sec.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}
        <div style={{ marginTop: "30px" }}><ArrowLink to="/">Retourner à l’accueil</ArrowLink></div>
      </div>
    </main>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <span>404</span>
      <h1>Cette page n’existe pas.</h1>
      <p>Revenons à l’essentiel.</p>
      <Link to="/" className="solid-button">Retour à l’accueil</Link>
    </main>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div className="page-transition" key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .42, ease: [.22, 1, .36, 1] }}>
        <Routes location={location}>
          <Route path="/" element={<Home/>}/>
          <Route path="/association" element={<Association/>}/>
          <Route path="/actions" element={<Actions/>}/>
          <Route path="/actions/:slug" element={<ActionDetail/>}/>
          <Route path="/actualites" element={<Actualites/>}/>
          <Route path="/actualites/:slug" element={<NewsDetail/>}/>
          <Route path="/galerie" element={<Galerie/>}/>
          <Route path="/faire-un-don" element={<Donation/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/mentions-legales" element={<MentionsLegales/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <ScrollToTop/>
        <Routes>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </>
    );
  }

  return (
    <div className="site-shell">
      <ScrollToTop/>
      <Header/>
      <AnimatedRoutes/>
      <Footer/>
    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <AppShell/>
    </ContentProvider>
  );
}
