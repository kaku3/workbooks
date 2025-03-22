import { useEffect, useState } from 'react';
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

  // リスト外クリックでタグ候補を閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.tagSuggestions}`) && 
          !target.closest(`.${styles.tagInput}`) &&
          !target.closest(`.${styles.tagList}`)) {
        setIsTagEditing(false);
        setFilteredTags([]);
      }
    };

    if (isTagEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTagEditing]);

  const showTagSuggestions = () => {
    setFilteredTags(availableTags);
  };

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateTags) {
      setIsTagEditing(true);
      showTagSuggestions();
    }
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
      setFilteredTags(availableTags);
    }
  };

  const handleTagSelect = async (selectedTag: typeof availableTags[0]) => {
    if (!onUpdateTags) return;
    if (!tags.includes(selectedTag.id)) {
      onUpdateTags([...tags, selectedTag.id]);
    }
    setTagInput('');
    setFilteredTags([]);
    setIsTagEditing(false);
  };

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateTags) return;
    onUpdateTags(tags.filter(id => id !== tagId));
  };

  const handleNewTag = async () => {
    if (!onUpdateTags || !tagInput.trim()) return;

    const inputValue = tagInput.trim();
    const existingTag = availableTags.find(
      tag => tag.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (existingTag) {
      handleTagSelect(existingTag);
      return;
    }

    const newTag = await addTag({
      name: inputValue,
      color: '#6366f1' // デフォルトカラー
    });

    if (newTag) {
      handleTagSelect(newTag);
    }
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

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editValue !== value) {
      onUpdate(editValue);
    }
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
    setEditingCell?.(null);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(value);
    setIsTagEditing(false);
    setTagInput('');
    setFilteredTags([]);
    setEditingCell?.(null);
  };

  // 編集可能な場合は入力フィールドを表示
  return (
    <div className={styles.titleEditor} onClick={(e) => e.stopPropagation()}>
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
              <span 
                className={styles.removeButton}
                onClick={(e) => handleRemoveTag(tag.id, e)}
              >
                ×
              </span>
            </span>
          );
        })}
        {isTagEditing && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className={`${styles.editInput} ${styles.tagInput}`}
              style={{ width: 'auto', minWidth: '100px' }}
              placeholder="タグを入力..."
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNewTag();
                }
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            {filteredTags.length > 0 && (
              <div className={styles.tagSuggestions}>
                {filteredTags.map((tag: Tag) => (
                  <div
                    key={tag.id}
                    className={styles.tagSuggestion}
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
                    {tag.name} ({tag.id})
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
            onClick={(e) => {
              e.stopPropagation();
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
          if (e.key === 'Enter' && !isTagEditing) {
            handleSave(e as unknown as React.MouseEvent);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        autoFocus
      />
      <div className={styles.editActions}>
        <button
          className={`${styles.editAction} ${styles.cancelButton}`}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={`${styles.editAction} ${styles.saveButton}`}
          onClick={handleSave}
        >
          OK
        </button>
      </div>
    </div>
  );
}
