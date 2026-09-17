import { describe, expect, it } from 'vitest';
import { GOBL_ENTITY_MARKER } from '../../src/index.ts';
import { Article, TagLink } from './entities.ts';

describe('GoblEntity', () => {
	it('keeps the given column values and null for the others', () => {
		const a = new Article({ article_id: '1', article_title: 'Hello' });

		expect(a.id).toBe('1');
		expect(a.title).toBe('Hello');
		expect(a.views).toBeNull();
	});

	it('ignores data that is not one of its columns', () => {
		const a = new Article({ article_id: '1', unknown: 'x' });

		expect(a.toObject()).not.toHaveProperty('unknown');
	});

	it('is clean until a column changes, then reports only the changed columns', () => {
		const a = new Article({ article_id: '1', article_title: 'Hello', article_views: 2 });

		expect(a.isClean()).toBe(true);
		expect(a.isSaved()).toBe(true);

		a.title = 'Changed';

		expect(a.isClean()).toBe(false);
		expect(a.toObject(true)).toEqual({ article_title: 'Changed' });
	});

	it('is saved again once marked as saved', () => {
		const a = new Article({ article_id: '1' });

		a.views = 10;
		expect(a.isSaved(true)).toBe(true);
		expect(a.isClean()).toBe(true);
		expect(a.toObject(true)).toEqual({});
	});

	it('hydrates from column names, and marks as saved on request', () => {
		const a = new Article({ article_id: '1' });

		a.doHydrate({ article_title: 'Hydrated', article_views: 3, other: 'ignored' });

		expect(a.title).toBe('Hydrated');
		expect(a.views).toBe(3);
		expect(a.isClean()).toBe(false);

		a.doHydrate({ article_views: 4 }, true);
		expect(a.isClean()).toBe(true);
	});

	it('serializes its columns with the entity marker', () => {
		const a = new Article({ article_id: '1', article_title: 'T', article_views: 0 });
		const expected = {
			article_id: '1',
			article_title: 'T',
			article_views: 0,
			[GOBL_ENTITY_MARKER]: 'Article',
		};

		expect(a.toObject()).toEqual(expected);
		expect(a.toJSON()).toEqual(expected);
	});

	it('returns some columns, and refuses one it does not have', () => {
		const a = new Article({ article_id: '1', article_title: 'T' });

		expect(a.toObjectSome(['article_title'])).toEqual({ article_title: 'T' });
		expect(() => a.toObjectSome(['nope'])).toThrow('Column "nope" is not defined in "Article".');
	});

	it('tracks one operation state at a time', () => {
		const a = new Article();

		expect(a.isSaving(true)).toBe(true);
		expect(a.isDeleting()).toBe(false);
		expect(a.isUpdating(true)).toBe(true);
		expect(a.isSaving()).toBe(false);
		expect(a.isUpdating(false)).toBe(false);
	});

	it('uses its single primary key, as a string, as cache key', () => {
		expect(new Article({ article_id: '42' }).cacheKey()).toBe('42');
		expect(new Article({ article_id: 5 }).cacheKey()).toBe('5');
		expect(new Article({ article_id: 0 }).cacheKey()).toBe('0');
		expect(new Article().cacheKey()).toBeNull();
	});

	it('uses a composite primary key only when complete, without ambiguity', () => {
		expect(new TagLink({ link_tag: '7', link_article: '3' }).cacheKey()).toBe('["3","7"]');
		expect(new TagLink({ link_article: 1, link_tag: 0 }).cacheKey()).toBe('["1","0"]');
		expect(new TagLink({ link_article: 1, link_tag: null }).cacheKey()).toBeNull();
		expect(new TagLink({ link_article: 'a|b', link_tag: 'c' }).cacheKey()).not.toBe(
			new TagLink({ link_article: 'a', link_tag: 'b|c' }).cacheKey()
		);
	});
});
