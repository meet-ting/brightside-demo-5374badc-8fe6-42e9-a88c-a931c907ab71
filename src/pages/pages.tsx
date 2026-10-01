import { useMemo, useState, type FormEvent } from 'react';
import { Link, useSearch } from 'wouter';
import { ArrowRight, Check } from 'lucide-react';
import { LocalLanding } from '@/components/LocalLanding';
import { CANONICAL_SLUG, LOCATIONS, getLocation } from '@/lib/locations';
import { useMeta } from '@/lib/meta';

export function HomePage() {
  return <LocalLanding location={getLocation(CANONICAL_SLUG)!} />;
}

export function LocationPage({ params }: { params: { location: string } }) {
  const loc = getLocation(params.location);
  if (!loc) return <NotFoundPage slug={params.location} />;
  return <LocalLanding location={loc} />;
}

export function NotFoundPage({ slug }: { slug?: string }) {
  useMeta('Page not found · Brightside', 'This page does not exist on the Brightside demo website.');
  return (
    <section className="bs-wrap bs-simple" data-testid="page-not-found">
      <p className="bs-eyebrow">404</p>
      <h1 className="bs-h1 bs-serif">{slug ? `We don't cover “${slug}” yet.` : 'This page is not here.'}</h1>
      <p className="bs-lede">The address may be mistyped, or the area may be outside the twelve we currently cover.</p>
      <div className="bs-ctarow">
        <Link href="/" className="bs-cta" data-testid="link-home">Back to home</Link>
        <Link href="/locations" className="bs-textlink">See all areas <ArrowRight size={14} /></Link>
      </div>
    </section>
  );
}

