/**
 * Catalog: turns menu content into commerce-shaped data.
 *
 * The site reads menus from content.json for display. This module is
 * the seam between that content and anything transactional — so when
 * Stripe lands, it consumes LineItems from here rather than reaching
 * into presentation code.
 *
 * Note the unit of sale: JTCC prices drop-off items per tray — small
 * (serves 5) or large (serves 10) — not per person. A line item is
 * therefore an item *plus a size*.
 */
import content from '~/content/content.json';
import { site } from '~/config';
import type { MenuItem, MenuSection, LineItem, PortionSize, TrayPrice } from './types';

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

/** Convert a menu item, at a given tray size, into a checkout-ready line item. */
export function toLineItem(
  item: MenuItem,
  size: PortionSize = 'small',
  quantity = 1
): LineItem {
  return {
    id: `${item.id}:${size}`,
    name: `${item.name} (${size === 'small' ? 'serves 5' : 'serves 10'})`,
    unitAmount: toUnitAmount(item.price[size]),
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

/** "80 | 160" — the way the printed menus write a tray price. */
export function formatTrayPrice(price: TrayPrice): string {
  return `${price.small} | ${price.large}`;
}
