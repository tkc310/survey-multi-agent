# パーリ語学習サイト

パーリ語の主要な経典を題材としたテキスト読解と音声読み上げを中心とした学習サイトです。

## 特徴

- **テキスト読解**: パーリ語の経典テキストを表示し、カタカナフリガナ、和訳を確認できます
- **単語詳細**: 各単語にカーソルを合わせると、カタカナ、和訳、英訳を表示
- **音声読み上げ**: Web Speech APIを使用したテキストの音声読み上げ機能（速度調整可能）
- **管理画面**: テキストと辞書データを簡単に管理できる管理画面
- **多言語対応**: 将来的にタイ語など他言語への拡張も可能な構造

## 技術スタック

- **ランタイム**: Bun
- **フロントエンド**: Next.js 15+ (App Router) + TypeScript
- **UIコンポーネント**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **音声**: Web Speech API
- **データ管理**: JSONファイルベース（将来的にデータベース移行可能）

## セットアップ

### 前提条件

- Bun がインストールされていること

### インストール

```bash
# 依存関係をインストール
bun install

# 開発サーバーを起動
bun run dev
```

開発サーバーが起動したら、ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 使い方

### テキストの読解

1. ホーム画面でテキスト一覧から読みたいテキストをクリック
2. テキスト読解画面で以下の機能を利用できます：
   - カタカナ、和訳の表示/非表示切り替え
   - 単語にカーソルを合わせて詳細情報を表示
   - 音声読み上げ機能で発音を確認

### 管理画面

1. ヘッダーの「管理画面」をクリック
2. 「テキスト管理」または「辞書管理」を選択
3. 新規追加、編集、削除が可能

#### テキスト管理

- タイトル、パーリ語テキスト、カタカナ、和訳、出典を登録

#### 辞書管理

- パーリ語単語、カタカナフリガナ、和訳、英訳、タイ語訳（オプション）を登録
- 品詞、発音記号、用例も追加可能

## プロジェクト構造

```
.
├── app/                    # Next.js App Router
│   ├── page.tsx           # ホームページ
│   ├── reading/[id]/      # テキスト読解ページ
│   ├── admin/             # 管理画面
│   └── api/               # API Routes
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   ├── admin/            # 管理画面用コンポーネント
│   ├── TextReader.tsx    # テキスト読解コンポーネント
│   ├── WordTooltip.tsx   # 単語ツールチップ
│   └── AudioPlayer.tsx   # 音声プレイヤー
├── lib/                  # ユーティリティ
│   ├── api/             # API層（データ取得の抽象化）
│   └── data/            # データアクセス層
├── data/                # データファイル
│   ├── texts.json       # テキストデータ
│   └── dictionary.json  # 辞書データ
└── types/               # TypeScript型定義
```

## データ構造

### テキストデータ

```typescript
{
  id: string;
  title: string;
  content: string;           // パーリ語テキスト
  katakana?: string;         // カタカナフリガナ
  translation?: string;      // 日本語訳
  source?: string;           // 経典の出典情報
  createdAt: string;
  updatedAt: string;
}
```

### 辞書データ

```typescript
{
  word: string;              // パーリ語単語
  katakana: string;          // カタカナフリガナ
  translations: {
    ja: string;             // 日本語訳
    en: string;             // 英語訳
    th?: string;            // タイ語訳（オプション）
  };
  pronunciation?: string;    // 発音記号
  partOfSpeech?: string;    // 品詞
  examples?: string[];       // 用例
}
```

## 今後の拡張

- データベースへの移行（SQLiteやPostgreSQL）
- タイ語など他言語の翻訳追加
- ユーザー認証と学習進捗の記録
- 検索機能の強化
- お気に入り機能
- パーリ語専用のTTS（Text-to-Speech）APIの統合

## ライセンス

MIT

