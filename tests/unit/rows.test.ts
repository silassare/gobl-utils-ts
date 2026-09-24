import { describe, expectTypeOf, it } from 'vitest';
import { GoblRowOf } from '../../src/index.js';
import { Article } from './entities.js';

describe('GoblRowOf', () => {
	it('should extract the row type from an entity type', () => {
		type ArticleRow = GoblRowOf<Article, 'article'>;

		expectTypeOf({
			article_id: 'string',
			article_title: 'string',
			article_views: 1,
		}).toEqualTypeOf<ArticleRow>();
	});
});
