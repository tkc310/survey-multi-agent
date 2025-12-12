'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DictionaryForm } from '@/components/admin/DictionaryForm';
import type { DictionaryEntry } from '@/types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export default function AdminDictionaryPage() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DictionaryEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/dictionary');
      const data = await response.json();
      if (data.success) {
        setEntries(data.data);
        setFilteredEntries(data.data);
      }
    } catch (error) {
      console.error('Error fetching dictionary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = entries.filter(entry =>
        entry.word.toLowerCase().includes(query) ||
        entry.katakana.includes(searchQuery) ||
        entry.translations.ja.toLowerCase().includes(query) ||
        entry.translations.en.toLowerCase().includes(query)
      );
      setFilteredEntries(filtered);
    } else {
      setFilteredEntries(entries);
    }
  }, [searchQuery, entries]);

  const handleDelete = async (word: string) => {
    if (!confirm('この辞書エントリを削除しますか？')) return;

    try {
      const response = await fetch(`/api/dictionary?word=${encodeURIComponent(word)}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEdit = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
    fetchEntries();
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
        <h1 className="text-3xl font-bold">辞書管理</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          新規追加
        </Button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <DictionaryForm
            entry={editingEntry}
            onClose={handleFormClose}
          />
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="単語を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {searchQuery ? '検索結果がありません' : '辞書エントリがまだ登録されていません'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.word}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{entry.word}</CardTitle>
                    {entry.partOfSpeech && (
                      <CardDescription>{entry.partOfSpeech}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.word)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold">カタカナ:</p>
                      <p className="text-sm">{entry.katakana}</p>
                    </div>
                    {entry.pronunciation && (
                      <div>
                        <p className="text-sm font-semibold">発音記号:</p>
                        <p className="text-sm">{entry.pronunciation}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold">日本語:</p>
                      <p className="text-sm">{entry.translations.ja}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">English:</p>
                      <p className="text-sm">{entry.translations.en}</p>
                    </div>
                    {entry.translations.th && (
                      <div>
                        <p className="text-sm font-semibold">ไทย:</p>
                        <p className="text-sm">{entry.translations.th}</p>
                      </div>
                    )}
                  </div>
                </div>
                {entry.examples && entry.examples.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-semibold mb-2">用例:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {entry.examples.map((example, index) => (
                        <li key={index} className="text-sm">{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