export function LocationsPage() {
  useMeta('Areas we cover · Brightside', 'Twelve areas across Bristol, Bath and North Somerset served by the fictional Brightside consultancy.');
  return (
    <section className="bs-wrap bs-simple">
      <p className="bs-eyebrow">Areas we cover</p>
      <h1 className="bs-h1 bs-serif">Twelve places we know <em>street by street.</em></h1>
      <p className="bs-lede">Each area has its own housing stock, planning quirks and council. Choose yours for local advice.</p>
      <ul className="bs-dir">
        {LOCATIONS.map((l, i) => (
          <li key={l.slug}>
            <Link href={`/${l.slug}`} data-testid={`location-link-${l.slug}`}>
              <span className="bs-dir-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="bs-dir-name bs-serif">{l.name}</span>
              <span className="bs-dir-area">{l.area}</span>
              <span className="bs-dir-homes">{l.homes}</span>
              <ArrowRight size={18} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const TYPES = ['Kitchen or rear extension', 'Loft conversion', 'Whole-house renovation', 'Bathroom', 'Garden room or studio', 'Not sure yet'];
const TIMINGS = ['Within 3 months', '3 to 6 months', '6 to 12 months', 'Just exploring'];
const BUDGETS = ['Under £25,000', '£25,000 to £60,000', '£60,000 to £120,000', 'Over £120,000', 'Not sure yet'];

interface Answers { type: string; location: string; timing: string; budget: string; notes: string }

export function ConsultationPage() {
  useMeta('Free consultation · Brightside', 'Tell us about your home project. Demo form: nothing is sent or stored.');
  const search = useSearch();
  const initialLoc = useMemo(() => getLocation(new URLSearchParams(search).get('location') ?? undefined)?.slug ?? '', [search]);
  const empty: Answers = { type: '', location: initialLoc, timing: '', budget: '', notes: '' };
  const [a, setA] = useState<Answers>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [done, setDone] = useState<Answers | null>(null);

  const set = (k: keyof Answers) => (e: { target: { value: string } }) => setA((p) => ({ ...p, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const err: typeof errors = {};
    if (!a.type) err.type = 'Choose a project type.';
    if (!a.location) err.location = 'Choose an area.';
    if (!a.timing) err.timing = 'Choose a timing.';
    if (!a.budget) err.budget = 'Choose a budget range.';
    if (a.notes.length > 500) err.notes = 'Keep notes under 500 characters.';
    setErrors(err);
    if (Object.keys(err).length === 0) setDone(a);
  }
  function reset() { setA({ ...empty, location: '' }); setErrors({}); setDone(null); }

  const locName = getLocation(a.location)?.name;

  if (done) {
    return (
      <section className="bs-wrap bs-simple" data-testid="consultation-confirmation">
        <p className="bs-eyebrow">Summary ready</p>
        <h1 className="bs-h1 bs-serif">Thank you. Here is your project at a glance.</h1>
        <p className="bs-warn"><Check size={16} aria-hidden /> No booking has been sent and no data has been stored. This summary exists only in this browser tab and disappears when you refresh.</p>
        <dl className="bs-summary">
          <div><dt>Project</dt><dd>{done.type}</dd></div>
          <div><dt>Area</dt><dd>{getLocation(done.location)?.name}</dd></div>
          <div><dt>Timing</dt><dd>{done.timing}</dd></div>
          <div><dt>Budget</dt><dd>{done.budget}</dd></div>
          {done.notes && <div><dt>Notes</dt><dd>{done.notes}</dd></div>}
        </dl>
        <div className="bs-ctarow">
          <button className="bs-cta" onClick={reset} data-testid="button-reset">Start again</button>
          <Link href={`/${done.location}`} className="bs-textlink">Back to {getLocation(done.location)?.name} <ArrowRight size={14} /></Link>
        </div>
      </section>
    );
  }

  const field = (k: keyof Answers, label: string, opts: string[] | { v: string; l: string }[]) => (
    <label className="bs-field">
      <span>{label}</span>
      <select value={a[k]} onChange={set(k)} aria-invalid={!!errors[k]} data-testid={`select-${k}`}>
        <option value="">Select…</option>
        {opts.map((o) => typeof o === 'string' ? <option key={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
      {errors[k] && <em role="alert">{errors[k]}</em>}
    </label>
  );

  return (
    <section className="bs-wrap bs-consult">
      <div>
        <p className="bs-eyebrow">Free consultation</p>
        <h1 className="bs-h1 bs-serif">Tell us a little about the project.</h1>
        <p className="bs-lede">Four quick questions shape a useful first conversation. We never ask for your name, email or phone number here.</p>
        <p className="bs-warn">This is a demo. Submitting shows a summary on screen only: nothing is sent, booked or stored, and a refresh clears it.</p>
        <aside className="bs-live" aria-live="polite" data-testid="text-summary">
          <h2 className="bs-serif">Your answers so far</h2>
          <p>{[a.type, locName, a.timing, a.budget].filter(Boolean).join(' · ') || 'Nothing chosen yet.'}</p>
        </aside>
      </div>
      <form className="bs-form" onSubmit={submit} noValidate data-testid="consultation-form">
        {field('type', 'Project type', TYPES)}
        {field('location', 'Area', LOCATIONS.map((l) => ({ v: l.slug, l: l.name })))}
        {field('timing', 'When would you like to start?', TIMINGS)}
        {field('budget', 'Rough budget', BUDGETS)}
        <label className="bs-field">
          <span>Notes <small>(optional, avoid personal details)</small></span>
          <textarea rows={4} value={a.notes} onChange={set('notes')} placeholder="For example: north-facing kitchen, would like more light" data-testid="input-notes" />
          {errors.notes && <em role="alert">{errors.notes}</em>}
        </label>
        <div className="bs-ctarow">
          <button type="submit" className="bs-cta" data-testid="button-submit">See my summary <span className="arrow" aria-hidden><ArrowRight size={14} /></span></button>
          <button type="button" className="bs-textlink" onClick={reset} data-testid="button-clear">Clear</button>
        </div>
      </form>
    </section>
  );
}
