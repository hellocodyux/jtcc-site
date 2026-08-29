/**
 * Commerce types, shaped to match what Stripe expects.
 */
export interface LineItem {
  id: string;
  name: string;
  /** Price in the smallest currency unit — cents. */
  unitAmount: number;
  quantity: number;
  currency: string;
}

export interface ImageRef {
  key: string;
  remote: string;
  alt: string;
  width: number;
  height: number;
}
