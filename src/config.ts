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
   * The Menus section. Currently hidden — the site leads with private
   * chef work and lets the Instagram feed carry the food story.
   *
   * The menu data is still in content.json and the commerce layer
   * still reads it, so flipping this to true brings the whole section
   * back exactly as it was.
   */
  menus: false,
} as const;

export const site = {
  url: 'https://www.joshuatreecateringco.com',
  currency: 'USD',
  locale: 'en-US',
} as const;
