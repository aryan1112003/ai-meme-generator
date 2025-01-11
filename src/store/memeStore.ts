import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemeTemplate, GeneratedMeme, UserPreferences } from '../types';

interface MemeStore {
  templates: MemeTemplate[];
  favorites: GeneratedMeme[];
  history: GeneratedMeme[];
  preferences: UserPreferences;
  setTemplates: (templates: MemeTemplate[]) => void;
  addToFavorites: (meme: GeneratedMeme) => void;
  removeFromFavorites: (memeId: string) => void;
  addToHistory: (meme: GeneratedMeme) => void;
  clearHistory: () => void;
  toggleDarkMode: () => void;
  setLanguage: (language: string) => void;
}

export const useMemeStore = create<MemeStore>()(
  persist(
    (set) => ({
      templates: [],
      favorites: [],
      history: [],
      preferences: {
        darkMode: true,
        language: 'en',
      },
      setTemplates: (templates) => set({ templates }),
      addToFavorites: (meme) =>
        set((state) => ({
          favorites: [meme, ...state.favorites],
        })),
      removeFromFavorites: (memeId) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== memeId),
        })),
      addToHistory: (meme) =>
        set((state) => ({
          history: [meme, ...state.history].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
      toggleDarkMode: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            darkMode: !state.preferences.darkMode,
          },
        })),
      setLanguage: (language) =>
        set((state) => ({
          preferences: { ...state.preferences, language },
        })),
    }),
    {
      name: 'meme-store',
    }
  )
);