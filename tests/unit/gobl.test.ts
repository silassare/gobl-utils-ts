import { beforeAll, describe, expect, it } from 'vitest';
import {
	_bool,
	_int,
	_string,
	GOBL_CACHE_MAX_ENTRIES_PER_ENTITY,
	getEntityCache,
	GOBL_ENTITY_MARKER,
	goblJSONReviver,
	parseGoblJSON,
	register,
	toInstance,
} from '../../src/index.ts';
import { Article, TagLink } from './entities.ts';

const articleColumns = [...Article.COLUMNS];

beforeAll(() => {
	register('Article', Article);
	register('TagLink', TagLink);
});

describe('register', () => {
	it('leaves the entity class columns in their order', () => {
		expect([...Article.COLUMNS]).toEqual(articleColumns);
	});
});

describe('toInstance', () => {
	it('builds the entity the marker names', () => {
		const e = toInstance({ [GOBL_ENTITY_MARKER]: 'Article', article_id: '1', article_title: 'T' });

		expect(e).toBeInstanceOf(Article);
		expect((e as Article).title).toBe('T');
	});

	it('recognizes an entity from its exact set of columns, without a marker', () => {
		expect(toInstance({ link_tag: '1', link_article: '2' })).toBeInstanceOf(TagLink);
		expect(toInstance({ link_tag: '1' })).toBeUndefined();
	});

	it('leaves the given data untouched', () => {
		const data = { [GOBL_ENTITY_MARKER]: 'Unregistered', link_tag: '1', link_article: '2' };

		expect(toInstance(data)).toBeInstanceOf(TagLink);
		expect(data[GOBL_ENTITY_MARKER]).toBe('Unregistered');
	});

	it('caches an entity with a numeric key under its string key', () => {
		const e = toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: 77 }, true);

		expect(getEntityCache<Article>('Article')?.get('77')).toBe(e);
	});

	it('returns undefined for what is not a plain object', () => {
		expect(toInstance([] as never)).toBeUndefined();
		expect(toInstance('x' as never)).toBeUndefined();
		expect(toInstance(null as never)).toBeUndefined();
	});

	it('keeps one instance per cache key when caching, hydrated with the newest data', () => {
		const first = toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: '9', article_title: 'A' }, true);
		const second = toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: '9', article_title: 'B' }, true);

		expect(second).toBe(first);
		expect(second?.title).toBe('B');
		expect(getEntityCache<Article>('Article')?.get('9')).toBe(first);
	});
});

describe('JSON', () => {
	it('is left alone: importing the package does not replace JSON.parse', () => {
		const a = new Article({ article_id: '5' });

		expect(JSON.parse(JSON.stringify(a))).not.toBeInstanceOf(Article);
	});

	it('revives entities, nested included, with parseGoblJSON', () => {
		const a = new Article({ article_id: '5', article_title: 'Round trip' });
		const parsed = parseGoblJSON(JSON.stringify({ list: [a], other: 1 }));

		expect(parsed.list[0]).toBeInstanceOf(Article);
		expect(parsed.list[0].title).toBe('Round trip');
		expect(parsed.other).toBe(1);
	});

	it('revives entities with the reviver given to JSON.parse', () => {
		const a = new Article({ article_id: '6' });

		expect(JSON.parse(JSON.stringify([a]), goblJSONReviver)[0]).toBeInstanceOf(Article);
	});

	it('applies a given reviver first', () => {
		expect(parseGoblJSON('{"a":1}', (_k, v) => (v === 1 ? 2 : v))).toEqual({ a: 2 });
	});
});

describe('value helpers', () => {
	it('converts to boolean, null and undefined to null', () => {
		expect(_bool('0')).toBe(false);
		expect(_bool('1')).toBe(true);
		expect(_bool(0)).toBe(false);
		expect(_bool(null)).toBeNull();
		expect(_bool(undefined)).toBeNull();
	});

	it('converts to integer, what is not a number to null', () => {
		expect(_int('12')).toBe(12);
		expect(_int('08')).toBe(8);
		expect(_int(3.7)).toBe(3);
		expect(_int('abc')).toBeNull();
		expect(_int(null)).toBeNull();
		expect(_int(undefined)).toBeNull();
	});

	it('converts to string, null and undefined to an empty string', () => {
		expect(_string(5)).toBe('5');
		expect(_string(null)).toBe('');
		expect(_string(undefined)).toBe('');
	});
});

describe('the identity cache is bounded', () => {
	it('keeps at most the configured number of entities per class, oldest first out', () => {
		// The cache lives on `window` for as long as the page: without a bound an application
		// paging through a list kept every row it had ever revived, and nothing deleted an entry.
		const cache = getEntityCache<Article>('Article');

		expect(cache).toBeDefined();

		cache?.clear();

		const total = GOBL_CACHE_MAX_ENTRIES_PER_ENTITY + 50;

		for (let i = 1; i <= total; i++) {
			toInstance<Article>(
				{ [GOBL_ENTITY_MARKER]: 'Article', article_id: String(i) },
				true
			);
		}

		expect(cache?.size).toBe(GOBL_CACHE_MAX_ENTRIES_PER_ENTITY);

		// The oldest went, the newest stayed.
		expect(cache?.has('1')).toBe(false);
		expect(cache?.has(String(total))).toBe(true);
	});

	it('counts a revived entity as freshly used, so a hot row is not evicted', () => {
		const cache = getEntityCache<Article>('Article');

		cache?.clear();

		toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: 'hot' }, true);

		for (let i = 1; i <= GOBL_CACHE_MAX_ENTRIES_PER_ENTITY - 1; i++) {
			toInstance<Article>(
				{ [GOBL_ENTITY_MARKER]: 'Article', article_id: `cold-${i}` },
				true
			);

			// Read again, so it is the most recently used rather than the oldest.
			toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: 'hot' }, true);
		}

		toInstance<Article>({ [GOBL_ENTITY_MARKER]: 'Article', article_id: 'last' }, true);

		expect(cache?.has('hot')).toBe(true);
	});

	it('lets a caller revive without caching at all', () => {
		const cache = getEntityCache<Article>('Article');

		cache?.clear();

		parseGoblJSON(
			JSON.stringify({ [GOBL_ENTITY_MARKER]: 'Article', article_id: 'uncached' }),
			undefined,
			false
		);

		expect(cache?.size).toBe(0);
	});
});
