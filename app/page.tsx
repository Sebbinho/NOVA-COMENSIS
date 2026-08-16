"use client"

import React from "react";
import config from "../sitoConfig";

// Parse Italian date strings like "10 Ottobre 2026 - 21:15"
function parseItalianDate(input: string): Date | null {
  if (!input) return null;
  const months: Record<string, number> = {
    gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
    luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
  };
  // normalize
  const parts = input.split("-").map(p => p.trim());
  // parts[0]: date like "10 Ottobre 2026" or "10 Ottobre 2026"
  // parts[1]: time like "21:15" or may be part of same string
  const datePart = parts[0];
  const timePart = parts[1] || "00:00";
  const dateTokens = datePart.split(" ").filter(Boolean);
  if (dateTokens.length < 3) return null;
  const day = parseInt(dateTokens[0], 10);
  const monthName = dateTokens[1].toLowerCase();
  const year = parseInt(dateTokens[2], 10);
  const month = months[monthName];
  if (isNaN(day) || isNaN(year) || month === undefined) return null;
  const timeMatch = timePart.match(/(\d{1,2}:\d{2})/);
  const [hours, minutes] = (timeMatch ? timeMatch[1] : "00:00").split(":").map(Number);
  return new Date(year, month, day, hours || 0, minutes || 0);
}

function basename(path: string) {
  if (!path) return "";
  return path.split("/").pop() || path;
}

