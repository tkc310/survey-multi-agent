'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TextForm } from '@/components/admin/TextForm';
import type { PaliText } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminTextsPage() {
  const [texts, setTexts] = useState<PaliText[]>([]);
  const [editingText, setEditingText] = useState<PaliText | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTexts = async () => {
    try {
      const response = await fetch('/api/texts');
      const data = await response.json();
      if (data.success) {
        setTexts(data.data);
      }
    } catch (error) {
      console.error('Error fetching texts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('このテキストを削除しますか？')) return;

    try {
      const response = await fetch(`/api/texts?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchTexts();
      }
    } catch (error) {
      console.error('Error deleting text:', error);
    }
  };

  const handleEdit = (text: PaliText) => {
    setEditingText(text);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingText(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingText(null);
    fetchTexts();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">テキスト管理</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          新規追加
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <TextForm
            text={editingText}
            onClose={handleFormClose}
          />
        </div>
      )}

      <div className="space-y-4">
        {texts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                テキストがまだ登録されていません
              </p>
            </CardContent>
          </Card>
        ) : (
          texts.map((text) => (
            <Card key={text.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{text.title}</CardTitle>
                    {text.source && (
                      <CardDescription>{text.source}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(text)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(text.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold">パーリ語:</p>
                    <p className="text-sm">{text.content}</p>
                  </div>
                  {text.katakana && (
                    <div>
                      <p className="text-sm font-semibold">カタカナ:</p>
                      <p className="text-sm">{text.katakana}</p>
                    </div>
                  )}
                  {text.translation && (
                    <div>
                      <p className="text-sm font-semibold">和訳:</p>
                      <p className="text-sm">{text.translation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

