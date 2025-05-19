// stores/markdownStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MarkdownStore = {
  cachedSources: Record<string, string>; // 支持多文档存储（键值对）
  currentSource: string;
  updateSource: (key: string, content: string) => void;
  getCachedSource: (key: string) => string | null;
};

export const useMarkdownStore = create<MarkdownStore>()(
  persist(
    (set, get) => ({
      cachedSources: {},
      currentSource: '',
      updateSource: (key, content) =>
        set({
          currentSource: content,
          cachedSources: { ...get().cachedSources, [key]: content }
        }),
      getCachedSource: (key) => get().cachedSources[key] || null
    }),
    {
      name: 'markdown-storage',
      partialize: (state) => ({ cachedSources: state.cachedSources }) // 只持久化缓存
    }
  )
);
