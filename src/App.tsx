import { useEffect, type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Shell } from '@/components/Shell';
import { ConsultationPage, HomePage, LocationPage, LocationsPage, NotFoundPage } from '@/pages/pages';

function ScrollTop({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location]);
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell>
        <ScrollTop>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/locations" component={LocationsPage} />
            <Route path="/consultation" component={ConsultationPage} />
            <Route path="/:location" component={LocationPage} />
            <Route><NotFoundPage /></Route>
          </Switch>
        </ScrollTop>
      </Shell>
    </WouterRouter>
  );
}

export default App;
