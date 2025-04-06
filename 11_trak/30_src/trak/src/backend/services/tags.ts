import fs from 'fs/promises';
import path from 'path';
import { getTrakDataPath } from './config';
import { type Tag, type CategoryTag, type TagsConfig, type NewTagRequest } from '../models/tags';

/**
 * カテゴリー化されたタグをフラットな配列に変換
 */
export const flattenTags = (categorizedTags: CategoryTag[]): Tag[] => {
  return categorizedTags.reduce<Tag[]>((acc, category) => {
    return [...acc, ...category.tags];
  }, []);
};

/**
 * タグ設定を読み込む
 */
export const loadTags = async (): Promise<{ categories: TagsConfig; tags: Tag[] }> => {
  const tagsPath = path.join(getTrakDataPath(), 'configs', 'tags.json');
  
  try {
    const data = await fs.readFile(tagsPath, 'utf8');
    const parsedData = JSON.parse(data) as TagsConfig;
    return {
      categories: parsedData,
      tags: flattenTags(parsedData.tags)
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // ファイルが存在しない場合は空の配列を返す
      return { categories: { tags: [] }, tags: [] };
    }
    throw new Error(`タグデータの読み込みに失敗しました: ${error}`);
  }
};


/**
 * 新しいタグを作成
 */
export const createTag = async (request: NewTagRequest): Promise<TagsConfig> => {
  const tagsPath = path.join(getTrakDataPath(), 'configs', 'tags.json');

  let data: TagsConfig;
  try {
    const fileContent = await fs.readFile(tagsPath, 'utf8');
    data = JSON.parse(fileContent);
  } catch {
    data = { tags: [] };
  }

  // タグの重複チェック
  const flatTags = flattenTags(data.tags);
  if (flatTags.some(tag => tag.id === request.id)) {
    throw new Error('同じIDのタグが既に存在します');
  }

  // 指定されたカテゴリーを探す
  let category = data.tags.find(c => c.categoryId === request.categoryId);
  
  // カテゴリーが存在しない場合は新規作成
  if (!category) {
    category = {
      categoryId: request.categoryId,
      name: request.categoryId, // カテゴリー名は別途更新する必要あり
      tags: []
    };
    data.tags.push(category);
  }

  // タグを追加
  category.tags.push({
    id: request.id,
    name: request.name,
    color: request.color
  });

  await fs.writeFile(tagsPath, JSON.stringify(data, null, 2));
  return data;
};
