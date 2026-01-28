import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that scrolls to the top of the page whenever the route changes
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll 'window' to top (for pages without custom layout scrolling like Login)
    window.scrollTo(0, 0);

    // Scroll 'main-content' to top (for pages with Layout where body scroll is locked)
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
