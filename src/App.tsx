import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, ChevronLeft, ChevronRight, Menu, Play, Search, ShieldCheck, X } from "lucide-react";

const OFFICIAL = {
  logo: "/official/logo-tissem.jpg",
  mallette: "/official/mallette-handicap.jpg",
  zumba: "/official/handi-zumba.jpg",
  team: "/official/equipe-stagiaires.jpg",
  salonVideo: "/official/salon-solidaire.mp4",
};
const INSTAGRAM_URL = "https://www.instagram.com/un_sourire_pour_tissem";
const HELLOASSO_URL = "https://www.helloasso.com/associations/association-un-sourire-pour-tissem-et-tous-les-enfants";
const remote = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`;

const actions = [
  { slug:"mallette-handicap", number:"01", title:"Mallette Handi’Cap", kicker:"Inclusion · Autonomie · Bien-être", image:OFFICIAL.mallette, short:"Une mallette pensée pour sensibiliser au handicap et ouvrir, concrètement, les portes de l’inclusion.", detail:"La Mallette Handi’Cap rassemble des supports ludiques, sensoriels et pédagogiques. Elle permet d’aborder les différences avec les enfants, de mieux comprendre certaines situations de handicap et d’encourager l’autonomie." },
  { slug:"handi-zumba", number:"02", title:"Handi’Zumba", kicker:"Bouger · S’amuser · Se dépasser", image:OFFICIAL.zumba, short:"Une activité gratuite, inclusive et joyeuse, conçue pour les enfants en situation de handicap.", detail:"Avec la coach Nassima à L’Argonaute d’Orléans, Handi’Zumba transforme la danse en espace de confiance, de plaisir et de convivialité. 100% gratuit, chacun participe à son rythme, dans un cadre accueillant et accessible." },
  { slug:"sport-solidaire", number:"03", title:"Sport solidaire", kicker:"Confiance · Énergie · Partage", image:"/actions/action-051.jpg", short:"Des séances, sorties et défis collectifs pour créer du lien et rendre l’activité plus accessible.", detail:"L’association développe des rendez-vous sportifs conviviaux pour faire du mouvement un outil de bien-être, de confiance et d’inclusion." },
  { slug:"sensibilisation", number:"04", title:"Rencontres & sensibilisation", kicker:"Écouter · Comprendre · Rassembler", image:"/actions/action-059.jpg", short:"Des ateliers, événements et rencontres pour faire évoluer les regards et soutenir les familles.", detail:"Forums, jeux de sensibilisation, rencontres associatives et accueil de jeunes : l’association crée des occasions concrètes de dialoguer autour du handicap et du vivre-ensemble." },
];

const news = [
  {
    slug: "salon-solidaire",
    date: "10.11.2026",
    category: "Événement",
    title: "Au cœur du Salon Solidaire : rencontres et partage",
    excerpt: "Retour en vidéo et en images sur notre présence au Salon Solidaire : une journée d’échanges, de sensibilisation et d’énergie collective.",
    image: "/actions/action-060.jpg",
    video: OFFICIAL.salonVideo,
  },
  {
    slug: "mallette-handicap-novembre",
    date: "06.11.2026",
    category: "Projet",
    title: "La Mallette Handi’Cap prend forme",
    excerpt: "Un outil visuel et sensoriel autour de l’inclusion, de l’autonomie et du bien-être.",
    image: OFFICIAL.mallette,
  },
  {
    slug: "accueil-stagiaires",
    date: "19.10.2026",
    category: "Vie associative",
    title: "Transmettre aussi aux jeunes",
    excerpt: "L’association accueille des stagiaires et leur fait découvrir le fonctionnement d’un projet solidaire.",
    image: OFFICIAL.team,
  },
  {
    slug: "handi-zumba-octobre",
    date: "17.10.2026",
    category: "Activité",
    title: "Séance découverte Handi’Zumba à Orléans",
    excerpt: "Bouger, s’amuser et se dépasser ensemble avec la coach Nassima à L’Argonaute.",
    image: OFFICIAL.zumba,
  },
  {
    slug: "vivre-ensemble",
    date: "30.09.2026",
    category: "Rencontre",
    title: "Tous différents, tous ensemble",
    excerpt: "Des sorties, des activités adaptées et des temps collectifs pour parler d’inclusion autrement.",
    image: "/actions/action-052.jpg",
  },
];

const nav = [["/","Accueil"],["/association","L’association"],["/actions","Nos actions"],["/actualites","Actualités"],["/galerie","Galerie"],["/contact","Contact"]];

function Mark({kind="smile"}:{kind?:"smile"|"spark"|"people"|"move"}){
  if(kind==="spark") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4c1 18 10 27 28 28-18 1-27 10-28 28-1-18-10-27-28-28 18-1 27-10 28-28Z"/></svg>;
  if(kind==="people") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="19" r="8"/><circle cx="44" cy="22" r="6"/><path d="M6 54c2-14 8-21 17-21s15 7 17 21M37 51c1-10 5-15 12-15 5 0 9 4 11 12"/></svg>;
  if(kind==="move") return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><circle cx="36" cy="10" r="6"/><path d="m30 21-8 13 13 7 8-12m-11-8 13 3 7 10M35 41l-9 17m12-15 13 13"/></svg>;
  return <svg className="mark" viewBox="0 0 64 64" aria-hidden="true"><path d="M10 22c7-15 22-15 22 0 0-15 15-15 22 0 4 12-9 24-22 34C19 46 6 34 10 22Z"/><path d="M21 32c7 7 15 7 22 0"/></svg>;
}

function InstagramIcon({size=18}:{size?:number}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>}

function Logo(){return <Link to="/" className="brand" aria-label="Un sourire pour Tissem — Accueil"><img src={OFFICIAL.logo} alt="Logo Un sourire pour Tissem"/><span><b>Un sourire pour Tissem</b><small>et tous les enfants</small></span></Link>}
function Header(){const [open,setOpen]=useState(false);const {pathname}=useLocation();useEffect(()=>setOpen(false),[pathname]);return <header className="site-header"><div className="header-inner"><Logo/><nav className="desktop-nav" aria-label="Navigation principale">{nav.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?"active":""}>{label}</NavLink>)}<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="insta-link" title="Instagram @un_sourire_pour_tissem" aria-label="Instagram"><InstagramIcon size={19}/></a><Link to="/faire-un-don" className="donate-link">Faire un don <span>↗</span></Link></nav><button className="menu-button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-label="Ouvrir le menu">{open?<X/>:<Menu/>}</button></div><AnimatePresence>{open&&<motion.nav className="mobile-nav" initial={{height:0}} animate={{height:"auto"}} exit={{height:0}} aria-label="Navigation mobile"><div>{nav.map(([to,label])=><NavLink key={to} to={to}>{label}</NavLink>)}<div style={{padding:"11px 0",borderBottom:"1px solid var(--line)"}}><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="insta-link" title="Instagram" aria-label="Instagram"><InstagramIcon size={20}/></a></div><Link to="/faire-un-don">Faire un don</Link></div></motion.nav>}</AnimatePresence></header>}
function Footer(){return <footer className="site-footer"><div className="footer-inner"><div className="footer-grid"><div><Logo/><p>Une association du Loiret (loi 1901) engagée depuis 2016 auprès des enfants en situation de handicap et de leurs familles.</p><p style={{marginTop:"10px",fontSize:"12px",color:"#aaa0a5"}}>RNA : W452013082 · SIREN : 895 052 363</p></div><div><span className="footer-label">Explorer</span>{nav.slice(1).map(([to,label])=><Link key={to} to={to}>{label}</Link>)}<Link to="/mentions-legales">Mentions légales</Link></div><div><span className="footer-label">Nous retrouver</span><p><b>Orléans et le Loiret</b><br/>Certaines activités ont lieu à L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans.</p><p>Informations : <a href="tel:+33617037095">06 17 03 70 95</a></p><p style={{marginTop:"12px"}}><a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" style={{color:"#ff86b7",fontSize:"13px",fontWeight:600}}>Page officielle HelloAsso ↗</a></p></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Un sourire pour Tissem</span><div><Link to="/mentions-legales" style={{color:"inherit"}}>Mentions légales & RGPD</Link></div><span>Inclusion · Autonomie · Bien-être</span></div></div></footer>}

function ScrollToTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[pathname]);return null}
function Reveal({children,className=""}:{children:React.ReactNode,className?:string}){return <motion.div className={className} initial={{opacity:0,y:34,filter:"blur(7px)"}} whileInView={{opacity:1,y:0,filter:"blur(0px)"}} viewport={{once:true,margin:"-70px"}} transition={{duration:.72,ease:[.22,1,.36,1]}}>{children}</motion.div>}
function Eyebrow({children}:{children:React.ReactNode}){return <p className="eyebrow"><span/> {children}</p>}
function Intro({eyebrow,title,text}:{eyebrow:string,title:string,text?:string}){return <div className="section-intro"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{text&&<p>{text}</p>}</div>}
function ArrowLink({to,children}:{to:string,children:React.ReactNode}){return <Link to={to} className="arrow-link">{children}<ArrowRight size={17}/></Link>}
function PageHero({
  index,
  title,
  lede,
  eyebrow = "Un sourire pour Tissem",
}:{
  index?: string;
  title: string;
  lede: string;
  eyebrow?: string;
}){
  const isDate = Boolean(index && index.includes("."));
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        {index && <span className={isDate ? "hero-date-badge" : "hero-number"}>{index}</span>}
        <div className="page-hero-content">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1>{title}</h1>
          <p>{lede}</p>
        </div>
      </div>
    </section>
  );
}
function ActionRow({action,reverse=false}:{action:typeof actions[number],reverse?:boolean}){
  const isPoster = action.slug === "handi-zumba" || action.slug === "mallette-handicap";
  return (
    <article className={`action-row ${reverse?"reverse":""}`}>
      <motion.div
        className={`action-image ${isPoster ? "framed-action" : ""}`}
        initial={{clipPath:"inset(0 0 100% 0)"}}
        whileInView={{clipPath:"inset(0 0 0% 0)"}}
        viewport={{once:true}}
        transition={{duration:.85,ease:[.22,1,.36,1]}}
      >
        <motion.img
          src={action.image}
          alt={action.title}
          loading="lazy"
          className={isPoster ? "action-poster" : "action-photo"}
          initial={{scale:1.04}}
          whileInView={{scale:1}}
          viewport={{once:true}}
          transition={{duration:1.15,ease:[.22,1,.36,1]}}
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

function Home(){
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner">
          <motion.div className="hero-copy" initial={{opacity:0,x:-35}} animate={{opacity:1,x:0}} transition={{duration:.8,ease:[.22,1,.36,1]}}>
            <h1>Ouvrir les portes de <em>l’inclusion.</em></h1>
            <p>Nous accompagnons les enfants extraordinaires et leurs familles avec des activités qui font bouger, apprendre, rencontrer et grandir.</p>
            <div className="hero-actions">
              <Link to="/actions" className="solid-button">Voir nos actions <ArrowRight size={17}/></Link>
              <Link to="/association" className="text-button">Comprendre notre engagement</Link>
            </div>
          </motion.div>
          <motion.div className="hero-collage" initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.9,delay:.08,ease:[.22,1,.36,1]}}>
            <img className="hero-main" src="/actions/action-035.jpg" alt="Un moment inclusif lors d’un événement de l’association"/>
            <img className="hero-detail" src={OFFICIAL.mallette} alt="La Mallette Handi’Cap"/>
            <div className="hero-note">
              <Mark kind="smile"/>
              <span>Ensemble, faisons grandir leurs sourires.</span>
            </div>
          </motion.div>
        </div>
      </section>
      <Reveal>
        <section className="manifesto">
          <div className="manifesto-inner">
            <span className="big-number">2016</span>
            <div>
              <Eyebrow>Notre point de départ</Eyebrow>
              <p>Une association née d’une histoire familiale, devenue un engagement collectif auprès des enfants en situation de handicap et de leurs familles.</p>
            </div>
            <Mark kind="spark"/>
          </div>
        </section>
      </Reveal>
      <section className="actions-section">
        <Intro eyebrow="Sur le terrain" title="Des actions avec du mouvement, du concret et du lien." text="Pas de grands discours : des outils, des séances et des rencontres qui rendent l’inclusion visible et vivante."/>
        <div>
          {actions.slice(0,3).map((action,i)=><Reveal key={action.slug}><ActionRow action={action} reverse={i%2===1}/></Reveal>)}
        </div>
      </section>
      <Reveal>
        <section className="values-band">
          <div className="values-inner">
            <div><Mark kind="people"/><span>Inclure</span><p>Créer une place réelle pour chacun.</p></div>
            <div><Mark kind="move"/><span>Faire bouger</span><p>Retrouver confiance par l’activité.</p></div>
            <div><Mark kind="smile"/><span>Soutenir</span><p>Être aux côtés des enfants et des familles.</p></div>
          </div>
        </section>
      </Reveal>
      <section className="news-section">
        <div className="news-heading">
          <Intro eyebrow="La vie de l’association" title="Ce qui se passe, pour de vrai."/>
          <ArrowLink to="/actualites">Toutes les actualités</ArrowLink>
        </div>
        <div className="news-strip">
          {news.slice(0,3).map((item)=>(
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
              <Eyebrow>Donner un coup de pouce</Eyebrow>
              <h2>Chaque soutien rend une action possible.</h2>
            </div>
            <Link to="/faire-un-don" className="light-button">Soutenir l’association <ArrowRight size={17}/></Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}

function Association(){
  return (
    <main>
      <PageHero
        index="01"
        title="Une histoire devenue engagement."
        lede="Depuis 2016, l’association agit dans le Loiret pour les enfants en situation de handicap et leurs familles."
      />
      <Reveal>
        <section className="story-layout">
          <div className="story-photo">
            <img
              src="/actions/action-071.jpg"
              alt="Moment de partage avec Tissem et les bénévoles de l’association"
              loading="lazy"
            />
          </div>
          <div className="story-copy">
            <Eyebrow>Notre histoire</Eyebrow>
            <h2>Faire de l’expérience vécue une force collective.</h2>
            <p>
              Un sourire pour Tissem et tous les enfants porte une parole simple : les enfants extraordinaires doivent pouvoir participer, découvrir, bouger et s’épanouir comme les autres.
            </p>
            <blockquote>
              « Ensemble pour accompagner les enfants extraordinaires et faire grandir leurs sourires. »
            </blockquote>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="editorial-grid">
          <div>
            <span>01</span>
            <h3>Notre mission</h3>
            <p>Créer des activités accessibles et des outils de sensibilisation qui soutiennent l’inclusion et l’autonomie.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Notre manière d’agir</h3>
            <p>Partir du réel, écouter les familles, travailler avec les acteurs locaux et proposer des formats concrets.</p>
          </div>
          <div>
            <span>03</span>
            <h3>Notre territoire</h3>
            <p>Orléans, La Chapelle-Saint-Mesmin et plus largement le Loiret, au fil des rencontres et partenariats.</p>
          </div>
        </section>
      </Reveal>
      <Reveal>
        <section className="plain-cta">
          <div>
            <Eyebrow>Participer</Eyebrow>
            <h2>Vous avez du temps, une idée ou une compétence à partager ?</h2>
          </div>
          <ArrowLink to="/contact">Parlons-en</ArrowLink>
        </section>
      </Reveal>
    </main>
  );
}

function Actions(){return <main><PageHero index="02" title="Agir, simplement et concrètement." lede="Des actions construites autour de l’inclusion, du mouvement, de l’autonomie et du bien-être."/><section className="actions-page">{actions.map((a,i)=><Reveal key={a.slug}><ActionRow action={a} reverse={i%2===1}/></Reveal>)}</section></main>}
function ActionDetail(){
  const {slug}=useParams();
  const a=actions.find(x=>x.slug===slug);
  if(!a)return <NotFound/>;
  const isZumba = a.slug === "handi-zumba";
  const isPoster = isZumba || a.slug === "mallette-handicap";
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
            {isZumba ? (
              <>
                <div className="fact-note" style={{marginTop:"24px",background:"var(--blush)",padding:"18px 22px",borderRadius:"0 12px 12px 0"}}>
                  <p style={{fontSize:"15px",fontWeight:700,color:"var(--deep)",marginBottom:"8px"}}>Détails de la séance (affiche officielle) :</p>
                  <ul style={{display:"grid",gap:"6px",fontSize:"13.5px",lineHeight:1.5,paddingLeft:"18px",color:"var(--ink)"}}>
                    <li><strong>Tarif :</strong> 100% GRATUIT pour tous les enfants en situation de handicap</li>
                    <li><strong>Encadrement :</strong> Avec la coach <strong>Nassima</strong></li>
                    <li><strong>Lieu :</strong> L’Argonaute — 73 boulevard Marie Stuart, 45100 Orléans (quartier de l'Argonne)</li>
                    <li><strong>Horaires :</strong> Samedi de 14h30 à 15h30</li>
                    <li><strong>Au programme :</strong> Activité inclusive, confiance en soi, plaisir de bouger, convivialité</li>
                  </ul>
                </div>
                <p style={{marginTop:"16px",fontSize:"13px",color:"var(--muted)"}}>
                  <strong>Inscriptions obligatoires :</strong> sur HelloAsso ou au <a href="tel:+33617037095" style={{fontWeight:600,color:"var(--deep)"}}>06 17 03 70 95</a>.
                </p>
                <div style={{display:"flex",gap:"16px",alignItems:"center",marginTop:"24px",flexWrap:"wrap"}}>
                  <a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className="solid-button">S’inscrire sur HelloAsso ↗</a>
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

function Actualites(){
  const [q,setQ]=useState("");
  const [cat,setCat]=useState("Toutes");
  const cats=["Toutes",...new Set(news.map(n=>n.category))];
  const filtered=useMemo(()=>news.filter(n=>(cat==="Toutes"||n.category===cat)&&`${n.title} ${n.excerpt}`.toLowerCase().includes(q.toLowerCase())),[q,cat]);
  return (
    <main>
      <PageHero index="03" title="La vie de l’association." lede="Actions, rencontres, ateliers : des nouvelles ancrées dans le quotidien."/>
      <section className="news-page">
        <div className="filter-bar">
          <label>
            <Search size={18}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Rechercher"/>
            <span className="sr-only">Rechercher une actualité</span>
          </label>
          <div>
            {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={cat===c?"active":""}>{c}</button>)}
          </div>
        </div>
        <div className="journal-grid">
          {filtered.map(n=>(
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
function NewsDetail(){
  const {slug}=useParams();
  const n=news.find(x=>x.slug===slug);
  if(!n)return <NotFound/>;
  const isZumba = n.slug === "handi-zumba-octobre";
  const isPoster = isZumba || n.slug === "mallette-handicap-novembre";
  const isSalon = n.slug === "salon-solidaire";
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
                  <source src={n.video} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos MP4.
                </video>
                <div className="video-caption">
                  <Play size={14} fill="currentColor" />
                  <span>Vidéo : Au stand de l’association au Salon Solidaire</span>
                </div>
              </div>
              {isSalon && (
                <div className="detail-photo-substrip">
                  <img src="/actions/action-061.jpg" alt="Atelier sensoriel au stand du Salon Solidaire" loading="lazy" />
                  <img src="/actions/action-059.jpg" alt="L'équipe de bénévoles mobilisée au salon" loading="lazy" />
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
            {isSalon ? (
              <>
                <p>
                  L’association <strong>Un sourire pour Tissem et tous les enfants</strong> a participé avec cœur et enthousiasme au <strong>Salon Solidaire</strong>. Cet événement a été une opportunité majeure de faire connaître nos initiatives, d’échanger avec les familles et de renforcer les liens avec les acteurs associatifs et solidaires de notre territoire.
                </p>
                <div className="fact-note" style={{marginTop:"20px",background:"var(--blush)",padding:"18px 22px",borderRadius:"0 12px 12px 0"}}>
                  <p style={{fontSize:"15px",fontWeight:700,color:"var(--deep)",marginBottom:"8px"}}>Les temps forts de notre stand :</p>
                  <ul style={{display:"grid",gap:"6px",fontSize:"13.5px",lineHeight:1.5,paddingLeft:"18px",color:"var(--ink)"}}>
                    <li><strong>Sensibilisation ludique et immersive :</strong> Démonstration active des boîtes sensorielles et des modules de la <em>Mallette Handi’Cap</em> (sensibilisation aux handicaps moteurs et à l’autisme).</li>
                    <li><strong>Rencontres & écoute des familles :</strong> Présentation de nos activités hebdomadaires et mensuelles (séances Handi’Zumba 100% gratuites, sorties nature et sport adapté).</li>
                    <li><strong>Mobilisation de la jeunesse :</strong> Présence active de nos stagiaires et jeunes bénévoles pour accueillir et renseigner les visiteurs avec bienveillance.</li>
                    <li><strong>Partage et synergie locale :</strong> Rencontres enrichissantes avec d’autres associations du Loiret pour imaginer de futures collaborations solidaires.</li>
                  </ul>
                </div>
                <h3 style={{fontSize:"20px",marginTop:"26px",marginBottom:"10px",color:"var(--ink)"}}>Revivez l’ambiance en vidéo</h3>
                <p>
                  Retrouvez dans la vidéo ci-contre l’ambiance chaleureuse de notre stand, la curiosité des visiteurs pour nos outils pédagogiques et le dynamisme de notre équipe mobilisée tout au long de la journée.
                </p>
                <p style={{marginTop:"12px"}}>
                  Chaque rencontre sur le terrain contribue à faire évoluer les regards sur le handicap et à ouvrir les portes d’une société plus inclusive pour tous les enfants.
                </p>
                <div style={{display:"flex",gap:"16px",alignItems:"center",marginTop:"28px",flexWrap:"wrap"}}>
                  <Link to="/faire-un-don" className="solid-button">Soutenir nos actions ↗</Link>
                  <ArrowLink to="/actions/mallette-handicap">Découvrir la Mallette Handi’Cap</ArrowLink>
                  <ArrowLink to="/contact">Rejoindre l’équipe</ArrowLink>
                </div>
              </>
            ) : isZumba ? (
              <>
                <p>
                  L’association <strong>Un sourire pour Tissem et tous les enfants</strong> organise des séances découvertes <strong>Handi’Zumba</strong> animées par la coach <strong>Nassima</strong> à <strong>L’Argonaute d’Orléans</strong>.
                </p>
                <div className="fact-note" style={{marginTop:"20px",background:"var(--blush)",padding:"18px 22px",borderRadius:"0 12px 12px 0"}}>
                  <p style={{fontSize:"15px",fontWeight:700,color:"var(--deep)",marginBottom:"8px"}}>Informations pratiques & affiche :</p>
                  <ul style={{display:"grid",gap:"6px",fontSize:"13.5px",lineHeight:1.5,paddingLeft:"18px",color:"var(--ink)"}}>
                    <li><strong>Tarif :</strong> Gratuit pour tous les enfants en situation de handicap</li>
                    <li><strong>Coach :</strong> Nassima</li>
                    <li><strong>Lieu :</strong> L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans (quartier de l'Argonne)</li>
                    <li><strong>Horaires :</strong> 14h30 à 15h30</li>
                    <li><strong>Inscriptions :</strong> Obligatoire sur HelloAsso ou au 06 17 03 70 95</li>
                  </ul>
                </div>
                <div style={{display:"flex",gap:"16px",alignItems:"center",marginTop:"24px",flexWrap:"wrap"}}>
                  <a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className="solid-button">S’inscrire sur HelloAsso ↗</a>
                  <ArrowLink to="/contact">Nous poser une question</ArrowLink>
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

// Affiches / visuels graphiques (1-6, 13, 40, 41) + doublons de rafale (8, 11, 12, 17, 32, 50, 58)
const excludedGalleryImages = new Set([1, 2, 3, 4, 5, 6, 13, 40, 41, 8, 11, 12, 17, 32, 50, 58]);
const gallery = Array.from({length:75},(_,index)=>{
  const number=index+1;
  if(excludedGalleryImages.has(number)) return null;
  const category=number<=26?"Événements & fêtes":number<=39?"Moments partagés":number<=52?"Sorties & loisirs":"Ateliers & rencontres";
  return {src:`/actions/action-${String(number).padStart(3,"0")}.jpg`,alt:`Moment partagé de l’association — ${category.toLowerCase()}`,label:category};
}).filter((item): item is {src:string,alt:string,label:string}=>item!==null);

function Galerie(){
  const [selected,setSelected]=useState<number|null>(null);
  const [category,setCategory]=useState("Toutes");
  const [touchStartX,setTouchStartX]=useState<number|null>(null);
  const categories=["Toutes","Événements & fêtes","Moments partagés","Sorties & loisirs","Ateliers & rencontres"];
  const shown=useMemo(()=>category==="Toutes"?gallery:gallery.filter(item=>item.label===category),[category]);

  useEffect(()=>{
    if(selected===null) return;
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="Escape") setSelected(null);
      if(e.key==="ArrowLeft") setSelected(prev=>prev!==null?(prev-1+shown.length)%shown.length:null);
      if(e.key==="ArrowRight") setSelected(prev=>prev!==null?(prev+1)%shown.length:null);
    };
    window.addEventListener("keydown",onKey);
    document.body.style.overflow="hidden";
    return ()=>{
      window.removeEventListener("keydown",onKey);
      document.body.style.overflow="";
    };
  },[selected,shown.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const distance = touchStartX - e.changedTouches[0].clientX;
    if (distance > 45) {
      setSelected(prev=>prev!==null?(prev+1)%shown.length:null);
    } else if (distance < -45) {
      setSelected(prev=>prev!==null?(prev-1+shown.length)%shown.length:null);
    }
    setTouchStartX(null);
  };

  return (
    <main>
      <PageHero index="04" title="Des moments, pas une vitrine." lede="Les actions, sorties, ateliers et rencontres qui font vivre l’association, en images."/>
      <section className="gallery-section">
        <div className="gallery-filters">
          {categories.map(item=><button key={item} type="button" className={category===item?"active":""} onClick={()=>{setCategory(item);setSelected(null)}}>{item}</button>)}
        </div>
        <div className="gallery-grid">
          {shown.map((g,i)=>(
            <motion.button
              key={g.src}
              type="button"
              onClick={()=>setSelected(i)}
              className="gallery-card"
              initial={{opacity:0,y:20}}
              whileInView={{opacity:1,y:0}}
              viewport={{once:true,margin:"-40px"}}
              transition={{duration:.45,delay:Math.min((i%6)*.04,.24)}}
            >
              <img src={g.src} alt={g.alt} loading="lazy"/>
            </motion.button>
          ))}
        </div>
      </section>
      {typeof document!=="undefined"&&createPortal(
        <AnimatePresence>
          {selected!==null&&shown[selected]&&(
            <motion.div
              className="lightbox"
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              role="dialog"
              aria-modal="true"
              onClick={(e)=>{if(e.target===e.currentTarget) setSelected(null)}}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="lightbox-topbar">
                <span className="lightbox-counter">{selected + 1} / {shown.length}</span>
                <button
                  type="button"
                  className="lightbox-btn lightbox-close"
                  onClick={()=>setSelected(null)}
                  aria-label="Fermer la vue agrandie"
                >
                  <X size={24}/>
                </button>
              </div>

              <button
                type="button"
                className="lightbox-btn lightbox-prev"
                onClick={(e)=>{e.stopPropagation();setSelected((selected-1+shown.length)%shown.length)}}
                aria-label="Photo précédente"
              >
                <ChevronLeft size={30}/>
              </button>

              <motion.figure
                key={shown[selected].src}
                className="lightbox-figure"
                initial={{opacity:0,scale:.96}}
                animate={{opacity:1,scale:1}}
                transition={{duration:.2}}
                onClick={e=>e.stopPropagation()}
              >
                <img src={shown[selected].src} alt={shown[selected].alt}/>
              </motion.figure>

              <button
                type="button"
                className="lightbox-btn lightbox-next"
                onClick={(e)=>{e.stopPropagation();setSelected((selected+1)%shown.length)}}
                aria-label="Photo suivante"
              >
                <ChevronRight size={30}/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
}

function Donation(){const [amount,setAmount]=useState("25 €");return <main><PageHero index="05" title="Soutenir une action concrète." lede="Votre générosité aide l’association à développer ses activités auprès des enfants et des familles."/><section className="donation-layout"><div><Eyebrow>À quoi sert votre soutien ?</Eyebrow><h2>Du matériel, des activités, des rencontres.</h2><p>Les dons permettent de préparer des outils adaptés, d’organiser des séances inclusives et d’accompagner les projets de l’association.</p><ul><li>Matériel sensoriel et pédagogique (Mallette Handi’Cap)</li><li>Activités sportives inclusives (Handi’Zumba, sport solidaire à L’Argonaute)</li><li>Actions de sensibilisation et accompagnement des familles</li></ul></div><div className="donation-panel"><span className="panel-label">Choisir un montant indicatif</span><div className="amounts">{["5 €","10 €","25 €","50 €","Libre"].map(a=><button key={a} className={amount===a?"active":""} onClick={()=>setAmount(a)}>{a}</button>)}</div>{amount==="Libre"&&<input inputMode="decimal" placeholder="Votre montant personnalisé (€)"/>}<div className="secure-note"><ShieldCheck size={20}/><p><b>Collecte 100% sécurisée via HelloAsso.</b><br/>Plateforme reconnue dédiée aux associations françaises. Reçu fiscal émis automatiquement, aucune coordonnée bancaire sur ce site.</p></div><a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className="solid-button full" style={{textAlign:"center",justifyContent:"center",textDecoration:"none"}}>Faire un don sur HelloAsso ({amount}) ↗</a><div style={{marginTop:"16px",textAlign:"center"}}><a href={HELLOASSO_URL} target="_blank" rel="noopener noreferrer" className="text-button">Adhérer annuellement à l’association ↗</a></div></div></section></main>}

const schema=z.object({name:z.string().min(2,"Indiquez votre nom."),email:z.string().email("Email invalide."),subject:z.string().min(3,"Précisez le sujet."),message:z.string().min(10,"Écrivez au moins 10 caractères."),consent:z.literal(true,{message:"Votre accord est nécessaire."})});type FormData=z.infer<typeof schema>;
function Contact(){const [data,setData]=useState<FormData|null>(null);const {register,handleSubmit,formState:{errors}}=useForm<FormData>({resolver:zodResolver(schema)});return <main><PageHero index="06" title="Parlons de votre idée." lede="Une question sur une activité, une proposition de partenariat ou l’envie de devenir bénévole ?"/><section className="contact-layout"><div><Eyebrow>Contact & coordonnées</Eyebrow><h2>Nous sommes basés dans le Loiret.</h2><p>Pour les informations sur les activités et inscriptions :</p><a className="contact-phone" href="tel:+33617037095">06 17 03 70 95</a><p className="venue"><b>Lieu de certaines activités</b><br/>L’Argonaute<br/>73 boulevard Marie Stuart<br/>45100 Orléans</p><p className="venue" style={{marginTop:"18px"}}><b>Siège social</b><br/>48 Rue de Monteloup<br/>45380 La Chapelle-Saint-Mesmin</p></div><form onSubmit={handleSubmit(val=>setData(val))} noValidate>{[["name","Nom complet","text"],["email","Adresse email","email"],["subject","Sujet","text"]].map(([key,label,type])=><label key={key}><span>{label}</span><input type={type} {...register(key as keyof FormData)}/>{errors[key as keyof FormData]&&<small>{errors[key as keyof FormData]?.message}</small>}</label>)}<label><span>Votre message</span><textarea rows={5} {...register("message")}/>{errors.message&&<small>{errors.message.message}</small>}</label><label className="consent"><input type="checkbox" {...register("consent")}/><span>J’accepte que mes informations soient utilisées pour répondre à ma demande.</span></label>{errors.consent&&<small>{errors.consent.message}</small>}<button className="solid-button" type="submit">Préparer le message <ArrowRight size={17}/></button>{data&&<div className="form-notice" style={{borderRadius:"8px",lineHeight:1.6}}><p><b>Votre message est prêt !</b></p><p style={{fontSize:"12px",marginTop:"6px"}}>Cliquez ci-dessous pour l'envoyer directement via votre application de messagerie :</p><a href={`mailto:contact@un-sourire-pour-tissem.fr?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`De : ${data.name} (${data.email})\n\n${data.message}`)}`} className="arrow-link" style={{marginTop:"10px",color:"var(--deep)"}}>Ouvrir ma messagerie pour envoyer ↗</a></div>}</form></section></main>}

function MentionsLegales(){return <main><PageHero index="07" title="Mentions légales & confidentialité." lede="Transparence, cadre juridique et respect de la vie privée."/><div className="legal-page"><section className="legal-section"><Eyebrow>Éditeur</Eyebrow><h2>1. Identification de l’association</h2><p><b>Dénomination :</b> Association Un sourire pour Tissem et tous les enfants</p><p><b>Forme juridique :</b> Association loi 1901 à but non lucratif (déclarée en mars 2016)</p><p><b>Numéro RNA :</b> W452013082 (Préfecture du Loiret)</p><p><b>SIREN :</b> 895 052 363 · <b>SIRET :</b> 895 052 363 00010</p><p><b>Siège social :</b> 48 Rue de Monteloup, 45380 La Chapelle-Saint-Mesmin, France</p><p><b>Présidente & Directrice de la publication :</b> Jamila Tighadouini</p><p><b>Téléphone :</b> <a href="tel:+33617037095">06 17 03 70 95</a></p><p><b>Lieu des activités régulières :</b> L’Argonaute, 73 boulevard Marie Stuart, 45100 Orléans</p></section><section className="legal-section"><Eyebrow>Hébergement</Eyebrow><h2>2. Hébergement du site</h2><p>Ce site est hébergé sur des infrastructures cloud sécurisées conformes aux normes européennes de protection des données (RGPD).</p></section><section className="legal-section"><Eyebrow>Dons & Paiements</Eyebrow><h2>3. Collecte de dons et paiements sécurisés</h2><p>Les dons et adhésions sont collectés via la plateforme officielle agréée <b>HelloAsso</b>. Aucune coordonnée bancaire n’est stockée ou traitée par le présent site web.</p></section><section className="legal-section"><Eyebrow>RGPD</Eyebrow><h2>4. Protection des données personnelles</h2><p>Les données transmises via le formulaire de contact sont strictement utilisées pour répondre aux demandes des utilisateurs. Elles ne sont ni cédées, ni vendues. Vous disposez d’un droit d’accès, de rectification et d’effacement en contactant directement l’association.</p></section><section className="legal-section"><Eyebrow>Propriété</Eyebrow><h2>5. Propriété intellectuelle</h2><p>L’ensemble des contenus, textes, photographies d’activités et visuels (notamment la Mallette Handi’Cap) sont la propriété de l’association ou diffusés avec accord. Toute reproduction non autorisée est interdite.</p></section><div style={{marginTop:"30px"}}><ArrowLink to="/">Retourner à l’accueil</ArrowLink></div></div></main>}

function NotFound(){return <main className="not-found"><span>404</span><h1>Cette page n’existe pas.</h1><p>Revenons à l’essentiel.</p><Link to="/" className="solid-button">Retour à l’accueil</Link></main>}
function AnimatedRoutes(){const location=useLocation();return <AnimatePresence mode="wait"><motion.div className="page-transition" key={location.pathname} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:.42,ease:[.22,1,.36,1]}}><Routes location={location}><Route path="/" element={<Home/>}/><Route path="/association" element={<Association/>}/><Route path="/actions" element={<Actions/>}/><Route path="/actions/:slug" element={<ActionDetail/>}/><Route path="/actualites" element={<Actualites/>}/><Route path="/actualites/:slug" element={<NewsDetail/>}/><Route path="/galerie" element={<Galerie/>}/><Route path="/faire-un-don" element={<Donation/>}/><Route path="/contact" element={<Contact/>}/><Route path="/mentions-legales" element={<MentionsLegales/>}/><Route path="*" element={<NotFound/>}/></Routes></motion.div></AnimatePresence>}
export default function App(){return <div className="site-shell"><ScrollToTop/><Header/><AnimatedRoutes/><Footer/></div>}
