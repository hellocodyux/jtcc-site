/**
 * Feature flags and build-time config.
 */
export const features = {
  /**
   * Stripe checkout. Stays false until payments are wired up. Every
   * commerce surface is gated on this.
   */
  checkout: false,

  /**
   * Sample menus from past events. Price-free by design — quotes are
   * written per event.
   *
   * Off until the placeholders in content.json are replaced with real
   * past-event menus. Then flip this to true.
   */
  sampleMenus: false,

  /**
   * The curated Media gallery. Off — the live Instagram feed covers
   * photography now. Content stays in content.json, so flipping this
   * to true brings the section back.
   */
  media: false,
} as const;

/**
 * Contact form delivery.
 *
 * Empty endpoint = the form opens a pre-filled email instead of
 * posting anywhere. Drop in a Formspree / Basin / Netlify Forms URL
 * and it starts posting. Nothing else needs to change.
 */
export const form = {
  endpoint: '',
  fallbackEmail: 'Info@joshuatreecateringco.com',
} as const;

export const site = {
  url: 'https://www.joshuatreecateringco.com',
  currency: 'USD',
  locale: 'en-US',
} as const;
