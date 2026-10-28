import { useEffect, useState } from 'react';

export type RouteInfo = {
  path: string;
  pathname: string;
  params: Record<string, string>;
  query: Record<string, string>;
};

export function parseRoute(currentPath: string): RouteInfo {
  const [rawPath, rawQuery] = currentPath.split('?');
  const pathname = rawPath || '/';
  const query: Record<string, string> = {};
  if (rawQuery) {
    const searchParams = new URLSearchParams(rawQuery);
    searchParams.forEach((value, key) => {
      query[key] = value;
    });
  }

  const params: Record<string, string> = {};

  // Pattern matching: /mes-concours/:slug
  const contestMatch = pathname.match(/^\/mes-concours\/([a-zA-Z0-9_-]+)\/?$/);
  if (contestMatch) {
    params.slug = contestMatch[1];
  }

  // Pattern matching: /actualites/:slug
  const articleMatch = pathname.match(/^\/actualites\/([a-zA-Z0-9_-]+)\/?$/);
  if (articleMatch) {
    params.slug = articleMatch[1];
  }

  // Pattern matching: /admin/:tab
  const adminMatch = pathname.match(/^\/admin\/([a-zA-Z0-9_-]+)\/?$/);
  if (adminMatch) {
    params.tab = adminMatch[1];
  }

  return {
    path: currentPath,
    pathname,
    params,
    query,
  };
}

export function useRouter() {
  const [route, setRoute] = useState<RouteInfo>(() =>
    parseRoute(window.location.pathname + window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname + window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to === route.path) return;
    window.history.pushState({}, '', to);
    setRoute(parseRoute(to));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    route,
    navigate,
    isMatch: (pattern: string) => {
      if (pattern === '/') return route.pathname === '/';
      return route.pathname.startsWith(pattern);
    },
  };
}
