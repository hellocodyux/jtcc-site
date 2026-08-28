/**
 * Catalog: turns menu content into commerce-shaped data.
 *
 * The site reads menus from content.json for display. This module is
 * the seam between that content and anything transactional — so when
 * Stripe lands, it consumes LineItems from here rather than reaching
 * into presentation code.
 */
import content from '~/content/content.json';
import { site } from '~/config';
import type { MenuItem, MenuSection, LineItem } from './types';

export function getSections(): MenuSection[] {
  return content.menus.sections as MenuSection[];
}

export function getAllItems(): MenuItem[] {
  return getSections().flatMap((s) => s.items);
}

export function findItem(id: string): MenuItem | undefined {
  return getAllItems().find((i) => i.id === id);
}

/** Dollars -> cents. Stripe works in the smallest currency unit. */
export function toUnitAmount(dollars: number): number {
  return Math.round(dollars * 100);
}

/** Convert a menu item into a checkout-ready line item. */
export function toLineItem(item: MenuItem, quantity = 1): LineItem {
  return {
    id: item.id,
    name: item.name,
    unitAmount: toUnitAmount(item.price),
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
