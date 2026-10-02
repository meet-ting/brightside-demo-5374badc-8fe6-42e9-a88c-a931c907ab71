/** Single source of truth for the campaign call to action. Pure, node-inspectable. */
export const CTA_LABEL = 'Get your free consultation';
export const CTA_PATH = '/consultation';
export const TEMPLATE_HEADLINE = 'Expert advice for your next home project';
export const TEMPLATE_SUPPORT =
  'Book a free, no-obligation consultation with a Brightside project adviser. We will help you shape the scope, budget and timings before you commit to anything.';

/** Router-relative href (wouter applies BASE_URL). */
export function ctaHref(locationSlug?: string): string {
  return locationSlug ? `${CTA_PATH}?location=${encodeURIComponent(locationSlug)}` : CTA_PATH;
}

/** Absolute href scoped to an artifact base, e.g. "/brightside/". */
export function ctaHrefWithBase(base: string, locationSlug?: string): string {
  return base.replace(/\/$/, '') + ctaHref(locationSlug);
}
