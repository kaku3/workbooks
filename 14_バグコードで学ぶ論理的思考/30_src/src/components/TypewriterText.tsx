import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ミリ秒単位（オプション、指定されない場合は自動計算）
}

export function TypewriterText({ text, speed }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 文字数に応じて速度を自動計算
  const calculatedSpeed = speed || (() => {
    const length = text.length;
    if (length < 50) return 30;        // 短い: ゆっくり
    if (length < 100) return 20;       // 中くらい: 標準
    if (length < 200) return 15;       // 長い: 速め
    if (length < 500) return 10;       // かなり長い: 速い
    if (length < 1000) return 5;       // とても長い: とても速い
    return 3;                          // 超長文: 超高速
  })();

  useEffect(() => {
    // テキストが変わったらリセット
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, calculatedSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, calculatedSpeed]);

  return <Markdown>{displayedText}</Markdown>;
}
