import type { DictionaryEntry } from '@/types';
import { FileStorage } from '@/lib/data/file-storage';

// データストレージのシングルトンインスタンス
const storage = new FileStorage();

// API層：辞書データの取得と操作
export const dictionaryApi = {
  async getAll(): Promise<DictionaryEntry[]> {
    return storage.getDictionaryEntries();
  },

  async getByWord(word: string): Promise<DictionaryEntry | null> {
    return storage.getDictionaryEntry(word);
  },

  async create(entry: DictionaryEntry): Promise<DictionaryEntry> {
    return storage.createDictionaryEntry(entry);
  },

  async update(word: string, updates: Partial<DictionaryEntry>): Promise<DictionaryEntry> {
    return storage.updateDictionaryEntry(word, updates);
  },

  async delete(word: string): Promise<boolean> {
    return storage.deleteDictionaryEntry(word);
  },

  async search(query: string): Promise<DictionaryEntry[]> {
    return storage.searchDictionary(query);
  },
};

