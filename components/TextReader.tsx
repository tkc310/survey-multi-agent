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

  // テキストを節ごとに分割
  const contentLines = text.content.split('\n').filter(line => line.trim());
  const katakanaLines = text.katakana?.split('\n').filter(line => line.trim()) || [];
  const translationLines = text.translation?.split('\n').filter(line => line.trim()) || [];

  // 節の数を計算（最大の行数を基準にする）
  const maxLines = Math.max(contentLines.length, katakanaLines.length, translationLines.length);

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

      {/* パーリ語テキスト（節ごとに表示） */}
      <div className="space-y-6">
        {contentLines.map((contentLine, index) => {
          // 単語を分割（空白とハイフンで区切る）
          const words = contentLine.split(/\s+/);
          const katakanaLine = katakanaLines[index];
          const translationLine = translationLines[index];

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">第 {index + 1} 節</CardTitle>
                <CardDescription>単語にカーソルを合わせると詳細情報が表示されます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* パーリ語本文 */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                      パーリ語
                    </h3>
                    <div className="text-2xl leading-relaxed">
                      {words.map((word, wordIndex) => {
                        // ハイフンで繋がった複合語を個別の単語に分割
                        const subWords = word.split('-');
                        return (
                          <span key={wordIndex}>
                            {subWords.map((subWord, subIndex) => (
                              <span key={subIndex}>
                                <WordTooltip word={subWord}>
                                  <span className="cursor-pointer hover:bg-accent/50 rounded px-1 transition-colors">
                                    {subWord}
                                  </span>
                                </WordTooltip>
                                {subIndex < subWords.length - 1 && <span>-</span>}
                              </span>
                            ))}
                            {wordIndex < words.length - 1 && ' '}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* カタカナフリガナ */}
                  {showKatakana && katakanaLine && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                        カタカナ
                      </h3>
                      <p className="text-lg">{katakanaLine}</p>
                    </div>
                  )}

                  {/* 和訳 */}
                  {showTranslation && translationLine && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                        日本語訳
                      </h3>
                      <p className="text-lg">{translationLine}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
