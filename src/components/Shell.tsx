import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { LOCATIONS } from '@/lib/locations';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/locations', label: 'Areas we cover' },
  { href: '/consultation', label: 'Consultation' },
];

export function Logo() {
  return (
    <Link href="/" className="bs-logo" data-testid="link-logo">
      <span className="bs-mark" aria-hidden />
      <span className="bs-word bs-serif">
        Brightside<small>Home projects · Bristol</small>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [path] = useLocation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [path]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="bs-header">
      <div className="bs-wrap bs-header-row">
        <Logo />
        <nav className="bs-nav-links" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={path === n.href ? 'is-active' : ''} data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, '-')}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          ref={btnRef}
          className="bs-menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
          data-testid="button-menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div id="mobile-menu" ref={panelRef} className="bs-mobile">
          <nav aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="bs-serif">
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bs-footer">
      <div className="bs-wrap bs-footer-grid">
        <div>
          <Logo />
          <p className="bs-footer-note">
            Independent home project advice across Bristol, Bath and North Somerset. Brightside is a fictional business created for a
            demonstration website. No real company, staff or service is represented.
          </p>
        </div>
        <div>
          <h3>Areas</h3>
          <ul className="bs-footer-areas">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <Link href={`/${l.slug}`}>{l.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Site</h3>
          <ul>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bs-wrap bs-footer-base">
        <span>© Brightside Home Projects (fictional)</span>
        <span>Demo website. Nothing on this site is sent or stored.</span>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="bs-site">
      <a href="#main" className="bs-skip">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <div className="bs-disclosure" data-testid="demo-disclosure" role="note">
        Demo website · Fictional business
      </div>
    </div>
  );
}
