'use client';

import { useEffect, useState, KeyboardEvent } from 'react';
import { useTags } from '../main/TagsContext';
import { Tag, CategoryTag } from '@/types';
import styles from './TicketForm.module.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const { tags: availableTags, categories, addTag } = useTags();
  const [tagInput, setTagInput] = useState('');
  const [filteredCategories, setFilteredCategories] = useState<CategoryTag[]>([]);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.tagSuggestions}`) && 
          !target.closest(`.${styles.tagInput}`) &&
          !target.closest(`.${styles.tagList}`)) {
        setIsTagEditing(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    if (isTagEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagEditing]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setSelectedIndex(-1);

    const searchValue = value.toLowerCase();

    // カテゴリ内のタグをフィルタリング
    const filtered = categories.map(category => ({
      ...category,
      tags: category.tags
        .filter(tag => !tags.includes(tag.id)) // 選択済みのタグを除外
        .map(tag => {
          const nameLower = tag.name.toLowerCase();
          // 完全一致、前方一致、部分一致の優先度を付ける
          let priority = 0;
          if (!value.trim()) priority = 1; // 空入力時は全て表示
          else if (nameLower === searchValue) priority = 3;
          else if (nameLower.startsWith(searchValue)) priority = 2;
          else if (nameLower.includes(searchValue)) priority = 1;
          return { tag, priority };
        })
        .filter(item => item.priority > 0)
        .sort((a, b) => b.priority - a.priority || a.tag.name.localeCompare(b.tag.name))
        .map(item => item.tag)
    })).filter(category => category.tags.length > 0); // 空のカテゴリを除外

    setFilteredCategories(filtered);
  };

  const handleTagSelect = async (selectedTag: Tag) => {
    if (!tags.includes(selectedTag.id)) {
      onChange([...tags, selectedTag.id]);
    }
    setTagInput('');
    setShowSuggestions(false);
    setIsTagEditing(false);
    setSelectedIndex(-1);
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(tags.filter(id => id !== tagId));
  };

  const generateTagColor = () => {
    const colors = [
      '#6366f1', // インディゴ
      '#8b5cf6', // バイオレット
      '#ec4899', // ピンク
      '#f43f5e', // ローズ
      '#ef4444', // レッド
      '#f97316', // オレンジ
      '#eab308', // イエロー
      '#22c55e', // グリーン
      '#14b8a6', // ティール
      '#3b82f6', // ブルー
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleNewTag = async () => {
    if (!tagInput.trim()) return;

    const inputValue = tagInput.trim();
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingTag) {
      handleTagSelect(existingTag);
      return;
    }

    const confirmed = window.confirm(`新しいタグ「${inputValue}」を作成しますか？`);
    if (!confirmed) return;

    const newTag = await addTag({
      name: inputValue,
      color: generateTagColor()
    });

    if (newTag) {
      handleTagSelect(newTag);
    }
  };

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tagList}>
        {tags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => handleRemoveTag(tag.id)}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      <div className={styles.tagInputWrapper}>
        <input
          type="text"
          className={styles.input}
          placeholder="タグを入力..."
          value={tagInput}
          onChange={handleTagInputChange}
          onFocus={() => {
            setIsTagEditing(true);
            const filtered = categories.map(category => ({
              ...category,
              tags: category.tags.filter(tag => !tags.includes(tag.id))
            })).filter(category => category.tags.length > 0);
            setFilteredCategories(filtered);
            setShowSuggestions(true);
          }}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (!showSuggestions) {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleNewTag();
              }
              return;
            }

            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                e.preventDefault();
                // すべてのタグを一次元配列にして選択インデックスを管理
                const allTags = filteredCategories.flatMap(c => c.tags);
                setSelectedIndex(prev => 
                  prev < allTags.length - 1 ? prev + 1 : prev
                );
                break;
              case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
              case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                  const allTags = filteredCategories.flatMap(c => c.tags);
                  if (selectedIndex < allTags.length) {
                    handleTagSelect(allTags[selectedIndex]);
                  }
                } else {
                  handleNewTag();
                }
                break;
              case 'Escape':
                e.preventDefault();
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            }
          }}
        />
        {showSuggestions && (
          <div className={styles.tagSuggestions}>
            <div className={styles.tagSuggestionsContent}>
              {filteredCategories.length > 0 ? (
                filteredCategories.map(category => (
                  <div key={category.categoryId}>
                    <div className={styles.categoryHeader}>
                      {category.name}
                    </div>
                    {category.tags.map((tag: Tag, index: number) => {
                      // カテゴリごとの開始インデックスを計算
                      const globalIndex = filteredCategories
                        .slice(0, filteredCategories.findIndex(c => c.categoryId === category.categoryId))
                        .reduce((acc, c) => acc + c.tags.length, 0) + index;

                      return (
                        <div
                          key={tag.id}
                          className={`${styles.tagSuggestion} ${globalIndex === selectedIndex ? styles.selected : ''}`}
                          onClick={() => handleTagSelect(tag)}
                        >
                          <span 
                            className={styles.tagSampleColor}
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      );
                    })}
                  </div>
                ))
              ) : (
                <div className={styles.noTags}>
                  {tagInput.trim() ? 'タグが見つかりません' : '利用可能なタグがありません'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
