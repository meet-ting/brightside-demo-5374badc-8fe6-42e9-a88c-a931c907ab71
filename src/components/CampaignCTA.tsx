import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { CTA_LABEL, ctaHref } from '@/lib/cta';

export { CTA_LABEL, ctaHref } from '@/lib/cta';

interface Props {
  locationSlug?: string;
  tone?: 'moss' | 'paper';
}

/** Shared campaign CTA. The label is fixed here; pages cannot override it. */
export function CampaignCTA({ locationSlug, tone = 'moss' }: Props) {
  return (
    <Link href={ctaHref(locationSlug)} className={`bs-cta bs-cta--${tone}`} data-testid="campaign-cta">
      {CTA_LABEL}
      <span className="arrow" aria-hidden>
        <ArrowRight size={14} />
      </span>
    </Link>
  );
}

export default CampaignCTA;
