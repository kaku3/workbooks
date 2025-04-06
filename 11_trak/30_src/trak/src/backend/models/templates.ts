/**
 * テンプレートの型定義
 */
export interface Template {
  id: string;
  name: string;
  content?: string;
}

/**
 * テンプレート設定の型定義
 */
export interface TemplatesConfig {
  templates: Template[];
}
