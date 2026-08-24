/**
 * Feature flags and build-time config.
 *
 * `checkout` stays false until Stripe is wired up. Every commerce
 * surface in the UI is gated on it, so flipping this to true is the
 * single switch that turns payments on.
 */
export const features = {
  checkout: false,
} as const;

export const site = {
  url: 'https://www.joshuatreecateringco.com',
  currency: 'USD',
  locale: 'en-US',
} as const;
