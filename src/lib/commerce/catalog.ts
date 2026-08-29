/**
 * Catalog — the seam between site content and anything transactional.
 *
 * The site deliberately publishes no prices: every quote is written
 * per event. So there is no priced catalog to expose yet.
 *
 * When Stripe arrives it will most likely be for fixed-amount things
 * — a booking deposit, a seasonal dinner with a set price — rather
 * than a per-plate menu. Define those here as LineItems and the
 * checkout layer can consume them without touching presentation code.
 */
import { site } from '~/config';
import type { LineItem } from './types';

/** Dollars -> cents. Stripe works in the smallest currency unit. */
export function toUnitAmount(dollars: number): number {
  return Math.round(dollars * 100);
}

export function makeLineItem(
  id: string,
  name: string,
  dollars: number,
  quantity = 1
): LineItem {
  return {
    id,
    name,
    unitAmount: toUnitAmount(dollars),
    quantity,
    currency: site.currency.toLowerCase(),
  };
}

export function subtotal(lines: LineItem[]): number {
  return lines.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0);
}

export function formatPrice(dollars: number): string {
  return new Intl.NumberFormat(site.locale, {
    style: 'currency',
    currency: site.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
}
