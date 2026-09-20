export interface RouteInfo {
  route: 'public_profile' | 'dashboard' | 'inbox' | 'home' | 'login' | 'register' | 'explore';
  username?: string;
}

export function parseCurrentRoute(): RouteInfo {
  const pathname = window.location.pathname;
  const lowerPathname = pathname.toLowerCase();
  const profileMatch = pathname.match(/^\/p\/([^/]+)/i);
  if (profileMatch && profileMatch[1]) {
    return {
      route: 'public_profile',
      username: profileMatch[1],
    };
  }
  if (lowerPathname.startsWith('/dashboard')) {
    return {
      route: 'dashboard',
    };
  }
  if (lowerPathname.startsWith('/inbox')) {
    return {
      route: 'inbox',
    };
  }
  if (lowerPathname.startsWith('/login')) {
    return {
      route: 'login',
    };
  }
  if (lowerPathname.startsWith('/register')) {
    return {
      route: 'register',
    };
  }
  if (lowerPathname.startsWith('/explore')) {
    return {
      route: 'explore',
    };
  }
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
