import assert from 'node:assert/strict';
import test from 'node:test';
import { formatBookmark, loadBookmarks, normalizeUrl } from './bookmarks.js';

test('normalizes URLs with and without https to the same saved value', () => {
  assert.equal(normalizeUrl('https://www.example.com/article'), 'https://www.example.com/article');
  assert.equal(normalizeUrl('www.example.com/article'), 'https://www.example.com/article');
  assert.equal(normalizeUrl('  www.example.com/article  '), 'https://www.example.com/article');
});

test('recovers gracefully from empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of ['', null, undefined, '{broken json', 'null', '42', '"legacy value"']) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed entries from stored bookmark arrays', () => {
  const stored = JSON.stringify([
    { url: 'https://www.example.com', slug: 'mona-7fk2' },
    { url: 'javascript:alert(1)', slug: 'mona-abcd' },
    { url: 'https://example.org', slug: 'legacy-slug' },
    'not a bookmark',
    null,
  ]);

  assert.deepEqual(loadBookmarks(stored), [
    { url: 'https://www.example.com/', slug: 'mona-7fk2' },
  ]);
});

test('formats a saved bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
