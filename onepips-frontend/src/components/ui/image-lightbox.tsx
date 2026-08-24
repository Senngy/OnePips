"use client";

import { useCallback, useEffect, useState } from "react";

interface ImageLightboxProps {
  /** URL of the image to display. Lightbox is hidden when falsy. */
  src: string | null;
  /** Alt text for accessibility */
  alt?: string;
  /** Called when the user dismisses the lightbox */
  onClose: () => void;
}

/**
 * Generic full-screen image lightbox.
 *
 * Usage:
 * ```tsx
 * const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
 *
 * <img src={url} onClick={() => setLightboxSrc(url)} className="cursor-zoom-in" />
 * <ImageLightbox src={lightboxSrc} alt="Preview" onClose={() => setLightboxSrc(null)} />
 * ```
 */
export default function ImageLightbox({
  src,
  alt = "Image",
  onClose,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  console.log("[LIGHTBOX] visible:", visible, "src:", src);

  // Animate in when src is provided
  useEffect(() => {
    if (src) {
      setScale(1);
      setExiting(false);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [src]);

  // Keyboard support
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose();
    if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 4));
    if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
    if (e.key === "0") setScale(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!src) return;
    window.addEventListener("keydown", handleKey);
    // Prevent body scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [src, handleKey]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      setVisible(false);
      onClose();
    }, 250);
  };

  if (!src) return null;
console.log("[LIGHTBOX RENDER]", {
  src,
  visible,
  exiting,
})
  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[300] flex items-center justify-center transition-all duration-250
                ${visible && !exiting ? "bg-black/80 backdrop-blur-sm" : "bg-transparent backdrop-blur-none pointer-events-none"}
            `}
    >
      {/* Controls bar */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-2 transition-all duration-250 ${visible && !exiting ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zoom out */}
        <button
          onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
          disabled={scale <= 0.5}
          className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30"
          title="Dézoomer (−)"
        >
          <span className="material-symbols-outlined text-lg">zoom_out</span>
        </button>
        {/* Reset zoom */}
        <button
          onClick={() => setScale(1)}
          className="h-9 px-3 rounded-lg bg-surface-container border border-outline-variant/20 text-xs font-mono text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="Réinitialiser (0)"
        >
          {Math.round(scale * 100)}%
        </button>
        {/* Zoom in */}
        <button
          onClick={() => setScale((s) => Math.min(s + 0.25, 4))}
          disabled={scale >= 4}
          className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30"
          title="Zoomer (+)"
        >
          <span className="material-symbols-outlined text-lg">zoom_in</span>
        </button>

        <div className="w-px h-6 bg-outline-variant/30 mx-1" />

        {/* Open in new tab */}
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          title="Ouvrir dans un nouvel onglet"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
        </a>

        {/* Close */}
        <button
          onClick={handleClose}
          className="w-9 h-9 rounded-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          title="Fermer (Échap)"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      {/* Image */}
      <div
        className={`relative z-[310] opacity-100 scale-100`}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90vw", maxHeight: "90vh" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
            maxWidth: "90vw",
            maxHeight: "85vh",
            objectFit: "contain",
            borderRadius: "0.75rem",
            display: "block",
            cursor: scale > 1 ? "zoom-out" : "default",
          }}
          onClick={() => (scale > 1 ? setScale(1) : undefined)}
          onLoad={(e) => {
            const img = e.currentTarget;

            console.log("[LIGHTBOX IMAGE]", {
              src: img.src,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
              clientWidth: img.clientWidth,
              clientHeight: img.clientHeight,
            });
          }}
        />
      </div>

      {/* Bottom hint */}
      <p
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] text-white/40 tracking-widest uppercase transition-all duration-250 ${visible && !exiting ? "opacity-100" : "opacity-0"}`}
      >
        Cliquer en dehors ou <kbd className="font-mono">Échap</kbd> pour fermer
        · <kbd className="font-mono">+</kbd> /{" "}
        <kbd className="font-mono">-</kbd> pour zoomer
      </p>
    </div>
  );
}
