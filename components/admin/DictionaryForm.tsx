'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { DictionaryEntry } from '@/types';

interface DictionaryFormProps {
  entry: DictionaryEntry | null;
  onClose: () => void;
}

export function DictionaryForm({ entry, onClose }: DictionaryFormProps) {
  const [formData, setFormData] = useState({
    word: entry?.word || '',
    katakana: entry?.katakana || '',
    translations: {
      ja: entry?.translations.ja || '',
      en: entry?.translations.en || '',
      th: entry?.translations.th || '',
    },
    pronunciation: entry?.pronunciation || '',
    partOfSpeech: entry?.partOfSpeech || '',
    examples: entry?.examples?.join('\n') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/dictionary';
      const method = entry ? 'PUT' : 'POST';
      
      const payload: DictionaryEntry = {
        word: formData.word,
        katakana: formData.katakana,
        translations: {
          ja: formData.translations.ja,
          en: formData.translations.en,
          ...(formData.translations.th && { th: formData.translations.th }),
        },
        ...(formData.pronunciation && { pronunciation: formData.pronunciation }),
        ...(formData.partOfSpeech && { partOfSpeech: formData.partOfSpeech }),
        ...(formData.examples && {
          examples: formData.examples.split('\n').filter(e => e.trim()),
        }),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        onClose();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? '辞書エントリを編集' : '新規辞書エントリを追加'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="word">パーリ語単語 *</Label>
              <Input
                id="word"
                value={formData.word}
                onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                required
                disabled={!!entry} // 編集時は単語を変更不可
              />
            </div>

            <div>
              <Label htmlFor="partOfSpeech">品詞</Label>
              <Input
                id="partOfSpeech"
                value={formData.partOfSpeech}
                onChange={(e) => setFormData({ ...formData, partOfSpeech: e.target.value })}
                placeholder="例: 名詞, 動詞, 形容詞"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="katakana">カタカナフリガナ *</Label>
            <Input
              id="katakana"
              value={formData.katakana}
              onChange={(e) => setFormData({ ...formData, katakana: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="pronunciation">発音記号 (IPA等)</Label>
            <Input
              id="pronunciation"
              value={formData.pronunciation}
              onChange={(e) => setFormData({ ...formData, pronunciation: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">翻訳</h3>
            
            <div>
              <Label htmlFor="translation-ja">日本語 *</Label>
              <Input
                id="translation-ja"
                value={formData.translations.ja}
                onChange={(e) => setFormData({
                  ...formData,
                  translations: { ...formData.translations, ja: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="translation-en">English *</Label>
              <Input
                id="translation-en"
                value={formData.translations.en}
                onChange={(e) => setFormData({
                  ...formData,
                  translations: { ...formData.translations, en: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="translation-th">ไทย (タイ語)</Label>
              <Input
                id="translation-th"
                value={formData.translations.th}
                onChange={(e) => setFormData({
                  ...formData,
                  translations: { ...formData.translations, th: e.target.value }
                })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="examples">用例（1行に1つ）</Label>
            <Textarea
              id="examples"
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              rows={3}
              placeholder="例: sabbe sattā = すべての生き物"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

