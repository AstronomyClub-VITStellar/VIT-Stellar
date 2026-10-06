import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Global styles first, so component-level CSS (Header.css, Footer.css)
// that is imported later keeps winning ties in the cascade.
import '@/styles/main.css';

import LandingPage from '@/pages/LandingPage';
import DeadlinesProvider from '@/context/DeadlinesProvider';
import FeaturesProvider from '@/context/FeaturesProvider';

// The site is a single landing page. Every path renders it; add real
// routes here if separate pages are ever needed.
export default function App() {
  return (
    <FeaturesProvider>
      <DeadlinesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </DeadlinesProvider>
    </FeaturesProvider>
  );
}