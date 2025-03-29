import styles from './styles/TitleCell.module.css';
import { useEffect, useState, KeyboardEvent } from 'react';
import { useTags } from '../../../TagsContext';
import { Tag } from '@/types';

interface TitleCellProps {
  setEditingCell?: (value: null) => void;
  value: string;
  tags?: string[];
  editing?: boolean;
  onUpdate?: (title: string, tags?: string[]) => void;
}

export default function TitleCell({
  value,
  tags = [],
  editing = false,
  onUpdate,
  setEditingCell
}: TitleCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const { tags: availableTags, addTag } = useTags();
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [editingTags, setEditingTags] = useState<string[]>(tags);

  // 親コンポーネントからの新しい値を反映
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // タグの更新を反映
  useEffect(() => {
    setEditingTags(tags);
  }, [tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.tagSuggestions}`) && 
          !target.closest(`.${styles.tagInput}`) &&
          !target.closest(`.${styles.tagList}`)) {
        setIsTagEditing(false);
        setFilteredTags([]);
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

  // タイトル編集時のクリックアウトハンドラー
  useEffect(() => {
    if (!editing) return; // 編集モードでない場合は何もしない

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isTargetCell = target.closest(`.${styles.editableCell}`);
      const isTagRelated = target.closest(`.${styles.tagSuggestions}`) || 
                          target.closest(`.${styles.tagInput}`) || 
                          target.closest(`.${styles.tagList}`) ||
                          target.closest(`.${styles.tagAction}`);

      // 編集中のセル内または関連要素のクリックは無視
      if (isTargetCell || isTagRelated) {
        return;
      }

      // タイトルとタグを同時に更新
      if (onUpdate && (editValue !== value || !arraysEqual(editingTags, tags))) {
        onUpdate(editValue, editingTags);
      }

      setIsTagEditing(false);
      setTagInput('');
      setFilteredTags([]);
      setSelectedIndex(-1);
      setEditingCell?.(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editing, editValue, value, editingTags, tags, onUpdate, setEditingCell]);

  // 配列の比較ヘルパー関数
  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  };

  const showTagSuggestions = () => {
    setFilteredTags(availableTags.filter(tag => !editingTags.includes(tag.id))
      .sort((a, b) => a.name.localeCompare(b.name)));
  };

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsTagEditing(true);
    showTagSuggestions();
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

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    setSelectedIndex(-1);

    // 選択済みのタグを除外
    const unselectedTags = availableTags.filter(tag => !editingTags.includes(tag.id));
    
    if (!value.trim()) {
      // 未選択のタグを名前順でソート
      setFilteredTags(unselectedTags.sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }

    const searchValue = value.toLowerCase();
    const filtered = unselectedTags
      .map(tag => {
        const nameLower = tag.name.toLowerCase();
        // 完全一致、前方一致、部分一致の優先度を付ける
        let priority = 0;
        if (nameLower === searchValue) priority = 3;
        else if (nameLower.startsWith(searchValue)) priority = 2;
        else if (nameLower.includes(searchValue)) priority = 1;
        return { tag, priority };
      })
      .filter(item => item.priority > 0)
      .sort((a, b) => b.priority - a.priority || a.tag.name.localeCompare(b.tag.name))
      .map(item => item.tag);

    setFilteredTags(filtered);
  };

  const handleTagSelect = async (selectedTag: typeof availableTags[0]) => {
    if (!editingTags.includes(selectedTag.id)) {
      setEditingTags([...editingTags, selectedTag.id]);
    }
    setTagInput('');
    setFilteredTags(availableTags.filter(tag => !editingTags.includes(tag.id)));
    setSelectedIndex(-1);
  };

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    setEditingTags(editingTags.filter(id => id !== tagId));
  };

  const handleNewTag = async () => {
    if (!tagInput.trim()) return;

    const inputValue = tagInput.trim();
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingTag) {
      if (!editingTags.includes(existingTag.id)) {
        setEditingTags([...editingTags, existingTag.id]);
      }
      setTagInput('');
      setFilteredTags([]);
      showTagSuggestions();
      return;
    }

    const confirmed = window.confirm(`新しいタグ「${inputValue}」を作成しますか？`);
    if (!confirmed) return;

    const newTag = await addTag({
      name: inputValue,
      color: generateTagColor()
    });

    if (newTag) {
      setEditingTags([...editingTags, newTag.id]);
      setTagInput('');
      setFilteredTags([]);
      showTagSuggestions();
    }
  };

  // 編集不可または編集状態でない場合は表示のみ
  if (!onUpdate || !editing) {
    return (
      <div className={styles.titleContainer}>
        {tags.length > 0 && (
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
                </span>
              );
            })}
          </div>
        )}
        <span>{value}</span>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    // タイトルとタグを同時に更新
    onUpdate?.(editValue, editingTags);
    
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
    setSelectedIndex(-1);
    setEditingCell?.(null);
  };

  // 編集可能な場合は入力フィールドを表示
  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`} onClick={(e) => e.stopPropagation()}>
      <div className={styles.tagList} onClick={(e) => e.stopPropagation()}>
        {editingTags.map(tagId => {
          const tag = availableTags.find(t => t.id === tagId);
          if (!tag) return null;
          return (
            <span
              key={tag.id}
              className={styles.tag}
              style={{ backgroundColor: tag.color }}
              onClick={handleTagClick}
            >
              {tag.name}
              <span 
                className={`${styles.removeButton} ${styles.tagAction}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleRemoveTag(tag.id, e);
                }}
              >
                ×
              </span>
            </span>
          );
        })}
        {isTagEditing && (
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              className={styles.tagInput}
              style={{ width: 'auto', minWidth: '100px' }}
              placeholder="タグを入力..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (!filteredTags.length) {
                  if (e.key === 'Enter') {
                    handleNewTag();
                  }
                  return;
                }

                switch (e.key) {
                  case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => 
                      prev < filteredTags.length - 1 ? prev + 1 : prev
                    );
                    break;
                  case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                    break;
                  case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < filteredTags.length) {
                      handleTagSelect(filteredTags[selectedIndex]);
                    } else {
                      handleNewTag();
                    }
                    break;
                  case 'Escape':
                    e.preventDefault();
                    setIsTagEditing(false);
                    setSelectedIndex(-1);
                    break;
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            {filteredTags.length > 0 && (
              <div className={styles.tagSuggestions}>
                <div className={styles.tagSuggestionsContent}>
                  {filteredTags.map((tag: Tag, index) => (
                    <div
                      key={tag.id}
                      className={`${styles.tagSuggestion} ${index === selectedIndex ? styles.selected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTagSelect(tag);
                      }}
                      tabIndex={0}
                    >
                      <span 
                        className={styles.tagSampleColor}
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!isTagEditing && (
          <button
            className={styles.tag}
            style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsTagEditing(true);
              showTagSuggestions();
            }}
          >
            +
          </button>
        )}
      </div>
      <input
        type="text"
        value={editValue}
        className={styles.editInput}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            // タグ編集中かどうかに関わらずEnterで確定
            handleSave(e as unknown as React.MouseEvent);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        autoFocus
      />
    </div>
  );
}
