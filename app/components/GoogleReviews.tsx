"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

type Review = {
  author: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  relativeTime: string;
  time: number;
};

type ReviewsResponse = {
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
  error?: string;
  message?: string;
};

// Fallback reviews shown while the API isn't configured yet.
const FALLBACK_REVIEWS: Review[] = [
  {
    author: "Marco B.",
    rating: 5,
    text: "Esperienza impeccabile: servizio curato, piatti ben presentati e atmosfera davvero accogliente.",
    relativeTime: "2 settimane fa",
    time: 0,
  },
  {
    author: "Giulia R.",
    rating: 5,
    text: "Un posto che sa sorprendere con qualità, attenzione ai dettagli e un'ottima selezione di piatti.",
    relativeTime: "1 mese fa",
    time: 0,
  },
];

type GoogleReviewsProps = {
  theme?: {
    background?: string;
    text?: string;
    title?: string;
    accent?: string;
    border?: string;
    buttonText?: string;
    buttonBorder?: string;
  };
  title?: string;
  titleAccent?: string;
  subtitle?: string;
  buttonLabel?: string;
  fallbackReviews?: Review[];
  description?: string;
  averageRating?: number;
  totalReviews?: number;
};

export default function GoogleReviews({
  theme,
  title = "Recensioni",
  titleAccent = "Google",
  subtitle = "Cosa Dicono di Noi",
  buttonLabel = "Lascia una Recensione",
  fallbackReviews,
  description = "",
  averageRating,
  totalReviews,
}: GoogleReviewsProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const reviews =
    data?.reviews && data.reviews.length > 0 ? data.reviews : (fallbackReviews?.length ? fallbackReviews : FALLBACK_REVIEWS);
  const usingFallback = !data?.reviews || data.reviews.length === 0;
  const avgRating = averageRating ?? data?.rating ?? 4.8;
  const reviewCount = totalReviews ?? data?.totalReviews ?? 120;

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 320;
    el.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  const colors = {
    background: theme?.background || "#0A0A0A",
    text: theme?.text || "#F5F2EA",
    title: theme?.title || "#D9A31A",
    accent: theme?.accent || "#D9A31A",
    border: theme?.border || "rgba(245, 242, 234, 0.1)",
    buttonText: theme?.buttonText || "#F5F2EA",
    buttonBorder: theme?.buttonBorder || "rgba(245, 242, 234, 0.3)",
  };

  return (
    <section className="relative px-4 py-16 sm:px-6 md:px-8 md:py-24" style={{ backgroundColor: colors.background }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="font-display tracking-[0.3em] text-sm mb-4 uppercase" style={{ color: colors.accent }}>
            {subtitle}
          </p>
          <h2 className="font-display text-6xl md:text-8xl uppercase leading-none mb-4" style={{ color: colors.text }}>
            {title} <span style={{ color: colors.accent }}>{titleAccent}</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-lg">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i <= Math.round(avgRating)
                      ? "fill-current"
                      : "opacity-20"
                  }
                  style={{ color: colors.accent }}
                />
              ))}
            </div>
            <span className="font-display" style={{ color: colors.text }}>{avgRating.toFixed(1)}</span>
            <span className="text-sm" style={{ color: `${colors.text}80` }}>
              ({reviewCount} recensioni su Google)
            </span>
          </div>
        </motion.div>

        {!loading && usingFallback && (
          <p className="text-center text-xs mb-8 max-w-lg mx-auto" style={{ color: `${colors.text}66` }}>
            {description}
          </p>
        )}

        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            aria-label="Recensione precedente"
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 transition-colors duration-300"
            style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.accent }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Recensione successiva"
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-12 h-12 transition-colors duration-300"
            style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.accent }}
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 px-5 md:mx-0 md:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {reviews.map((review, i) => (
              <motion.div
                key={`${review.author}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="snap-start flex-shrink-0 w-[85%] sm:w-[360px] border p-4 sm:p-6 md:p-8 flex flex-col gap-4 transition-colors duration-300"
                style={{ borderColor: colors.border, backgroundColor: `${colors.accent}10` }}
              >
                <Quote className="text-[#D9A31A]/40" size={28} />
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= review.rating
                          ? "fill-current"
                          : "opacity-20"
                      }
                      style={{ color: colors.accent }}
                    />
                  ))}
                </div>
                <p className="text-sm md:text-base leading-relaxed flex-1" style={{ color: `${colors.text}d9` }}>
                  {review.text}
                </p>
                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: colors.border }}>
                  {review.authorPhoto ? (
                    <img
                      src={review.authorPhoto}
                      alt={review.author}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-display" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      {review.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-display text-sm tracking-wide" style={{ color: colors.text }}>{review.author}</p>
                    <p className="text-xs" style={{ color: `${colors.text}66` }}>{review.relativeTime}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href={`https://search.google.com/local/writereview?placeid=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-display tracking-widest uppercase border px-6 py-3 transition-colors duration-300 text-sm"
            style={{ borderColor: colors.buttonBorder, color: colors.buttonText }}
          >
            Lascia una Recensione
          </a>
        </div>
      </div>
    </section>
  );
}
