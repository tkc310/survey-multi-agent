import { readFile, writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';
import type { IDataStorage, PaliText, DictionaryEntry } from '@/types';

const DATA_DIR = join(process.cwd(), 'data');
const DICTIONARY_DIR = join(DATA_DIR, 'dictionary');
const TEXTS_FILE = join(DATA_DIR, 'sutta.json');

// ファイルベースのデータストレージ実装
export class FileStorage implements IDataStorage {
  private async ensureDataDir() {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
    await this.ensureDataDir();
    try {
      if (!existsSync(filePath)) {
        await writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
        return defaultValue;
      }
      const content = await readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return defaultValue;
    }
  }

  private async writeJsonFile<T>(filePath: string, data: T): Promise<void> {
    await this.ensureDataDir();
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // テキスト操作
  async getTexts(): Promise<PaliText[]> {
    return this.readJsonFile<PaliText[]>(TEXTS_FILE, []);
  }

  async getTextById(id: string): Promise<PaliText | null> {
    const texts = await this.getTexts();
    return texts.find(text => text.id === id) || null;
  }

  async createText(text: Omit<PaliText, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaliText> {
    const texts = await this.getTexts();
    const now = new Date().toISOString();
    const newText: PaliText = {
      ...text,
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    texts.push(newText);
    await this.writeJsonFile(TEXTS_FILE, texts);
    return newText;
  }

  async updateText(id: string, updates: Partial<PaliText>): Promise<PaliText> {
    const texts = await this.getTexts();
    const index = texts.findIndex(text => text.id === id);
    if (index === -1) {
      throw new Error(`Text with id ${id} not found`);
    }
    const updatedText = {
      ...texts[index],
      ...updates,
      id: texts[index].id, // IDは変更不可
      createdAt: texts[index].createdAt, // 作成日時は変更不可
      updatedAt: new Date().toISOString(),
    };
    texts[index] = updatedText;
    await this.writeJsonFile(TEXTS_FILE, texts);
    return updatedText;
  }

  async deleteText(id: string): Promise<boolean> {
    const texts = await this.getTexts();
    const filteredTexts = texts.filter(text => text.id !== id);
    if (filteredTexts.length === texts.length) {
      return false; // テキストが見つからなかった
    }
    await this.writeJsonFile(TEXTS_FILE, filteredTexts);
    return true;
  }

  // 辞書操作
  async getDictionaryEntries(): Promise<DictionaryEntry[]> {
    await this.ensureDataDir();
    try {
      // dictionaryディレクトリが存在するか確認
      if (!existsSync(DICTIONARY_DIR)) {
        return [];
      }

      // すべての*.jsonファイルを読み込む
      const files = readdirSync(DICTIONARY_DIR).filter(file => 
        file.endsWith('.json')
      );
      
      if (files.length === 0) {
        return [];
      }

      const allEntries: DictionaryEntry[] = [];
      for (const file of files) {
        const filePath = join(DICTIONARY_DIR, file);
        const content = await readFile(filePath, 'utf-8');
        const entries = JSON.parse(content) as DictionaryEntry[];
        allEntries.push(...entries);
      }
      
      return allEntries;
    } catch (error) {
      console.error('Error reading dictionary files:', error);
      return [];
    }
  }

  async getDictionaryEntry(word: string): Promise<DictionaryEntry | null> {
    const entries = await this.getDictionaryEntries();
    return entries.find(entry => entry.word === word) || null;
  }

  async createDictionaryEntry(entry: DictionaryEntry): Promise<DictionaryEntry> {
    // dictionaryディレクトリを確保
    if (!existsSync(DICTIONARY_DIR)) {
      await mkdir(DICTIONARY_DIR, { recursive: true });
    }
    
    // 単語の最初の文字でファイルを決定
    const firstLetter = entry.word[0].toLowerCase();
    const dictionaryFile = join(DICTIONARY_DIR, `${firstLetter}.json`);
    
    // 該当するアルファベットファイルを読み込む
    const entries = await this.readJsonFile<DictionaryEntry[]>(dictionaryFile, []);
    
    // 既存の単語があれば更新
    const existingIndex = entries.findIndex(e => e.word === entry.word);
    if (existingIndex !== -1) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    await this.writeJsonFile(dictionaryFile, entries);
    return entry;
  }

  async updateDictionaryEntry(word: string, updates: Partial<DictionaryEntry>): Promise<DictionaryEntry> {
    // 単語の最初の文字でファイルを決定
    const firstLetter = word[0].toLowerCase();
    const dictionaryFile = join(DICTIONARY_DIR, `${firstLetter}.json`);
    
    // 該当するアルファベットファイルを読み込む
    const entries = await this.readJsonFile<DictionaryEntry[]>(dictionaryFile, []);
    const index = entries.findIndex(entry => entry.word === word);
    
    if (index === -1) {
      throw new Error(`Dictionary entry for word "${word}" not found`);
    }
    
    const updatedEntry = {
      ...entries[index],
      ...updates,
      word: entries[index].word, // 単語は変更不可
    };
    entries[index] = updatedEntry;
    
    await this.writeJsonFile(dictionaryFile, entries);
    return updatedEntry;
  }

  async deleteDictionaryEntry(word: string): Promise<boolean> {
    // 単語の最初の文字でファイルを決定
    const firstLetter = word[0].toLowerCase();
    const dictionaryFile = join(DICTIONARY_DIR, `${firstLetter}.json`);
    
    // 該当するアルファベットファイルを読み込む
    const entries = await this.readJsonFile<DictionaryEntry[]>(dictionaryFile, []);
    const filteredEntries = entries.filter(entry => entry.word !== word);
    
    if (filteredEntries.length === entries.length) {
      return false; // エントリが見つからなかった
    }
    
    await this.writeJsonFile(dictionaryFile, filteredEntries);
    return true;
  }

  async searchDictionary(query: string): Promise<DictionaryEntry[]> {
    const entries = await this.getDictionaryEntries();
    const lowerQuery = query.toLowerCase();
    return entries.filter(entry =>
      entry.word.toLowerCase().includes(lowerQuery) ||
      entry.katakana.includes(query) ||
      entry.translations.ja.toLowerCase().includes(lowerQuery) ||
      entry.translations.en.toLowerCase().includes(lowerQuery)
    );
  }
}

