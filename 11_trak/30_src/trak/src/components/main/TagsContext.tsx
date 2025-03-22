'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Tag } from '@/types';

interface TagsContextType {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  addTag: (tag: Omit<Tag, 'id'>) => Promise<Tag | null>;
  getTag: (id: string) => Tag | undefined;
}

const TagsContext = createContext<TagsContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: React.ReactNode }) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      if (response.ok) {
        setTags(data.tags);
      } else {
        setError(data.error || 'Failed to load tags');
      }
    } catch {
      setError('Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = async (tag: Omit<Tag, 'id'>): Promise<Tag | null> => {
    try {
      const id = tag.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tag, id }),
      });

      const data = await response.json();
      if (response.ok) {
        setTags(data.tags);
        return data.tags.find((t: Tag) => t.id === id) || null;
      }
      setError(data.error || 'Failed to add tag');
      return null;
    } catch {
      setError('Failed to add tag');
      return null;
    }
  };

  const getTag = (id: string) => tags.find(tag => tag.id === id);

  return (
    <TagsContext.Provider value={{ tags, isLoading, error, addTag, getTag }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTags must be used within a TagsProvider');
  }
  return context;
}
