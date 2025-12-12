'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { PaliText } from '@/types';

interface TextFormProps {
  text: PaliText | null;
  onClose: () => void;
}

export function TextForm({ text, onClose }: TextFormProps) {
  const [formData, setFormData] = useState({
    title: text?.title || '',
    content: text?.content || '',
    katakana: text?.katakana || '',
    translation: text?.translation || '',
    source: text?.source || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = '/api/texts';
      const method = text ? 'PUT' : 'POST';
      const body = text
        ? JSON.stringify({ id: text.id, ...formData })
        : JSON.stringify(formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.json();
      if (data.success) {
        onClose();
      } else {
        alert('保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving text:', error);
      alert('保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{text ? 'テキストを編集' : '新規テキストを追加'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">パーリ語テキスト *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="katakana">カタカナフリガナ</Label>
            <Textarea
              id="katakana"
              value={formData.katakana}
              onChange={(e) => setFormData({ ...formData, katakana: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="translation">日本語訳</Label>
            <Textarea
              id="translation"
              value={formData.translation}
              onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="source">出典</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
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

