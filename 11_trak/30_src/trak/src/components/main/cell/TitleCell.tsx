import { useState } from 'react';
import styles from '../TableView.module.css';
import { useTags } from '../TagsContext';
import { Tag } from '@/types';

interface TitleCellProps {
  setEditingCell?: (value: null) => void;
  value: string;
  tags?: string[];
  onUpdate?: (value: string) => void;
  onUpdateTags?: (tags: string[]) => void;
}

export default function TitleCell({
  value,
  tags = [],
  onUpdate,
  onUpdateTags,
  setEditingCell
}: TitleCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const { tags: availableTags, addTag } = useTags();
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateTags) {
      setIsTagEditing(true);
    }
  };

  const handleClickOutside = () => {
    setEditingCell?.(null);
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);
    if (value.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(value.toLowerCase()) ||
        tag.id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags([]);
    }
  };

  const handleTagSelect = async (selectedTag?: typeof availableTags[0]) => {
    if (!onUpdateTags) return;

    const inputValue = selectedTag?.name || tagInput.trim();
    if (!inputValue) {
      setIsTagEditing(false);
      return;
    }

    if (selectedTag) {
      if (!tags.includes(selectedTag.id)) {
        onUpdateTags([...tags, selectedTag.id]);
      }
    } else if (inputValue) {
      const existingTag = availableTags.find(
        tag => tag.name.toLowerCase() === inputValue.toLowerCase()
      );

      let tagToAdd;
      if (existingTag) {
        tagToAdd = existingTag;
      } else {
        // 新しいタグを作成
        const newTag = await addTag({
          name: inputValue,
          color: '#6366f1' // デフォルトカラー
        });
        if (!newTag) {
          setIsTagEditing(false);
          return;
        }
        tagToAdd = newTag;
      }

      // タグが既に追加されていない場合のみ追加
      if (!tags.includes(tagToAdd.id)) {
        onUpdateTags([...tags, tagToAdd.id]);
      }
    }
    
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
  };

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
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

  const handleBlur = () => {
    if (editValue !== value) {
      onUpdate(editValue);
    }
  };

  // 編集可能な場合は入力フィールドを表示
  return (
    <div className={styles.titleContainer}>
      <div className={styles.tagList}>
        {tags.map(tagId => {
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
            </span>
          );
        })}
          {isTagEditing && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className={styles.editInput}
                style={{ width: 'auto', minWidth: '100px' }}
                placeholder="タグを入力..."
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTagSelect();
                  }
                }}
                autoFocus
                onBlur={(e) => {
                  // サジェストをクリックした場合はフォーカスを失わない
                  if (e.relatedTarget && e.relatedTarget.closest(`.${styles.tagSuggestions}`)) {
                    return;
                  }
                  handleClickOutside();
                }}
              />
              {filteredTags.length > 0 && (
                <div className={styles.tagSuggestions}>
                  {filteredTags.map(tag => (
                    <div
                      key={tag.id}
                      className={styles.tagSuggestion}
                      onClick={() => handleTagSelect(tag)}
                    >
                      <span 
                        className={styles.tagSampleColor}
                        style={{ backgroundColor: tag.color }}
                      />
                      {tag.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
        )}
        {!isTagEditing && onUpdateTags && (
          <button
            className={styles.tag}
            style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
            onClick={() => setIsTagEditing(true)}
          >
            +
          </button>
        )}
      </div>
      <div className={`${styles.editableCell} ${styles.editingCell}`}>
        <input
          type="text"
          value={editValue}
          className={styles.editInput}
          onChange={handleChange}
          onBlur={() => {
            handleBlur();
            handleClickOutside();
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
