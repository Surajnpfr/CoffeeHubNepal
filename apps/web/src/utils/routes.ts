/**
 * URL routing utilities - syncs browser URL with app navigation state (currentPage, subPage, ids).
 * Enables shareable links, refresh, and browser back/forward.
 */

export interface RouteState {
  currentPage: string;
  subPage: string | null;
  /** sessionStorage key -> id value for detail pages */
  ids: Record<string, string>;
}

const BASE = '';

const ID_KEYS = ['jobDetailId', 'blogDetailId', 'blogEditId', 'listingDetailId', 'noticeDetailId'] as const;

/** Read current detail IDs from sessionStorage (for building path from state). */
export function getStoredIds(): Record<string, string> {
  const ids: Record<string, string> = {};
  try {
    for (const key of ID_KEYS) {
      const v = sessionStorage.getItem(key);
      if (v) ids[key] = v;
    }
  } catch (_) {}
  return ids;
}

/**
 * Build path from navigation state (for pushState/replaceState).
 * If ids not provided, reads from sessionStorage.
 */
export function stateToPath(
  currentPage: string,
  subPage: string | null,
  ids: Record<string, string> | null = null
): string {
  const stored = ids ?? getStoredIds();
  const jobId = stored['jobDetailId'];
  const blogId = stored['blogDetailId'];
  const blogEditId = stored['blogEditId'];
  const listingId = stored['listingDetailId'];
  const noticeId = stored['noticeDetailId'];

  if (subPage === 'login') return `${BASE}/login`;
  if (subPage === 'register') return `${BASE}/register`;
  if (subPage === 'forgot-password') return `${BASE}/forgot-password`;
  if (subPage === 'reset-password') return `${BASE}/reset-password`;
  if (subPage === 'complete-signup') return `${BASE}/complete-signup`;
  if (subPage === 'verification') return `${BASE}/verification`;

  if (currentPage === 'jobs') {
    if (subPage === 'create-job') return `${BASE}/jobs/new`;
    if (subPage === 'job-detail' && jobId) return `${BASE}/jobs/${jobId}`;
    if (subPage === 'my-jobs') return `${BASE}/profile/my-jobs`;
    if (subPage === 'my-applications') return `${BASE}/profile/my-applications`;
    return `${BASE}/jobs`;
  }

  if (currentPage === 'blog') {
    if (subPage === 'create-blog') return `${BASE}/blog/new`;
    if (subPage === 'edit-blog' && blogEditId) return `${BASE}/blog/${blogEditId}/edit`;
    if (subPage === 'blog-detail' && blogId) return `${BASE}/blog/${blogId}`;
    return `${BASE}/blog`;
  }

  if (currentPage === 'market') {
    if (subPage === 'create-listing') return `${BASE}/market/new`;
    if (subPage === 'listing-detail' && listingId) return `${BASE}/market/${listingId}`;
    return `${BASE}/market`;
  }

  if (currentPage === 'notices') {
    if (subPage === 'create-notice') return `${BASE}/notices/new`;
    if (subPage === 'notice-detail' && noticeId) return `${BASE}/notices/${noticeId}`;
    return `${BASE}/notices`;
  }

  if (currentPage === 'profile') {
    if (subPage === 'my-listings') return `${BASE}/profile/my-listings`;
    if (subPage === 'my-jobs') return `${BASE}/profile/my-jobs`;
    if (subPage === 'my-applications') return `${BASE}/profile/my-applications`;
    if (subPage === 'certifications') return `${BASE}/profile/certifications`;
    if (subPage === 'settings') return `${BASE}/profile/settings`;
    return `${BASE}/profile`;
  }

  if (currentPage === 'admin') return `${BASE}/admin`;
  if (currentPage === 'prices') return `${BASE}/prices`;
  if (currentPage === 'about') return `${BASE}/about`;
  if (currentPage === 'contact') return `${BASE}/contact`;
  if (currentPage === 'privacy') return `${BASE}/privacy`;
  if (currentPage === 'terms') return `${BASE}/terms`;

  return `${BASE}/`;
}

/**
 * Parse pathname into navigation state.
 */
