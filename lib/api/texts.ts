import type { PaliText } from '@/types';
import { FileStorage } from '@/lib/data/file-storage';

// データストレージのシングルトンインスタンス
const storage = new FileStorage();

// API層：テキストデータの取得と操作
export const textsApi = {
  async getAll(): Promise<PaliText[]> {
    return storage.getTexts();
  },

  async getById(id: string): Promise<PaliText | null> {
    return storage.getTextById(id);
  },

  async create(text: Omit<PaliText, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaliText> {
    return storage.createText(text);
  },

  async update(id: string, updates: Partial<PaliText>): Promise<PaliText> {
    return storage.updateText(id, updates);
  },

  async delete(id: string): Promise<boolean> {
    return storage.deleteText(id);
  },
};

