/**
 * Commerce types.
 *
 * These deliberately mirror the shape of a Stripe line item so the
 * menu data in content.json can be handed to a checkout session with
 * minimal translation when the time comes.
 */

export type DietaryMark = 'v' | 'vg' | 'gf';

/** JTCC sells drop-off items by tray, not per head. */
export type PortionSize = 'small' | 'large';

/** Whole dollars per tray. Small serves 5, large serves 10. */
export interface TrayPrice {
  small: number;
  large: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: TrayPrice;
  /** Modifiers, add-ons, and dietary caveats, as written on the printed menu. */
  note: string;
  dietary: DietaryMark[];
  image: ImageRef | null;
}

export interface ImageRef {
  key: string;
  remote: string;
  alt: string;
  width: number;
  height: number;
}

export interface MenuSection {
  name: string;
  items: MenuItem[];
}

/** What a checkout would actually be handed. */
export interface LineItem {
  id: string;
  name: string;
  /** Price in the smallest currency unit — cents. Stripe expects this. */
  unitAmount: number;
  quantity: number;
  currency: string;
}
