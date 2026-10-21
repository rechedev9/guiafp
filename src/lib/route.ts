import { useSyncExternalStore } from 'react';

// Study pages live under #/estudiar; any other hash is a guide anchor such as #urgente.
export type Route =
  | { page: 'guide'; anchor?: string }
  | { page: 'study' }
  | { page: 'review' }
  | { page: 'subject'; slug: string; mode?: string };

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const getHash = () => window.location.hash;

function parseRoute(hash: string): Route {
  const [root, slug, mode] = hash.replace(/^#\/?/, '').split('/');
  if (root !== 'estudiar') return { page: 'guide', anchor: root || undefined };
  if (!slug) return { page: 'study' };
  if (slug === 'repaso') return { page: 'review' };
  return { page: 'subject', slug, mode };
}

export const studyHref = (slug?: string, mode?: string) =>
  ['#/estudiar', slug, mode].filter(Boolean).join('/');

// The element id to scroll to on navigation; ids that match no element mean the top of the page.
export function scrollTarget(route: Route) {
  if (route.page === 'guide') return route.anchor ?? 'top';
  return route.page === 'subject' ? `study/${route.slug}` : `study/${route.page}`;
}

export function useRoute() {
  return parseRoute(useSyncExternalStore(subscribe, getHash));
}