export function pathToState(pathname: string): RouteState {
  const path = pathname.replace(/^\//, '') || '';
  const segments = path.split('/').filter(Boolean);
  const ids: Record<string, string> = {};

  if (segments[0] === 'login') {
    return { currentPage: 'home', subPage: 'login', ids };
  }
  if (segments[0] === 'register') {
    return { currentPage: 'home', subPage: 'register', ids };
  }
  if (segments[0] === 'forgot-password') {
    return { currentPage: 'home', subPage: 'forgot-password', ids };
  }
  if (segments[0] === 'reset-password') {
    return { currentPage: 'home', subPage: 'reset-password', ids };
  }
  if (segments[0] === 'complete-signup') {
    return { currentPage: 'home', subPage: 'complete-signup', ids };
  }
  if (segments[0] === 'verification') {
    return { currentPage: 'home', subPage: 'verification', ids };
  }

  if (segments[0] === 'jobs') {
    if (segments[1] === 'new') {
      return { currentPage: 'jobs', subPage: 'create-job', ids };
    }
    if (segments[1] && segments[1] !== 'new') {
      ids['jobDetailId'] = segments[1];
      return { currentPage: 'jobs', subPage: 'job-detail', ids };
    }
    return { currentPage: 'jobs', subPage: null, ids };
  }

  if (segments[0] === 'blog') {
    if (segments[1] === 'new') {
      return { currentPage: 'blog', subPage: 'create-blog', ids };
    }
    if (segments[1] && segments[2] === 'edit') {
      ids['blogEditId'] = segments[1];
      return { currentPage: 'blog', subPage: 'edit-blog', ids };
    }
    if (segments[1]) {
      ids['blogDetailId'] = segments[1];
      return { currentPage: 'blog', subPage: 'blog-detail', ids };
    }
    return { currentPage: 'blog', subPage: null, ids };
  }

  if (segments[0] === 'market') {
    if (segments[1] === 'new') {
      return { currentPage: 'market', subPage: 'create-listing', ids };
    }
    if (segments[1]) {
      ids['listingDetailId'] = segments[1];
      return { currentPage: 'market', subPage: 'listing-detail', ids };
    }
    return { currentPage: 'market', subPage: null, ids };
  }

  if (segments[0] === 'notices') {
    if (segments[1] === 'new') {
      return { currentPage: 'notices', subPage: 'create-notice', ids };
    }
    if (segments[1]) {
      ids['noticeDetailId'] = segments[1];
      return { currentPage: 'notices', subPage: 'notice-detail', ids };
    }
    return { currentPage: 'notices', subPage: null, ids };
  }

  if (segments[0] === 'profile') {
    if (segments[1] === 'my-listings') {
      return { currentPage: 'profile', subPage: 'my-listings', ids };
    }
    if (segments[1] === 'my-jobs') {
      return { currentPage: 'profile', subPage: 'my-jobs', ids };
    }
    if (segments[1] === 'my-applications') {
      return { currentPage: 'profile', subPage: 'my-applications', ids };
    }
    if (segments[1] === 'certifications') {
      return { currentPage: 'profile', subPage: 'certifications', ids };
    }
    if (segments[1] === 'settings') {
      return { currentPage: 'profile', subPage: 'settings', ids };
    }
    return { currentPage: 'profile', subPage: null, ids };
  }

  if (segments[0] === 'admin') {
    return { currentPage: 'admin', subPage: null, ids };
  }
  if (segments[0] === 'prices') {
    return { currentPage: 'prices', subPage: null, ids };
  }
  if (segments[0] === 'about') {
    return { currentPage: 'about', subPage: null, ids };
  }
  if (segments[0] === 'contact') {
    return { currentPage: 'contact', subPage: null, ids };
  }
  if (segments[0] === 'privacy') {
    return { currentPage: 'privacy', subPage: null, ids };
  }
  if (segments[0] === 'terms') {
    return { currentPage: 'terms', subPage: null, ids };
  }

  return { currentPage: 'home', subPage: null, ids };
}

export function getPathname(): string {
  return window.location.pathname || '/';
}

export function pushState(path: string): void {
  const full = path.startsWith('/') ? path : `/${path}`;
  window.history.pushState({ path: full }, '', full);
}

export function replaceState(path: string): void {
  const full = path.startsWith('/') ? path : `/${path}`;
  window.history.replaceState({ path: full }, '', full);
}
