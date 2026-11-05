/**
 * Free-licence placeholder media, listed on /docs: Unsplash photos (https://unsplash.com/license)
 * and the Mixkit scroll video (https://mixkit.co/license/#videoFree).
 */
export type ImageCredit = { file: string; photographer: string; url: string };

const unsplash = (photoId: string) => `https://unsplash.com/photos/${photoId}`;

export const IMAGE_CREDITS: ImageCredit[] = [
  { file: "hero-media.jpg", photographer: "Rezli", url: unsplash("OhTbOJH4w-w") },
  { file: "about-team.jpg", photographer: "Cherrydeck", url: unsplash("UpsEF48wAgk") },
  { file: "service-strategy.jpg", photographer: "Annie Vo", url: unsplash("HUuWNQmW58A") },
  { file: "service-identity.jpg", photographer: "Balázs Kétyi", url: unsplash("LPWl2pEVGKc") },
  { file: "service-web.jpg", photographer: "Hal Gatewood", url: unsplash("tZc3vjPCk-Q") },
  { file: "service-motion.jpg", photographer: "Peter Stumpf", url: unsplash("yk9VXp4W5-Q") },
  { file: "work-aurora.jpg", photographer: "Atlantic Money", url: unsplash("9XrefmwkHCs") },
  { file: "work-fieldnote.jpg", photographer: "Lex Sirikiat", url: unsplash("QouiCn7u6kw") },
  { file: "work-kinetic.jpg", photographer: "Danielle Cerullo", url: unsplash("CQfNt66ttZM") },
  { file: "work-halcyon.jpg", photographer: "Ian Schneider", url: unsplash("XJfHMPJ0e-g") },
  { file: "team-1.jpg", photographer: "Christina @ wocintechchat.com", url: unsplash("0Zx1bDv5BNY") },
  { file: "team-2.jpg", photographer: "LinkedIn Sales Solutions", url: unsplash("pAtA8xe_iVM") },
  { file: "team-3.jpg", photographer: "Christina @ wocintechchat.com", url: unsplash("SJvDxw0azqw") },
  { file: "team-4.jpg", photographer: "Ali Morshedlou", url: unsplash("WMD64tMfc4k") },
  { file: "avatar-1.jpg", photographer: "Clay Elliot", url: unsplash("mpDV4xaFP8c") },
  { file: "avatar-2.jpg", photographer: "Jurica Koletić", url: unsplash("7YVZYZeITc8") },
  { file: "avatar-3.jpg", photographer: "Christina @ wocintechchat.com", url: unsplash("Zpzf7TLj_gA") },
  { file: "blog-strategy.jpg", photographer: "FORTYTWO", url: unsplash("dEcBKGZS0P8") },
  { file: "blog-design-system.jpg", photographer: "Balázs Kétyi", url: unsplash("_x335IZXxfc") },
  { file: "blog-motion.jpg", photographer: "Jakob Owens", url: unsplash("kbd1oAf-9Ms") },
  { file: "blog-launch.jpg", photographer: "Christopher Gower", url: unsplash("m_HRfLhgABo") },
  {
    file: "scroll-video.mp4",
    photographer: "Mixkit",
    url: "https://mixkit.co/free-stock-video/the-graphic-designer-picks-colors-for-the-typography-design-on-50598/",
  },
];
