"use client";

import GoogleReviews from "./components/GoogleReviews";
import { useEffect, useState, type SyntheticEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Clock,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Beer,
  Sandwich,
  Sun,
} from "lucide-react";
// Image constants moved to sitoConfig.js
import config from "../sitoConfig";

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    const expanded = normalized.split("").map((char) => char + char).join("");
    return `rgba(${parseInt(expanded.slice(0, 2), 16)}, ${parseInt(expanded.slice(2, 4), 16)}, ${parseInt(expanded.slice(4, 6), 16)}, ${alpha})`;
  }
  if (normalized.length !== 6) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${parseInt(normalized.slice(0, 2), 16)}, ${parseInt(normalized.slice(2, 4), 16)}, ${parseInt(normalized.slice(4, 6), 16)}, ${alpha})`;
};

const theme = (config as any).design_e_colori || {};
const palette = (theme.coloriGenerali || {}) as Record<string, string>;
const sectionThemes = (theme.sezioni || {}) as Record<string, any>;
const getPaletteColor = (value: string | undefined, fallback: string) => value || fallback || "#0A0A0A";
const resolveSectionTheme = (sectionKey: string, fallback: Record<string, string>) => ({
  ...(fallback || {}),
  ...(sectionThemes[sectionKey] || {}),
});
const heroColors = resolveSectionTheme("hero", {
  background: "transparent",
  text: palette.cremaFresco || "#FDF9EF",
  title: palette.cremaFresco || "#FDF9EF",
  accent: palette.beigeCartone || "#C4A77D",
  border: palette.rossoStreet || "#BC2D0E",
  buttonBg: palette.rossoStreet || "#BC2D0E",
  buttonText: palette.cremaFresco || "#FDF9EF",
});
const navbarColors = resolveSectionTheme("navbar", {
  background: palette.scuroPremium || "#0D0A08",
  text: palette.cremaFresco || "#FDF9EF",
  title: palette.cremaFresco || "#FDF9EF",
  accent: palette.rossoStreet || "#BC2D0E",
  border: palette.beigeCartone || "#C4A77D",
  buttonBg: palette.rossoStreet || "#BC2D0E",
  buttonText: palette.cremaFresco || "#FDF9EF",
  mobileText: palette.cremaFresco || "#FDF9EF",
  mobileButtonBg: palette.rossoStreet || "#BC2D0E",
  mobileButtonText: palette.cremaFresco || "#FDF9EF",
  mobileBorder: palette.beigeCartone || "#C4A77D",
});
const sectionColors = {
  menu: resolveSectionTheme("menu", {
    background: palette.scuroPremium || "#0D0A08",
    text: palette.cremaFresco || "#FDF9EF",
    title: palette.beigeCartone || "#C4A77D",
    accent: palette.rossoStreet || "#BC2D0E",
    border: palette.beigeCartone || "#C4A77D",
    barBg: palette.scuroPremium || "#0D0A08",
    barText: palette.cremaFresco || "#FDF9EF",
    barBorder: palette.beigeCartone || "#C4A77D",
  }),
  chiSiamo: resolveSectionTheme("chiSiamo", {
    background: palette.cremaFresco || "#FDF9EF",
    text: palette.scuroPremium || "#0D0A08",
    title: palette.rossoStreet || "#BC2D0E",
    accent: palette.beigeCartone || "#C4A77D",
    border: palette.rossoStreet || "#BC2D0E",
  }),
  galleria: resolveSectionTheme("galleria", {
    background: palette.cremaFresco || "#FDF9EF",
    text: palette.scuroPremium || "#0D0A08",
    title: palette.rossoStreet || "#BC2D0E",
    accent: palette.beigeCartone || "#C4A77D",
    border: palette.rossoStreet || "#BC2D0E",
  }),
  recensioni: resolveSectionTheme("recensioni", {
    background: palette.scuroPremium || "#0D0A08",
    text: palette.cremaFresco || "#FDF9EF",
    title: palette.beigeCartone || "#C4A77D",
    accent: palette.rossoStreet || "#BC2D0E",
    border: palette.beigeCartone || "#C4A77D",
    buttonBg: palette.rossoStreet || "#BC2D0E",
    buttonText: palette.cremaFresco || "#FDF9EF",
  }),
  instagram: resolveSectionTheme("instagram", {
    background: palette.scuroPremium || "#0D0A08",
    text: palette.cremaFresco || "#FDF9EF",
    title: palette.beigeCartone || "#C4A77D",
    accent: palette.rossoStreet || "#BC2D0E",
    border: palette.rossoStreet || "#BC2D0E",
    buttonBg: palette.rossoStreet || "#BC2D0E",
    buttonText: palette.cremaFresco || "#FDF9EF",
  }),
  contatti: resolveSectionTheme("contatti", {
    background: palette.cremaFresco || "#FDF9EF",
    text: palette.scuroPremium || "#0D0A08",
    title: palette.rossoStreet || "#BC2D0E",
    accent: palette.beigeCartone || "#C4A77D",
    border: palette.rossoStreet || "#BC2D0E",
    buttonBg: palette.rossoStreet || "#BC2D0E",
    buttonText: palette.cremaFresco || "#FDF9EF",
    secondaryBg: palette.scuroPremium || "#0D0A08",
    secondaryText: palette.cremaFresco || "#FDF9EF",
  }),
  footer: resolveSectionTheme("footer", {
    background: palette.scuroPremium || "#0D0A08",
    text: palette.cremaFresco || "#FDF9EF",
    title: palette.beigeCartone || "#C4A77D",
    accent: palette.rossoStreet || "#BC2D0E",
    border: palette.beigeCartone || "#C4A77D",
  }),
};
const pageColors = {
  background: sectionColors.chiSiamo?.background || navbarColors.background || "#0A0A0A",
  text: sectionColors.menu?.text || navbarColors.text || "#F5F2EA",
  accent: sectionColors.menu?.title || navbarColors.accent || "#D9A31A",
  border: sectionColors.menu?.border || navbarColors.border || "#F5F2EA",
  title: sectionColors.menu?.title || navbarColors.title || "#D9A31A",
  mutedText: hexToRgba(sectionColors.menu?.text || navbarColors.text || "#F5F2EA", 0.85),
  mutedBorder: hexToRgba(sectionColors.menu?.border || navbarColors.border || "#F5F2EA", 0.1),
  heroBg: heroColors.background || "transparent",
  heroText: heroColors.text || "#F5F2EA",
  heroAccent: heroColors.accent || "#D9A31A",
  heroTitle: heroColors.title || "#E8D8B2",
};

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === "true") return;
  target.dataset.fallbackApplied = "true";
  target.removeAttribute("src");
  target.style.display = "none";
};

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

const NAV_LINKS: { label: string; href: string }[] = [];
const vis = (config as any).visibilitaSezioni || {};
if (vis.mostraHome) NAV_LINKS.push({ label: "Home", href: "#home" });
if (vis.mostraChiSiamo) NAV_LINKS.push({ label: "Chi Siamo", href: "#chi-siamo" });
if (vis.mostraMenu) NAV_LINKS.push({ label: "Menu", href: "#menu" });
if (vis.mostraGalleria) NAV_LINKS.push({ label: "Galleria", href: "#galleria" });
if (vis.mostraContatti) NAV_LINKS.push({ label: "Contatti", href: "#contatti" });

const MENU_ITEMS: Record<string, any[]> = (config as any).sezioneMenu?.piatti || {};
const MENU_CATEGORIES_RAW: { id: string; label: string }[] = ((config as any).sezioneMenu?.categorie) || [
  { id: "mortadella", label: "Mortadella" },
  { id: "cotto", label: "Cotto" },
  { id: "crudo", label: "Crudo" },
  { id: "finocchiona", label: "Finocchiona" },
  { id: "vegetariane", label: "Vegetariane" },
  { id: "super", label: "Super Schiacciate" },
];
const MENU_CATEGORIES = MENU_CATEGORIES_RAW.filter((cat) => Array.isArray(MENU_ITEMS[cat.id]) && MENU_ITEMS[cat.id].length > 0);
const MISSING_MENU_KEYS = Object.keys(MENU_ITEMS).filter((key) => !MENU_CATEGORIES.some((cat) => cat.id === key));
const CATEGORIES: { id: string; label: string }[] = [
  ...MENU_CATEGORIES,
  ...MISSING_MENU_KEYS.map((key) => ({ id: key, label: key })),
];

const REAL_REVIEWS = (config as any).datiContenuto?.recensioni || [
  "La schiacciata romana definitiva a Trieste. Impasto leggerissimo e ingredienti di qualità locale.",
  "Il cotto Sfreddo con il kren è una bomba atomica. Personale giovane e locale super consigliato al centro.",
];

const slotImgs = (config as any).slotImmagini || {};

const HERO_IMAGE = slotImgs.heroBg || "/cartella-foto/hero.jpg";

const GALLERY_IMAGES: string[] = slotImgs.gallery || slotImgs.all || [];

const PRODUCT_CARDS = slotImgs.products
  ? slotImgs.products.map((p: any) => ({
      ...p,
      mainImage: p.mainImage && (p.mainImage.startsWith("/") ? p.mainImage : `/cartella-foto/${p.mainImage}`),
      detailImage: p.detailImage && (p.detailImage.startsWith("/") ? p.detailImage : `/cartella-foto/${p.detailImage}`),
    }))
  : CATEGORIES.map((cat, i) => ({
      id: cat.id,
      title: cat.label,
      desc: "",
      mainImage: GALLERY_IMAGES[i % GALLERY_IMAGES.length] || "",
      detailImage: GALLERY_IMAGES[(i + 1) % GALLERY_IMAGES.length] || "",
    }));

const _RAW_HOURS = (config as any).infoGenerali?.contatti?.orari || (config as any).orari || [
  { giorno: "Lunedì", orario: "08:00 – 01:00" },
  { giorno: "Martedì", orario: "08:00 – 01:00" },
  { giorno: "Mercoledì", orario: "08:00 – 01:00" },
  { giorno: "Giovedì", orario: "08:00 – 01:00" },
  { giorno: "Venerdì", orario: "08:00 – 02:00" },
  { giorno: "Sabato", orario: "08:00 – 02:00" },
  { giorno: "Domenica", orario: "17:00 – 23:30" },
];

const HOURS: { day: string; time: string }[] = (_RAW_HOURS || []).map((h: any) => ({
  day: h.giorno || h.day || "",
  time: h.orario || h.time || "",
}));

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;

    event.preventDefault();
    setMenuOpen(false);

    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);

    if (target) {
      const header = document.querySelector("header");
      const stickyBar = document.querySelector("[data-sticky-menu-bar]");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const stickyHeight = stickyBar ? stickyBar.getBoundingClientRect().height : 0;
      const offset = Math.max(96, headerHeight + stickyHeight + 24);
      const top = window.scrollY + target.getBoundingClientRect().top - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      window.history.replaceState(null, "", href);
    } else {
      window.location.hash = href;
    }
  };

  return (
    <main
      className="m-0 block font-body overflow-x-hidden"
      style={{ backgroundColor: pageColors.background, color: pageColors.text }}
    >
      {/* ============================== HEADER ============================== */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.5)] border-b" : "bg-transparent"
        }`}
        style={{
          backgroundColor: scrolled ? hexToRgba(navbarColors.background || "#0A0A0A", 0.95) : "transparent",
          borderColor: hexToRgba(pageColors.accent, 0.1),
          color: navbarColors.text || pageColors.text,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
          <a href="#home" onClick={(event) => handleAnchorClick(event, "#home")} className="flex items-center gap-3">
            <img
              src={config.infoGenerali.logo || (config as any).slotImmagini?.logo || "/logo.jpg"}
              alt={`${config.infoGenerali.nomeAttivita} logo`}
              className="h-10 md:h-12 w-10 md:w-12 rounded-full object-cover border"
              style={{ borderColor: hexToRgba(pageColors.accent, 0.4) }}
              onError={(event) => handleImageError(event)}
            />
            <div className="flex items-center gap-0.5 whitespace-nowrap">
              <span className="font-display text-2xl md:text-3xl tracking-wider" style={{ color: (config as any).navbar?.brandTestoColore || navbarColors.text || pageColors.text }}>
                {(config as any).navbar?.brandTesto || (config as any).infoGenerali?.nomeAttivita || "Il Tuo Ristorante"}
              </span>
              {(config as any).navbar?.brandAccentTesto ? (
                <span className="font-display text-2xl md:text-3xl tracking-wider" style={{ color: (config as any).navbar?.brandAccentColore || navbarColors.accent || pageColors.accent }}>
                  {(config as any).navbar?.brandAccentTesto}
                </span>
              ) : null}
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 font-display text-sm tracking-widest uppercase">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className="relative transition-colors group"
                style={{ color: navbarColors.text || pageColors.text }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full" style={{ backgroundColor: navbarColors.accent || pageColors.accent }} />
              </a>
            ))}
          </nav>

          <a
            href="#contatti"
            onClick={(event) => handleAnchorClick(event, "#contatti")}
            className="hidden lg:inline-flex items-center font-display text-sm tracking-widest uppercase px-6 py-3 transition-colors duration-300"
            style={{
              backgroundColor: navbarColors.buttonBg || pageColors.accent,
              color: navbarColors.buttonText || pageColors.background,
            }}
          >
            Ordina Ora
          </a>

          <button
            type="button"
            aria-label="Apri menu"
            aria-expanded={menuOpen}
            className="lg:hidden relative z-50"
            style={{ color: navbarColors.text || pageColors.text }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>

        {/* Mobile nav */}
        <div
          className={`lg:hidden overflow-hidden border-t transition-all duration-200 ${
            menuOpen ? "max-h-[800px] opacity-100 pointer-events-auto" : "max-h-0 opacity-0 pointer-events-none"
          }`}
          style={{ overflow: "hidden", backgroundColor: navbarColors.background || pageColors.background, borderColor: hexToRgba(navbarColors.mobileBorder || navbarColors.border || pageColors.accent, 0.1) }}
          aria-hidden={!menuOpen}
        >
          <div className="flex flex-col px-6 py-5 gap-3 font-display text-base tracking-[0.16em] uppercase">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleAnchorClick(event, link.href)}
                className="font-medium"
                style={{ color: navbarColors.mobileText || navbarColors.text || pageColors.text }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contatti"
              onClick={(event) => handleAnchorClick(event, "#contatti")}
              className="text-center py-3 mt-2 font-semibold"
              style={{ backgroundColor: navbarColors.mobileButtonBg || navbarColors.buttonBg || pageColors.accent, color: navbarColors.mobileButtonText || navbarColors.buttonText || pageColors.background }}
            >
              Ordina Ora
            </a>
          </div>
        </div>
      </header>

      {/* ============================== HERO ============================== */}
      <section id="home" className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Schiacciata romana fresca"
            className="h-full w-full object-cover scale-105"
            onError={(event) => handleImageError(event)}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.60) 100%)`,
            }}
          />
        </motion.div>

        <div className="relative z-10 flex h-full w-full items-end justify-center px-4 pb-10 sm:px-6 md:px-8 lg:mx-auto lg:max-w-7xl lg:justify-start lg:px-8 lg:pb-16">
          <div className="w-full max-w-2xl text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-3 font-display text-[0.90rem] uppercase tracking-[0.35em]"
              style={{ color: heroColors.accent || pageColors.accent }}
            >
              {(config as any).testiHero?.preTitle || "Trieste · Dal 2017"}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-6xl leading-[0.78] tracking-[0.01em] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[5.75rem]"
              style={{ color: heroColors.text || pageColors.text }}
            >
              <span className="block" style={{ color: heroColors.title || heroColors.text || pageColors.heroTitle }}>
                {(config as any).testiHero?.riga1 || "La Schiacciata"}
              </span>
              <span className="mt-1 block" style={{ color: heroColors.accent || heroColors.text || pageColors.heroTitle }}>
                {(config as any).testiHero?.riga2 || "Più Iconica"}
              </span>
              <span className="mt-1 block" style={{ color: heroColors.accent || heroColors.title || pageColors.heroAccent }}>
                {(config as any).testiHero?.riga3 || "DI TRIESTE"}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base lg:mx-0"
              style={{ color: heroColors.text || pageColors.mutedText }}
            >
              {(config as any).testiHero?.sottotitolo || "Schiacciate romane, birre selezionate e tradizione triestina in un'atmosfera premium, pronta a farti vivere l'aperitivo migliore di Trieste."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              <a
                href={(config as any).testiHero?.btnPrimarioHref || "#menu"}
                onClick={(event) => handleAnchorClick(event, (config as any).testiHero?.btnPrimarioHref || "#menu")}
                className="font-display px-6 py-3 text-[0.99rem] uppercase tracking-[0.25em] transition-colors duration-300"
                style={{ backgroundColor: heroColors.buttonBg || pageColors.accent, color: heroColors.buttonText || pageColors.background }}
              >
                {(config as any).testiHero?.btnPrimario || "Scopri il Menu"}
              </a>
              <a
                href={(config as any).testiHero?.btnSecondarioHref || "#contatti"}
                onClick={(event) => handleAnchorClick(event, (config as any).testiHero?.btnSecondarioHref || "#contatti")}
                className="font-display border px-6 py-3 text-[0.99rem] uppercase tracking-[0.25em] transition-colors duration-300"
                style={{ borderColor: hexToRgba(heroColors.border || pageColors.border, 0.4), color: heroColors.text || pageColors.text }}
              >
                {(config as any).testiHero?.btnSecondario || "Contattaci"}
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          style={{ color: heroColors.accent || pageColors.accent }}
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ============================== ABOUT ============================== */}
      <section id="chi-siamo" className="relative px-4 py-16 sm:px-6 md:px-8 md:py-24" style={{ backgroundColor: pageColors.background }}>
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-4 font-display text-sm uppercase tracking-[0.3em]" style={{ color: sectionColors.chiSiamo.accent || pageColors.accent }}>
              {(config as any).sezioneChiSiamo?.preTitolo || "La Nostra Storia"}
            </p>
            <h2 className="mb-6 font-display text-4xl uppercase leading-none sm:text-5xl md:text-7xl" style={{ color: sectionColors.chiSiamo.title || pageColors.title }}>
              {(config as any).sezioneChiSiamo?.titoloPrincipale || "Dal 2017"}
            </h2>
            <p className="mb-4 text-base leading-relaxed" style={{ color: sectionColors.chiSiamo.text || pageColors.mutedText }}>
              {(config as any).sezioneChiSiamo?.paragrafo1 || "Il nostro locale nasce dalla passione per l'ospitalità e dalla cura dei dettagli, con un menu pensato per accompagnare ogni momento in modo autentico."}
            </p>
            <p className="text-base leading-relaxed" style={{ color: sectionColors.chiSiamo.text || pageColors.mutedText }}>
              {(config as any).sezioneChiSiamo?.paragrafo2 || "Ogni piatto è preparato con ingredienti selezionati e una presentazione che valorizza l'esperienza del cliente, dalla prima accoglienza fino all'ultimo boccone."}
            </p>
            <h3 className="mt-4 font-display text-xl uppercase tracking-[0.2em]" style={{ color: sectionColors.chiSiamo.title || pageColors.accent }}>
              {(config as any).sezioneChiSiamo?.titoloAsporto || "Da Asporto"}
            </h3>
            <p className="mt-4 text-base leading-relaxed" style={{ color: sectionColors.chiSiamo.text || pageColors.mutedText }}>
              {(config as any).sezioneChiSiamo?.paragrafo3 || "Dalle fritture di pesce croccanti e freschissime gustate vista mare, ai nostri famosi hamburger di manzo 100% selezionato, fino alle specialità alla griglia e ai cicchetti per l'aperitivo: che tu sia a Udine o a Trieste, da noi trovi sempre gusto autentico, porzioni generose e un'accoglienza col sorriso."}
            </p>
            <a
              href={(config as any).sezioneChiSiamo?.linkUdine || "https://lovestreetfoodud.netlify.app"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display mt-4 inline-flex px-6 py-3 text-[0.99rem] uppercase tracking-[0.25em] transition-colors duration-300"
              style={{
                color: sectionColors.chiSiamo.background || pageColors.background,
                backgroundColor: sectionColors.chiSiamo.title || pageColors.accent,
              }}
            >
              {(config as any).sezioneChiSiamo?.testoLinkUdine || "Scopri a Udine!"}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            
          </motion.div>
        </div>
      </section>

      {/* ============================== MENU ============================== */}
      <section id="menu" className="relative px-4 py-16 sm:px-6 md:px-8 md:py-24" style={{ backgroundColor: hexToRgba(pageColors.accent, 0.18) }}>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center md:mb-12"
          >
            <p className="mb-3 font-display text-sm uppercase tracking-[0.3em]" style={{ color: sectionColors.menu.accent || pageColors.accent }}>
              {(config as any).sezioneMenu?.preTitolo || "Il Nostro Menu"}
            </p>
            <h2 className="font-display text-4xl uppercase leading-none sm:text-5xl md:text-7xl" style={{ color: sectionColors.menu.title || pageColors.title }}>
              {(config as any).sezioneMenu?.titoloGrande || "Schiacciate"} <span style={{ color: sectionColors.menu.accent || pageColors.accent }}>{(config as any).sezioneMenu?.evidenziato || "reali"}</span>
            </h2>
          </motion.div>

          <div data-sticky-menu-bar className="sticky top-14 z-30 mb-4 overflow-x-auto rounded-none border py-3 md:top-16" style={{ backgroundColor: hexToRgba(pageColors.background, 0.9), borderColor: hexToRgba(pageColors.border, 0.1) }}>
            <div className="flex w-max gap-2 px-3">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  onClick={(event) => handleAnchorClick(event, `#${cat.id}`)}
                  className="whitespace-nowrap rounded-full border px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.25em] transition-colors"
                  style={{ borderColor: hexToRgba(sectionColors.menu.barBorder || sectionColors.menu.border || pageColors.border, 0.1), color: sectionColors.menu.barText || sectionColors.menu.text || pageColors.text, backgroundColor: hexToRgba(sectionColors.menu.barBg || sectionColors.menu.background || pageColors.background, 0.55) }}
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(MENU_ITEMS).map(([key, items], index) => (
              <motion.div
                id={key}
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="scroll-mt-40 overflow-hidden border"
                style={{ borderColor: hexToRgba(pageColors.border, 0.1), backgroundColor: hexToRgba(pageColors.background, 0.7) }}
              >
                <div className="border-b px-4 py-3 md:px-6" style={{ borderColor: hexToRgba(sectionColors.menu.border || pageColors.border, 0.2), backgroundColor: hexToRgba(sectionColors.menu.accent || pageColors.accent, 0.16) }}>
                  <h3 className="font-display text-xl uppercase tracking-[0.2em]" style={{ color: sectionColors.menu.accent || pageColors.accent }}>
                    {CATEGORIES.find((cat) => cat.id === key)?.label}
                  </h3>
                </div>
                <div className="divide-y" style={{ borderColor: hexToRgba(sectionColors.menu.border || pageColors.border, 0.15) }}>
                  {items.map((item, itemIndex) => {
                    const isString = typeof item === "string";
                    const title = isString ? item : item.nome || item.title || "";
                    const desc = isString ? "" : item.descrizione || item.desc || "";
                    const price = isString ? "" : item.prezzo ? `${item.prezzo} €` : "";
                    return (
                      <div key={`${key}-${itemIndex}`} className="flex items-start gap-3 px-4 py-3 md:px-6">
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold" style={{ borderColor: hexToRgba(sectionColors.menu.accent || pageColors.accent, 0.4), color: sectionColors.menu.accent || pageColors.accent }}>
                          {itemIndex + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm leading-relaxed md:text-base" style={{ color: sectionColors.menu.text || pageColors.mutedText }}>{title}</p>
                            {price ? (
                              <span className="shrink-0 whitespace-nowrap text-sm font-semibold md:text-base" style={{ color: sectionColors.menu.accent || pageColors.accent }}>
                                {price}
                              </span>
                            ) : null}
                          </div>
                          {desc ? <p className="mt-1 text-xs" style={{ color: hexToRgba(sectionColors.menu.text || pageColors.text, 0.6) }}>{desc}</p> : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== GALLERY ============================== */}
      <section id="galleria" className="relative py-24 md:py-36 px-5 md:px-8" style={{ backgroundColor: pageColors.background }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="font-display tracking-[0.3em] text-sm mb-4 uppercase" style={{ color: sectionColors.galleria.accent || pageColors.accent }}>
              {(config as any).sezioneGalleria?.preTitolo || "L'Atmosfera"}
            </p>
            <h2 className="font-display text-6xl md:text-8xl uppercase leading-none" style={{ color: sectionColors.galleria.title || pageColors.title }}>
              {(config as any).sezioneGalleria?.titoloGrande || "Vita da"} <span style={{ color: sectionColors.galleria.accent || pageColors.accent }}>{(config as any).sezioneGalleria?.evidenziato || "Il tuo locale"}</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4 auto-rows-[140px] sm:auto-rows-[180px] md:auto-rows-[240px]">
            {GALLERY_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className={`relative overflow-hidden group rounded-[8px] ${
                  i === 0 ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2" : ""
                } ${i === 3 ? "sm:col-span-2 md:col-span-2" : ""}`}
              >
                <img
                  src={src}
                  alt={config.infoGenerali.nomeAttivita || "Il tuo locale"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ objectPosition: "center" }}
                  onError={(event) => handleImageError(event)}
                />
                <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: hexToRgba(sectionColors.galleria.accent || pageColors.accent, 0) }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== GOOGLE REVIEWS ============================== */}
      <GoogleReviews
        theme={sectionColors.recensioni || {} as any}
        title={config.sezioneRecensioni?.titoloGrande || "Recensioni"}
        titleAccent={config.sezioneRecensioni?.titoloEvidenziato || "Google"}
        subtitle={config.sezioneRecensioni?.preTitolo || "Cosa Dicono di Noi"}
        buttonLabel={config.sezioneRecensioni?.bottoneTesto || "Lascia una Recensione"}
        fallbackReviews={(config as any).sezioneRecensioni?.fallbackReviews || []}
        description={config.sezioneRecensioni?.descrizione || "Le recensioni di esempio sotto possono essere personalizzate da te."}
        averageRating={Number(config.sezioneRecensioni?.mediaStelle) || undefined}
        totalReviews={Number(config.sezioneRecensioni?.numeroRecensioni) || undefined}
      />

      {/* ============================== SOCIAL ============================== */}
      <section className="relative py-24 md:py-32 px-5 md:px-8 text-center" style={{ background: `linear-gradient(180deg, ${hexToRgba(sectionColors.instagram.background || pageColors.background, 0.25)} 0%, ${sectionColors.instagram.background || pageColors.background} 100%)` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <Instagram className="mx-auto mb-6" size={40} strokeWidth={1.5} style={{ color: sectionColors.instagram.accent || pageColors.accent }} />
          <h2 className="font-display text-5xl md:text-7xl uppercase leading-tight mb-6" style={{ color: sectionColors.instagram.title || pageColors.title }}>
            {(config as any).sezioneInstagram?.titoloGrande || "Seguici su Instagram"}
          </h2>
          <p className="text-lg mb-8" style={{ color: hexToRgba(sectionColors.instagram.text || pageColors.text, 0.75) }}>
            {(config as any).sezioneInstagram?.descrizione || "Seguici sui social per scoprire le novità del locale."}
          </p>
          <a
            href={(config as any).infoGenerali?.linkInstagram || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-display tracking-widest uppercase px-8 py-4 transition-colors duration-300 text-sm"
            style={{ backgroundColor: heroColors.buttonBg || pageColors.accent, color: heroColors.buttonText || pageColors.background }}
          >
            <Instagram size={20} /> {(config as any).sezioneInstagram?.testoBottone || "Segui"}
          </a>
        </motion.div>
      </section>

      {/* ============================== CONTACT ============================== */}
      <section id="contatti" className="relative py-24 md:py-36 px-5 md:px-8" style={{ backgroundColor: sectionColors.contatti.background || pageColors.background, color: sectionColors.contatti.text || pageColors.text }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <p className="font-display tracking-[0.3em] text-sm mb-4 uppercase" style={{ color: sectionColors.contatti.accent || pageColors.accent }}>
              {(config as any).sezioneContatti?.preTitolo || "Vieni a Trovarci"}
            </p>
            <h2 className="font-display text-6xl md:text-8xl uppercase leading-none" style={{ color: sectionColors.contatti.title || pageColors.title }}>
              {(config as any).sezioneContatti?.titoloGrande || "Contatti"}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-start gap-4">
                <MapPin className="flex-shrink-0 mt-1" size={24} style={{ color: sectionColors.contatti.accent || pageColors.accent }} />
                <div>
                  <p className="font-display uppercase tracking-wide text-sm mb-1" style={{ color: sectionColors.contatti.accent || pageColors.accent }}>Dove Siamo</p>
                  <p className="text-lg">{config.infoGenerali.contatti?.indirizzo || "Il tuo indirizzo"}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="flex-shrink-0 mt-1" size={24} style={{ color: sectionColors.contatti.accent || pageColors.accent }} />
                <div>
                  <p className="font-display uppercase tracking-wide text-sm mb-1" style={{ color: sectionColors.contatti.accent || pageColors.accent }}>Telefono</p>
                  <a href={`tel:${config.infoGenerali.contatti?.telefono || ""}`} className="text-lg transition-colors" style={{ color: sectionColors.contatti.text || pageColors.text }}>{config.infoGenerali.contatti?.telefono || "Il tuo numero"}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="flex-shrink-0 mt-1" size={24} style={{ color: sectionColors.contatti.accent || pageColors.accent }} />
                <div>
                  <p className="font-display uppercase tracking-wide text-sm mb-1" style={{ color: sectionColors.contatti.accent || pageColors.accent }}>Email</p>
                  <a href={`mailto:${config.infoGenerali.contatti?.email || ""}`} className="text-lg transition-colors break-all" style={{ color: sectionColors.contatti.text || pageColors.text }}>{config.infoGenerali.contatti?.email || "la tua email"}</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="flex-shrink-0 mt-1" size={24} style={{ color: sectionColors.contatti.accent || pageColors.accent }} />
                <div className="w-full">
                  <p className="font-display uppercase tracking-wide text-sm mb-2" style={{ color: sectionColors.contatti.accent || pageColors.accent }}>Orari</p>
                  <ul className="text-sm md:text-base space-y-1 w-full max-w-[22rem]" style={{ color: hexToRgba(pageColors.text, 0.85) }}>
                    {HOURS.map((h) => (
                      <li key={h.day} className="flex items-center justify-between gap-3 border-b border-[#F5F2EA]/10 py-1 whitespace-nowrap">
                        <span className="flex-shrink-0">{h.day}</span>
                        <span className="text-right leading-tight" style={{ color: pageColors.text }}>{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 mt-2">
                <a
                  href={config.infoGenerali.linkWhatsApp ? `https://wa.me/${config.infoGenerali.linkWhatsApp.replace(/\D/g, "")}` : "https://wa.me/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display tracking-widest uppercase px-6 py-3 hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: sectionColors.contatti.buttonBg || pageColors.accent, color: sectionColors.contatti.buttonText || pageColors.background }}
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={`tel:${config.infoGenerali.contatti?.telefono || ""}`}
                  className="inline-flex items-center gap-2 font-display tracking-widest uppercase border px-6 py-3 transition-colors text-sm"
                  style={{ borderColor: hexToRgba(sectionColors.contatti.border || pageColors.border, 0.4), backgroundColor: sectionColors.contatti.secondaryBg || "transparent", color: sectionColors.contatti.secondaryText || sectionColors.contatti.text || pageColors.text }}
                >
                  <Phone size={18} /> Chiama
                </a>
                <a
                  href={config.infoGenerali.linkInstagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display tracking-widest uppercase px-6 py-3 transition-colors text-sm"
                  style={{ backgroundColor: sectionColors.contatti.secondaryBg || sectionColors.contatti.buttonBg || pageColors.accent, color: sectionColors.contatti.secondaryText || sectionColors.contatti.buttonText || pageColors.background }}
                >
                  <Instagram size={18} /> Instagram
                </a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[400px] md:h-full min-h-[400px] border border-[#F5F2EA]/15"
            >
              <iframe
                title={`${config.infoGenerali.nomeAttivita || "Il tuo locale"} su Google Maps`}
                className="w-full h-full"
                style={{ border: 0, filter: "invert(92%) hue-rotate(180deg)" }}
                loading="lazy"
                allowFullScreen
                src={config.infoGenerali.linkMappe || "https://www.google.com/maps?q=Trieste,+Italy&output=embed"}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="border-t py-10 px-5 md:px-8 text-center" style={{ borderColor: hexToRgba(pageColors.border, 0.1) }}>
        <img
          src={config.infoGenerali.logo || (config as any).slotImmagini?.logo || "/logo.jpg"}
          alt={`${config.infoGenerali.nomeAttivita} logo`}
          className="h-20 w-20 mx-auto mb-4 rounded-full object-cover border"
          style={{ borderColor: hexToRgba(pageColors.accent, 0.4) }}
          onError={(event) => handleImageError(event)}
        />
          <p className="font-display text-2xl tracking-wider mb-2" style={{ color: sectionColors.footer.title || pageColors.title }}>
          {(config as any).sezioneContatti?.footerTitolo || config.infoGenerali.nomeAttivita || "Il tuo locale"}
        </p>
        <p className="text-sm" style={{ color: hexToRgba(sectionColors.footer.text || pageColors.text, 0.5) }}>
          {(config as any).sezioneContatti?.footerCopyright || `© ${new Date().getFullYear()} ${config.infoGenerali.nomeAttivita || "Il tuo locale"} — ${config.infoGenerali.contatti?.indirizzo || "Il tuo indirizzo"}`}
        </p>
        <p className="text-sm" style={{ color: hexToRgba(sectionColors.footer.text || pageColors.text, 0.5) }}>
          {(config as any).sezioneContatti?.footerCopyrightSecondaRiga || `© ${config.infoGenerali.nomeAttivita || "Il tuo locale"}. All rights reserved.`}
        </p>
        {(config as any).sezioneContatti?.footerEmail ? (
          <p className="mt-3 text-sm" style={{ color: hexToRgba(sectionColors.footer.text || pageColors.text, 0.5) }}>
            {(config as any).sezioneContatti?.footerEmail}
          </p>
        ) : null}
      </footer>
    </main>
  );
}
