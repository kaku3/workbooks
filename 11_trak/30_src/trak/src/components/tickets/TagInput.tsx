'use client';

import { useEffect, useState } from 'react';
import { useTags } from '../main/TagsContext';
import { Tag } from '@/types';
import styles from './TicketForm.module.css';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const { tags: availableTags, addTag } = useTags();
  const [tagInput, setTagInput] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isTagEditing, setIsTagEditing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.tagSuggestions}`) && 
          !target.closest(`.${styles.tagInput}`) &&
          !target.closest(`.${styles.tagList}`)) {
        setIsTagEditing(false);
        setShowSuggestions(false);
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
    const filtered = value.trim()
      ? availableTags.filter(tag =>
          tag.name.toLowerCase().includes(value.toLowerCase()) ||
          tag.id.toLowerCase().includes(value.toLowerCase())
        )
      : availableTags;
    setFilteredTags(filtered);
  };

  const handleTagSelect = async (selectedTag: Tag) => {
    if (!tags.includes(selectedTag.id)) {
      onChange([...tags, selectedTag.id]);
    }
    setTagInput('');
    setShowSuggestions(false);
    setIsTagEditing(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onChange(tags.filter(id => id !== tagId));
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

    const newTag = await addTag({
      name: inputValue,
      color: '#6366f1' // デフォルトカラー
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
            setFilteredTags(availableTags);
            setShowSuggestions(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleNewTag();
            }
          }}
        />
        {showSuggestions && (
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
    </div>
  );
}
