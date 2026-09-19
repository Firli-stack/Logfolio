export interface RouteInfo {
  route: 'public_profile' | 'dashboard' | 'home';
  username?: string;
}

export function parseCurrentRoute(): RouteInfo {
  const pathname = window.location.pathname.toLowerCase();

  // Pattern 1: /p/:username (misal /p/alexdev)
  const profileMatch = pathname.match(/^\/p\/([^/]+)/);
  if (profileMatch && profileMatch[1]) {
    return {
      route: 'public_profile',
      username: profileMatch[1],
    };
  }

  // Pattern 2: /dashboard
  if (pathname.startsWith('/dashboard')) {
    return {
      route: 'dashboard',
    };
  }

  // Fallback: / (Home)
  return {
    route: 'home',
  };
}

export function navigateTo(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}
