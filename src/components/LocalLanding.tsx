import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Star } from 'lucide-react';
import kitchen from '@/assets/bristol-home.jpg';
import sitting from '@/assets/sitting-room.jpg';
import extension from '@/assets/extension.jpg';
import { CampaignCTA } from '@/components/CampaignCTA';
import { TEMPLATE_HEADLINE, TEMPLATE_SUPPORT } from '@/lib/cta';
import { LOCATIONS, locationDescription, locationTitle, type Location } from '@/lib/locations';
import { useMeta } from '@/lib/meta';

const STEPS = [
  { n: '01', t: 'Scope', d: 'What you need, and what you do not. We walk the house with you and separate the essentials from the nice-to-haves.' },
  { n: '02', t: 'Budget', d: 'Itemised ranges drawn from recent local projects, including the unglamorous bits like rewiring, drainage and fees.' },
  { n: '03', t: 'Timings', d: 'A realistic sequence from drawings to handover, with planning, party wall and lead times accounted for.' },
  { n: '04', t: 'Team', d: 'Introductions to architects, structural engineers and builders we have worked alongside for years.' },
];

const FAQ = [
  { q: 'What happens in the consultation?', a: 'A 45-minute conversation, at home or by video, about what you want to change, roughly what it might cost and the order things need to happen in. You leave with written notes.' },
  { q: 'Is it really free?', a: 'Yes. The first consultation is free and there is no obligation to work with us afterwards. Some people simply want a second opinion before speaking to builders.' },
  { q: 'Do you do the building work?', a: 'No. We are advisers, not contractors. That independence means our recommendations are about your home, not about filling a diary.' },
  { q: 'Do I need planning permission?', a: 'It depends on the property, the street and the project. We check permitted development, conservation areas and listed status early, so there are no surprises.' },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="bs-faq">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className={`bs-faq-item ${isOpen ? 'is-open' : ''}`}>
            <h3>
              <button aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(isOpen ? null : i)} data-testid={`button-faq-${i}`}>
                <span className="bs-serif">{f.q}</span>
                <Plus size={18} aria-hidden />
              </button>
            </h3>
            <div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!isOpen}>
              <p>{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LocalLanding({ location }: { location: Location }) {
  useMeta(locationTitle(location), locationDescription(location));
  const nearby = LOCATIONS.filter((l) => l.slug !== location.slug).slice(0, 6);

  return (
    <div data-testid={`page-location-${location.slug}`}>
      <section className="bs-wrap bs-hero">
        <div className="bs-hero-copy">
          <p className="bs-eyebrow">Brightside {location.name}</p>
          <h1 className="bs-h1 bs-serif" data-testid="text-headline">{TEMPLATE_HEADLINE}</h1>
          <p className="bs-lede" data-testid="text-support">{TEMPLATE_SUPPORT}</p>
          <div className="bs-ctarow">
            <CampaignCTA locationSlug={location.slug} />
            <span className="bs-note">45 min · at home or video</span>
          </div>
          <div className="bs-trust">
            <span className="bs-stars" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={13} fill="currentColor" />)}
            </span>
            <span><b>4.8</b> from 312 local homeowners</span>
            <span>Est. 2009</span>
          </div>
        </div>
        <figure className="bs-photo">
          <img src={kitchen} alt={`Renovated kitchen in a Victorian terrace, ${location.name}`} />
          <span className="bs-badge"><strong className="bs-serif">1,140</strong>projects planned</span>
          <figcaption className="bs-cap">
            <span><strong className="bs-serif">{location.project}</strong>Planned with Brightside</span>
            <span>{location.weeks} weeks</span>
          </figcaption>
        </figure>
      </section>

      <div className="bs-strip">
        <div className="bs-wrap bs-strip-grid">
          {STEPS.map((s) => (
            <div key={s.n}><i>{s.n}</i><b>{s.t}</b>{s.d.split('.')[0]}.</div>
          ))}
        </div>
      </div>

      <section className="bs-wrap bs-local">
        <div>
          <p className="bs-eyebrow">Local knowledge · {location.area}</p>
          <h2 className="bs-h2 bs-serif">Homes in {location.name}, <em>understood.</em></h2>
          <p className="bs-lede">{location.intro}</p>
        </div>
        <dl className="bs-facts">
          <div><dt>Typical homes</dt><dd className="bs-serif">{location.homes}</dd></div>
          <div><dt>What we plan most</dt><dd className="bs-serif">{location.focus}</dd></div>
          <div><dt>Worth knowing</dt><dd>{location.note}</dd></div>
        </dl>
      </section>

      <section className="bs-moss-band">
        <div className="bs-wrap bs-process">
          <div className="bs-process-head">
            <p className="bs-eyebrow bs-eyebrow--light">How it works</p>
            <h2 className="bs-h2 bs-serif">Clarity before the first wall comes down.</h2>
          </div>
          <ol className="bs-steps">
            {STEPS.map((s) => (
              <li key={s.n}><span className="bs-serif">{s.n}</span><h3>{s.t}</h3><p>{s.d}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bs-wrap bs-gallery">
        <figure className="bs-g1"><img src={sitting} alt="Panelled sitting room in a Georgian townhouse" loading="lazy" /><figcaption>Sitting room restoration · Clifton</figcaption></figure>
        <figure className="bs-g2"><img src={extension} alt="Glazed rear extension opening onto a small garden" loading="lazy" /><figcaption>Rear extension · Redland</figcaption></figure>
        <blockquote className="bs-quote">
          <p className="bs-serif">“They told us the extension we wanted would cost more than the house was worth to us. The smaller one we built instead is perfect.”</p>
          <cite>Homeowner, Bishopston · illustrative testimonial</cite>
        </blockquote>
      </section>

      <section className="bs-wrap bs-faq-sec">
        <div>
          <p className="bs-eyebrow">Questions</p>
          <h2 className="bs-h2 bs-serif">Before you get in touch.</h2>
        </div>
        <Faq />
      </section>

      <section className="bs-wrap bs-closing">
        <div className="bs-closing-card">
          <h2 className="bs-h2 bs-serif">{TEMPLATE_HEADLINE}</h2>
          <p>Free and no-obligation, for homeowners in {location.name} and nearby.</p>
          <CampaignCTA locationSlug={location.slug} tone="paper" />
        </div>
        <nav className="bs-nearby" aria-label="Other areas">
          <span>Also covering</span>
          {nearby.map((l) => <Link key={l.slug} href={`/${l.slug}`}>{l.name}</Link>)}
          <Link href="/locations">All areas</Link>
        </nav>
      </section>
    </div>
  );
}

export default LocalLanding;
