const slugPattern = /^mona-[0-9A-Za-z]{4}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutProtocolSlashes = trimmed.replace(/^\/\//, '');
  const hasScheme = /^[a-z][a-z\d+.-]*:(?!\d)/i.test(withoutProtocolSlashes);

  try {
    const url = new URL(hasScheme ? withoutProtocolSlashes : `https://${withoutProtocolSlashes}`);
    if ((url.protocol !== 'http:' && url.protocol !== 'https:') || !url.hostname) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function loadBookmarks(serialized) {
  if (typeof serialized !== 'string' || serialized.trim() === '') return [];

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return [];
      const url = normalizeUrl(entry.url);
      if (!url || typeof entry.slug !== 'string' || !slugPattern.test(entry.slug)) return [];
      return [{ url, slug: entry.slug }];
    });
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark) {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
