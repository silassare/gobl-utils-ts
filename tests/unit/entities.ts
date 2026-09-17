import { GoblEntity, type GoblEntityData } from '../../src/index.ts';

/**
 * Entities written the way Gobl's TypeScript generator writes them (assets/ts/MyEntityBase.ts.blate and
 * MyEntity.ts.blate): the integration suite checks the real generated ones.
 */
export abstract class ArticleBase extends GoblEntity {
	public static readonly PREFIX = 'article';
	// not in alphabetical order, as a generated class may declare them
	public static readonly COLUMNS = ['article_id', 'article_views', 'article_title'] as const;
	public static readonly COL_ID = 'article_id';
	public static readonly COL_TITLE = 'article_title';
	public static readonly COL_VIEWS = 'article_views';

	public identifierColumns(): string[] {
		return [ArticleBase.COL_ID];
	}

	get id(): string {
		return this._data[ArticleBase.COL_ID];
	}
	set id(v: string) {
		this._set(ArticleBase.COL_ID, v);
	}
	get title(): string {
		return this._data[ArticleBase.COL_TITLE];
	}
	set title(v: string) {
		this._set(ArticleBase.COL_TITLE, v);
	}
	get views(): number {
		return this._data[ArticleBase.COL_VIEWS];
	}
	set views(v: number) {
		this._set(ArticleBase.COL_VIEWS, v);
	}
}

export class Article extends ArticleBase {
	constructor(data?: GoblEntityData) {
		super(data, 'Article', Article.PREFIX, [...Article.COLUMNS]);
	}
}

export abstract class TagLinkBase extends GoblEntity {
	public static readonly PREFIX = 'link';
	public static readonly COLUMNS = ['link_article', 'link_tag'] as const;

	public identifierColumns(): string[] {
		return ['link_article', 'link_tag'];
	}
}

export class TagLink extends TagLinkBase {
	constructor(data?: GoblEntityData) {
		super(data, 'TagLink', TagLink.PREFIX, [...TagLink.COLUMNS]);
	}
}
