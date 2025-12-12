'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Square } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
}

export function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // コンポーネントのクリーンアップ
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis) {
      alert('お使いのブラウザは音声読み上げ機能に対応していません。');
      return;
    }

    if (isPaused) {
      // 一時停止から再開
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // 新規再生
    window.speechSynthesis.cancel(); // 既存の読み上げをキャンセル

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // パーリ語に近い発音として英語を使用
    utterance.rate = rate;
    utterance.pitch = 0.75;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying && utteranceRef.current) {
      // レートを変更するには再生し直す必要がある
      const currentText = utteranceRef.current.text;
      handleStop();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.lang = 'en-US';
        utterance.rate = newRate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {!isPlaying && !isPaused ? (
              <Button onClick={handlePlay} size="sm">
                <Play className="h-4 w-4 mr-2" />
                再生
              </Button>
            ) : null}
            
            {isPlaying ? (
              <Button onClick={handlePause} size="sm" variant="secondary">
                <Pause className="h-4 w-4 mr-2" />
                一時停止
              </Button>
            ) : null}

            {isPaused ? (
              <Button onClick={handlePlay} size="sm">
                <Play className="h-4 w-4 mr-2" />
                再開
              </Button>
            ) : null}

            {(isPlaying || isPaused) && (
              <Button onClick={handleStop} size="sm" variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                停止
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">速度:</span>
            <div className="flex gap-1">
              {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
                <Button
                  key={speed}
                  size="sm"
                  variant={rate === speed ? 'default' : 'outline'}
                  onClick={() => handleRateChange(speed)}
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

