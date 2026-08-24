/**
 * Checkout — NOT YET IMPLEMENTED.
 *
 * Deliberately left as a stub. The site is `output: 'static'`, so
 * turning this on requires a server surface. Two options when you
 * get there:
 *
 *   A. Stripe Payment Links (no backend)
 *      Create links in the Stripe dashboard, store the URL per item
 *      in content.json, and have the UI link straight out. Simplest
 *      path; keeps the site fully static.
 *
 *   B. Stripe Checkout Sessions (needs a serverless function)
 *      Add `@astrojs/vercel` and switch to `output: 'hybrid'`, then
 *      add `src/pages/api/checkout.ts` with `export const prerender
 *      = false`. That endpoint calls stripe.checkout.sessions.create
 *      with the line items from catalog.ts and returns the session
 *      URL. Only that one route becomes dynamic; everything else
 *      stays static.
 *
 * For deposits or custom quotes — likely the real use case for a
 * caterer — option A against a fixed deposit amount is usually
 * enough.
 *
 * Whichever path, flip `features.checkout` in src/config.ts to
 * reveal the UI.
 */
import type { LineItem } from './types';

export class CheckoutNotConfiguredError extends Error {
  constructor() {
    super(
      'Checkout is not configured yet. See src/lib/commerce/checkout.ts for the two integration paths.'
    );
    this.name = 'CheckoutNotConfiguredError';
  }
}

export async function createCheckoutSession(
  _lines: LineItem[]
): Promise<{ url: string }> {
  throw new CheckoutNotConfiguredError();
}
