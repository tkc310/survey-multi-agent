// パーリ語テキストデータの型定義
export interface PaliText {
  id: string;
  title: string;
  content: string; // パーリ語テキスト
  katakana?: string; // カタカナフリガナ（テキスト全体）
  translation?: string; // 日本語訳
  source?: string; // 経典の出典情報
  createdAt: string;
  updatedAt: string;
}

// 辞書エントリの型定義
export interface DictionaryEntry {
  word: string; // パーリ語単語
  katakana: string; // カタカナフリガナ
  translations: {
    ja: string; // 日本語訳
    en: string; // 英語訳
    th?: string; // タイ語訳（将来的な拡張）
    [key: string]: string | undefined; // その他の言語も将来的に追加可能
  };
  pronunciation?: string; // 発音記号（IPA等）
  partOfSpeech?: string; // 品詞
  examples?: string[]; // 用例
}

// データアクセス層のインターフェース
export interface IDataStorage {
  // テキスト操作
  getTexts(): Promise<PaliText[]>;
  getTextById(id: string): Promise<PaliText | null>;
  createText(text: Omit<PaliText, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaliText>;
  updateText(id: string, text: Partial<PaliText>): Promise<PaliText>;
  deleteText(id: string): Promise<boolean>;

  // 辞書操作
  getDictionaryEntries(): Promise<DictionaryEntry[]>;
  getDictionaryEntry(word: string): Promise<DictionaryEntry | null>;
  createDictionaryEntry(entry: DictionaryEntry): Promise<DictionaryEntry>;
  updateDictionaryEntry(word: string, entry: Partial<DictionaryEntry>): Promise<DictionaryEntry>;
  deleteDictionaryEntry(word: string): Promise<boolean>;
  searchDictionary(query: string): Promise<DictionaryEntry[]>;
}

// API レスポンスの型定義
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