export default function HomePage() {
  const cfg: any = config;

  // Prepare matches: parse date, filter out matches before start of today, sort ascending (nearest first)
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const matchesRaw = Array.isArray(cfg.prossimePartite) ? cfg.prossimePartite : [];
  const matches = matchesRaw
    .map((m: any) => ({ ...m, _dateObj: parseItalianDate(m.date) }))
    .filter((m: any) => m._dateObj && m._dateObj >= startOfToday)
    .sort((a: any, b: any) => a._dateObj - b._dateObj);

  const [currentMatchIndex, setCurrentMatchIndex] = React.useState(0);
  const [expandedMatches, setExpandedMatches] = React.useState(false);
  const [activeNews, setActiveNews] = React.useState<any | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const marqueeRef = React.useRef<HTMLDivElement | null>(null);
  const nextMatch = matches[0] || null;

  // Normalize hero src to ensure leading slash for public assets
  const rawHero = (cfg.heroNova && (cfg.heroNova.bgImage || cfg.heroNova?.image)) || cfg.slotImmagini?.heroBg || '';
  const heroSrc = (rawHero && rawHero.startsWith('/')) ? rawHero : ('/' + rawHero);

  React.useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.14 });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    // Reset index if matches change
    setCurrentMatchIndex(0);
  }, [matches.length]);

  // Compute marquee duration dynamically so the full set scrolls at a consistent speed
  React.useEffect(() => {
    const marqueeNode = marqueeRef.current;
    if (!marqueeNode) return;

    function update() {
      const element = marqueeNode;
      if (!element) return;

      const sponsors = Array.isArray(cfg.sponsorsNova) ? cfg.sponsorsNova : [];
      const baseCount = sponsors.length || 1;
      const trackWidth = Math.max(1, element.scrollWidth / Math.max(2, Math.min(4, baseCount / 4 + 2)));
      const pxPerSec = 500;
      const duration = Math.max(20, trackWidth / pxPerSec);
      element.style.setProperty('--marquee-duration', `${duration}s`);
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [cfg.sponsorsNova]);

  function formatVersus(m: any) {
    const novaName = cfg.teamInfo?.name || "NOVA COMENSIS";
    if (!m) return "";
    if (!m.sqHOME || m.sqHOME === "") return `${novaName} vs ${m.sqAWAY}`;
    if (!m.sqAWAY || m.sqAWAY === "") return `${m.sqHOME} vs ${novaName}`;
    return `${novaName} vs ${m.sqAWAY || m.sqHOME}`;
  }

  return (
    <main className="antialiased">
      {/* HERO */}
      <section id="home" className="relative w-full">
        <div className="h-[68vh] md:h-[78vh] lg:h-[82vh] relative overflow-hidden">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <img
            src={heroSrc}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null;
              const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#0B1B36' width='100%' height='100%'/><text x='50%' y='50%' fill='#C59B27' font-family='Montserrat, Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'>Hero</text></svg>`;
              img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--nova-navy)]/70 via-[var(--nova-blue)]/30 to-[var(--nova-navy)]/90" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-end md:justify-between items-start md:items-end h-full">
            <div className="text-left md:text-left max-w-3xl self-start md:self-auto hero-content">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/80 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--nova-gold)] shadow-[0_0_20px_rgba(217,177,82,0.8)]" />
                {cfg.teamInfo?.league || 'Campionato CSI'}
              </div>
              <img
                src={cfg.teamInfo?.logo || cfg.slotImmagini.logo}
                alt={cfg.teamInfo?.name || cfg.infoGenerali.nomeAttivita}
                className="h-24 w-24 md:h-28 md:w-28 object-contain rounded-full border-4 mt-5 shadow-[0_20px_45px_rgba(11,27,54,0.35)]"
                style={{ borderColor: "var(--nova-gold)" }}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.onerror = null;
                  const name = cfg.teamInfo?.name || 'NOVA COMENSIS';
                  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect fill='#FFFFFF' width='100%' height='100%'/><text x='50%' y='50%' fill='#0B1B36' font-family='Montserrat, Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'>${name}</text></svg>`;
                  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                }}
              />
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mt-4 leading-[0.9] tracking-[0.08em]">{cfg.heroNova?.title || cfg.infoGenerali.nomeAttivita}</h1>
              <p className="font-script text-2xl md:text-4xl text-[var(--nova-cyan)] mt-3 drop-shadow-[0_6px_20px_rgba(115,210,255,0.35)]">{cfg.heroNova?.subtitle || cfg.teamInfo?.slogan}</p>

              <a
                href="#partite"
                className="hero-match-cta mt-6 block w-full max-w-xl group"
                aria-label={nextMatch ? `Vai alla prossima partita contro ${formatVersus(nextMatch)}` : 'Vai alla sezione partite'}
              >
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 p-4 md:p-5 backdrop-blur-sm shadow-[0_18px_45px_rgba(7,26,47,0.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_rgba(7,26,47,0.45)]" style={{ background: 'rgba(7, 26, 47, 0.7)' }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/65">Prossima partita</p>
                    <p className="mt-2 text-lg md:text-xl font-display text-white leading-none tracking-[0.05em]">
                      {nextMatch ? formatVersus(nextMatch) : 'NOVA COMENSIS vs Avversario'}
                    </p>
                    <p className="mt-2 text-xs md:text-sm text-white/75">{nextMatch ? nextMatch.date : 'Scopri il calendario completo'}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--nova-gold)] text-lg text-[var(--nova-navy)] shadow-[0_12px_30px_rgba(217,177,82,0.45)] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CHI SIAMO */}
      <section id="chi-siamo" className="py-16 bg-white text-[var(--nova-navy)]" data-reveal>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-display text-3xl mb-4">{cfg.chiSiamoNova?.title || cfg.infoGenerali?.nomeAttivita}</h2>
          <p className="text-lg leading-relaxed">{cfg.chiSiamoNova?.description || cfg.infoGenerali?.descrizione || cfg.infoGenerali?.nomeAttivita}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded" style={{ borderColor: "var(--nova-gold)" }}>
              <h3 className="font-display text-sm">Presidenti</h3>
              <ul className="mt-2">
                {(cfg.teamInfo?.presidents || []).map((p: string) => <li key={p} className="text-sm">{p}</li>)}
              </ul>
            </div>

            <div className="p-4 border rounded" style={{ borderColor: "var(--nova-gold)" }}>
              <h3 className="font-display text-sm">Mister</h3>
              <p className="mt-2">{cfg.teamInfo?.coach}</p>
            </div>

          </div>
        </div>
      </section>

      {/* PROSSIME PARTITE */}
      <section id="partite" className="py-12 bg-[var(--nova-navy)] text-white" data-reveal>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Prossime Partite / Eventi</h2>
          </div>

          {matches.length === 0 ? (
            <div className="p-6 rounded-md bg-[rgba(255,255,255,0.03)]">Nessuna partita in programma</div>
          ) : (
            <>
              <div className="relative">
                <div className="matches-track" ref={trackRef} onScroll={() => {
                  const el = trackRef.current; if (!el) return;
                  const center = el.scrollLeft + el.clientWidth / 2;
                  let nearest = 0; let nearestDist = Infinity;
                  Array.from(el.children).forEach((ch, idx) => {
                    const c = ch as HTMLElement;
                    const cCenter = c.offsetLeft + c.offsetWidth / 2;
                    const d = Math.abs(cCenter - center);
                    if (d < nearestDist) { nearestDist = d; nearest = idx; }
                  });
                  setCurrentMatchIndex(nearest);
                }}>
                  {matches.map((m: any, idx: number) => (
                    <div key={idx} className="match-card">
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/70">{m.date}</div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="match-team match-team--home">{m.sqHOME || 'NOVA COMENSIS'}</span>
                        <span className="match-vs">vs</span>
                        <span className="match-team match-team--away">{m.sqAWAY || 'Avversario'}</span>
                      </div>
                      <div className="mt-3 text-sm text-white/70">{m.location}</div>
                    </div>
                  ))}
                </div>

                {/* Left / Right arrows (desktop) */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:block">
                  <button className="matches-arrow" onClick={() => {
                    const el = trackRef.current; if (!el) return; el.scrollBy({ left: -Math.round(el.clientWidth * 0.6), behavior: 'smooth' });
                  }}>‹</button>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block">
                  <button className="matches-arrow" onClick={() => {
                    const el = trackRef.current; if (!el) return; el.scrollBy({ left: Math.round(el.clientWidth * 0.6), behavior: 'smooth' });
                  }}>›</button>
                </div>

                <div className="flex items-center justify-center gap-2 mt-3">
                  {matches.map((matchItem: any, i: number) => (
                    <button
                      key={`${matchItem.id || 'match'}-${i}`}
                      onClick={() => {
                        const el = trackRef.current; if (!el) return; const card = el.children[i] as HTMLElement; el.scrollTo({ left: card.offsetLeft - 8, behavior: 'smooth' });
                      }}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${i === currentMatchIndex ? 'bg-[var(--nova-gold)] shadow-[0_0_18px_rgba(217,177,82,0.9)] scale-125' : 'bg-white/30 hover:bg-white/55'}`}
                      aria-label={`Vai a ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <button className="match-toggle-btn" onClick={() => setExpandedMatches(e => !e)}>{expandedMatches ? 'Chiudi elenco' : 'Apri elenco'}</button>
                </div>
              </div>

              <div className={`match-panel ${expandedMatches ? 'is-open' : ''}`}>
                <div className="mt-4 space-y-3">
                  {matches.map((m: any, idx: number) => (
                    <div key={idx} className="expanded-match-item">
                      <div className="text-[10px] uppercase tracking-[0.24em] text-[var(--nova-navy)]/60">{m.date}</div>
                      <div className="mt-2 font-display text-lg tracking-[0.05em] text-[var(--nova-navy)]">{m.sqHOME || 'NOVA COMENSIS'} <span className="mx-2 text-[var(--nova-gold)]">vs</span> {m.sqAWAY || 'Avversario'}</div>
                      <div className="text-sm text-[var(--nova-navy)]/75">{m.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* NOTIZIE */}
      <section id="notizie" className="py-12 bg-white text-[var(--nova-navy)]" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl mb-4">Notizie</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(cfg.news || []).map((n: any, idx: number) => (
              <article key={idx} className="news-card">
                <div className="flex items-start gap-4">
                  <div className="w-28 h-20 overflow-hidden rounded-lg">
                    <img src={(n.image && n.image.startsWith('/')) ? n.image : '/' + n.image} alt={n.title} className="w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250'><rect fill='#0B1B36' width='100%' height='100%'/><text x='50%' y='50%' fill='#C59B27' font-family='Montserrat, Arial, sans-serif' font-size='16' dominant-baseline='middle' text-anchor='middle'>News</text></svg>`);}}/>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl leading-none tracking-[0.05em] text-[var(--nova-navy)]">{n.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{n.date} — {n.excerpt}</p>
                    <div className="mt-3">
                      <button className="news-button" onClick={() => setActiveNews(n)}>Leggi</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERIA FOTO */}
      <section id="galleria" className="py-12 bg-[var(--nova-navy)] text-white" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl mb-6">Galleria Foto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(() => {
              const seen = new Set<string>();
              const slots = (cfg.galleriaNova?.slots || []).map((s: any, idx: number) => {
                const raw = (s.file && s.file.startsWith('/')) ? s.file : ('/' + (s.file || ''));
                // normalize to gallery folder if possible
                const name = raw.split('/').pop() || '';
                const normalized = raw.startsWith('/assets/gallery/') ? raw : ('/assets/gallery/' + name);
                // if duplicate, replace with placeholder
                if (seen.has(normalized)) {
                  console.warn(`Gallery slot duplicate detected: ${normalized} (slot ${idx}). Using placeholder.`);
                  return { ...s, file: '/assets/placeholder-hero.svg', caption: s.caption || 'Placeholder' };
                }
                seen.add(normalized);
                return { ...s, file: normalized };
              });
              return slots.map((s: any, idx: number) => (
                <figure key={idx} className="w-full h-64 rounded overflow-hidden bg-gray-100 flex flex-col">
                  <img
                    src={(s.file && s.file.startsWith('/')) ? s.file : '/' + s.file}
                    alt={s.caption}
                    className="gallery-slot flex-1 w-full object-cover"
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      img.onerror = null;
                      const text = s.caption || 'Immagine';
                      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#0B1B36' width='100%' height='100%'/><text x='50%' y='50%' fill='#C59B27' font-family='Montserrat, Arial, sans-serif' font-size='28' dominant-baseline='middle' text-anchor='middle'>${text}</text></svg>`;
                      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
                    }}
                  />
                  <figcaption className="p-2 text-sm bg-white/50">{s.caption}</figcaption>
                </figure>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* STORIA E FONDATORI */}
      <section id="storia" className="py-12 bg-white text-[var(--nova-navy)]" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-2xl mb-4">La Storia</h2>
          <p className="text-lg text-gray-700 mb-6">{cfg.storia?.intro}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 bg-[rgba(1,6,23,0.03)] rounded">
              <h3 className="font-semibold mb-2">Origini</h3>
              <p className="text-sm text-gray-700">{cfg.storia?.full}</p>
            </div>
            <div className="p-4">
              <img src={(cfg.storia?.heroFoto) ? ((cfg.storia.heroFoto.startsWith('/')) ? cfg.storia.heroFoto : '/' + cfg.storia.heroFoto) : '/assets/storia/storia-1.png'} alt="Storia" className="w-full h-56 object-cover rounded" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/assets/storia/storia-1.png';}} />
            </div>
          </div>

        </div>
      </section>

      {/* FONDATORI - full-width navy band */}
      <section id="fondatori" className="py-12 bg-[var(--nova-navy)] text-white" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-display text-xl mt-2 mb-6">I Fondatori</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(cfg.fondatori || []).map((f: any, idx: number) => {
              const instaUrl = f.name === 'Claudio Galli'
                ? 'https://www.instagram.com/claudio_gallii/'
                : f.name === 'Lorenzo Ferro'
                  ? 'https://www.instagram.com/_lorenzoferro227_/'
                  : '';

              return (
                <a
                  key={idx}
                  href={instaUrl || '#'}
                  target={instaUrl ? '_blank' : undefined}
                  rel={instaUrl ? 'noreferrer' : undefined}
                  className={`founder-card ${instaUrl ? 'is-clickable' : ''}`}
                  aria-label={instaUrl ? `Apri Instagram di ${f.name}` : undefined}
                >
                  <div className="w-full h-44 overflow-hidden rounded mb-3"><img src={(f.photo) ? ((f.photo.startsWith('/')) ? f.photo : '/' + f.photo) : '/assets/fondatori/fondatore-1.png'} alt={f.name} className="w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/assets/fondatori/fondatore-1.png';}}/></div>
                  <h4 className="font-semibold">{f.name}</h4>
                  <div className="text-sm">{f.role}</div>
                  <p className="text-sm mt-2">{f.bio}</p>
                  {instaUrl && <span className="founder-tag">Instagram</span>}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPONSOR CAROUSEL - bottom */}
      <section id="sponsors" className="py-8 bg-white text-[var(--nova-navy)]" data-reveal>
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="font-display text-xl mb-4">Sponsor</h3>
          <div className="marquee-wrapper">
            <div className="marquee marquee-blue">
              <div className="marquee-track" ref={marqueeRef}>
                {(() => {
                  const sponsors = Array.isArray(cfg.sponsorsNova) ? cfg.sponsorsNova : [];
                  const repeated = [...sponsors, ...sponsors, ...sponsors, ...sponsors];
                  return repeated.map((s: any, idx: number) => (
                    <a key={`${s.id || 'sponsor'}-${idx}`} href={s.url || '#'} className="sponsor-item inline-flex items-center justify-center opacity-95 px-2 md:px-3">
                      <img
                        src={(s.logo && s.logo.startsWith('/')) ? s.logo : (s.logo ? '/' + s.logo : '/assets/sponsors/placeholder-sponsor.png')}
                        alt={s.name || `Sponsor ${idx + 1}`}
                        className="sponsor-logo h-28 md:h-32 w-auto object-contain"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = '/assets/sponsors/placeholder-sponsor.png';
                        }}
                      />
                    </a>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* NOTIZIE */}
        {/* NOTIZIE moved below partite */}

      {/* CONTATTI & MAPPA */}
      <section id="contatti" className="py-12 bg-[var(--nova-navy)] text-white" data-reveal>
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-display text-2xl">Contatti</h3>
            <ul className="mt-4 text-sm space-y-2">
              <li><strong>Email:</strong> <a href={`mailto:${cfg.contattiNova.email}`} className="text-[var(--nova-blue)]">{cfg.contattiNova.email}</a></li>
              <li><strong>Instagram:</strong> <a href={cfg.contattiNova.instagram} className="text-[var(--nova-blue)]">{cfg.contattiNova.instagram}</a></li>
              <li><strong>Sede Legale:</strong> {cfg.contattiNova.legalAddress}</li>
              <li><strong>Campo:</strong> {cfg.contattiNova.stadiumName} — {cfg.contattiNova.stadiumAddress}</li>
            </ul>

            {/* MAPPA moved under contatti */}
            <div className="mt-6">
              <h4 className="font-display text-lg mb-2">Mappa</h4>
              <div className="w-full h-56 rounded overflow-hidden border mb-4" style={{ borderColor: "var(--nova-gold)" }}>
                <iframe
                  src={cfg.contattiNova.mapsUrl ? `${cfg.contattiNova.mapsUrl.replace('https://maps.google.com/?q=', 'https://www.google.com/maps?q=')}&output=embed` : 'https://www.google.com/maps?q=Via+Adamello+18+Como&z=15&output=embed'}
                  loading="lazy"
                  className="w-full h-full"
                  title="Mappa Centro Sportivo del Tavernola"
                  allowFullScreen
                />
              </div>

              {/* Zeus x Nova composition under map */}
              <div className="flex items-center gap-6">
                <img src={(cfg.teamInfo?.logo && cfg.teamInfo.logo.startsWith('/')) ? cfg.teamInfo.logo : '/' + (cfg.teamInfo?.logo || cfg.slotImmagini?.logo)} alt={cfg.teamInfo?.name || 'Nova Comensis'} className="h-28 w-auto object-contain rounded" onError={(e)=>{const img=e.currentTarget as HTMLImageElement; img.onerror=null; img.src='/assets/logo-nova-comensis.png';}} />
                <div style={{width:3, height:56, backgroundColor:'#FFFFFF'}} aria-hidden="true" />
                {(() => {
                  const zeus = (cfg.sponsorsNova || []).find((s: any) => s.id === 'sponsor-5') || (cfg.sponsorsNova || [])[4] || null;
                  const src = zeus ? ((zeus.logo && zeus.logo.startsWith('/')) ? zeus.logo : ('/' + zeus.logo)) : '/assets/sponsors/placeholder-sponsor.png';
                  return (
                    <img src={src} alt={zeus?.name || 'Zeus'} className="h-28 w-auto object-contain" onError={(e)=>{const img=e.currentTarget as HTMLImageElement; img.onerror=null; img.src='/assets/sponsors/placeholder-sponsor.png';}} />
                  );
                })()}
              </div>

              <div className="mt-3 text-sm text-white/80">sebastiankreso@gmail.com - Sebastian Kreso</div>
            </div>
          </div>

          <div>
            {/* Right column intentionally left blank (map is shown above) */}
          </div>
        </div>
      </section>
      {/* NEWS MODAL */}
      {activeNews && (
        <div className="modal-overlay" onClick={() => setActiveNews(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-2">{activeNews.title}</h2>
            <div className="text-sm text-gray-600 mb-4">{activeNews.date}</div>
            <div className="prose max-w-none text-[var(--nova-navy)]">
              <p>{activeNews.content}</p>
            </div>
            <div className="mt-4 text-right">
              <button className="px-3 py-2 bg-[var(--nova-gold)] rounded" onClick={() => setActiveNews(null)}>Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
