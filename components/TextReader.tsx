'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WordTooltip } from '@/components/WordTooltip';
import { AudioPlayer } from '@/components/AudioPlayer';
import type { PaliText } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

interface TextReaderProps {
  text: PaliText;
}

export function TextReader({ text }: TextReaderProps) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showKatakana, setShowKatakana] = useState(true);

  // パーリ語テキストを単語に分割
  const words = text.content.split(/\s+/);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
        {text.source && (
          <p className="text-muted-foreground">{text.source}</p>
        )}
      </div>

      {/* 表示切り替えボタン */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowKatakana(!showKatakana)}
        >
          {showKatakana ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
          カタカナ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
        >
          {showTranslation ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
          和訳
        </Button>
      </div>

      {/* 音声プレイヤー */}
      <AudioPlayer text={text.content} />

      {/* パーリ語テキスト */}
      <Card>
        <CardHeader>
          <CardTitle>パーリ語テキスト</CardTitle>
          <CardDescription>単語にカーソルを合わせると詳細情報が表示されます</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* パーリ語本文 */}
            <div className="text-2xl leading-relaxed">
              {words.map((word, index) => (
                <WordTooltip key={index} word={word}>
                  <span className="cursor-pointer hover:bg-accent/50 rounded px-1 transition-colors">
                    {word}
                  </span>
                </WordTooltip>
              ))}
            </div>

            {/* カタカナフリガナ */}
            {showKatakana && text.katakana && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  カタカナ
                </h3>
                <p className="text-lg">{text.katakana}</p>
              </div>
            )}

            {/* 和訳 */}
            {showTranslation && text.translation && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                  日本語訳
                </h3>
                <p className="text-lg">{text.translation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

