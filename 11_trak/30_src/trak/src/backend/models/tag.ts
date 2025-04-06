/**
 * タグの型定義
 */
export interface Tag {
  id: string;
  name: string;
  color: string;
}

/**
 * カテゴリー化されたタグの型定義
 */
export interface CategoryTag {
  categoryId: string;
  name: string;
  tags: Tag[];
}

/**
 * タグ設定の型定義
 */
export interface TagsConfig {
  tags: CategoryTag[];
}

/**
 * 新規タグ作成リクエストの型定義
 */
export interface NewTagRequest extends Tag {
  categoryId: string;
}
