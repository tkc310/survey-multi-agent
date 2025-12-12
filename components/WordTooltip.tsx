'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { DictionaryEntry } from '@/types';

interface WordTooltipProps {
  word: string;
  children: React.ReactNode;
}

// 単語を正規化する関数（句読点や特殊文字を除去し、小文字に変換）
function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[,\.\!?;:"""'''`\-—–()[\]{}]/g, '')
    .trim();
}

export function WordTooltip({ word, children }: WordTooltipProps) {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      try {
        // 単語を正規化してから検索
        const normalizedWord = normalizeWord(word);
        if (!normalizedWord) {
          setLoading(false);
          return;
        }
        
        const response = await fetch(`/api/dictionary?word=${encodeURIComponent(normalizedWord)}`);
        const data = await response.json();
        if (data.success && data.data) {
          setEntry(data.data);
        }
      } catch (error) {
        console.error('Error fetching dictionary entry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [word]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned) {
      // すでにピン留めされている場合は閉じる
      setIsPinned(false);
      setIsOpen(false);
    } else {
      // ピン留めして開く
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    // ピン留めされていない場合のみ、ホバーで開閉を制御
    if (!isPinned) {
      setIsOpen(open);
    }
  };

  if (!entry && !loading) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild onClick={handleClick}>
          {children}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          {loading ? (
            <p className="text-sm">読み込み中...</p>
          ) : entry ? (
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-lg">{entry.word}</p>
                {entry.partOfSpeech && (
                  <p className="text-xs text-muted-foreground">{entry.partOfSpeech}</p>
                )}
              </div>
              <div className="space-y-1">
                <div>
                  <span className="text-xs font-semibold">カタカナ:</span>
                  <span className="text-sm ml-2">{entry.katakana}</span>
                </div>
              </div>
              <div className="border-t pt-2 space-y-1">
                <div>
                  <span className="text-xs font-semibold">日本語:</span>
                  <span className="text-sm ml-2">{entry.translations.ja}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold">English:</span>
                  <span className="text-sm ml-2">{entry.translations.en}</span>
                </div>
                {entry.translations.th && (
                  <div>
                    <span className="text-xs font-semibold">ไทย:</span>
                    <span className="text-sm ml-2">{entry.translations.th}</span>
                  </div>
                )}
              </div>
              {entry.examples && entry.examples.length > 0 && (
                <div className="border-t pt-2">
                  <p className="text-xs font-semibold mb-1">用例:</p>
                  {entry.examples.map((example, index) => (
                    <p key={index} className="text-xs italic">{example}</p>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

