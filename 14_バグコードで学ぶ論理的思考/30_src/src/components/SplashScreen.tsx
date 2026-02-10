import { useState, useEffect } from 'react';

interface SplashScreenProps {
  message?: string;
  isExiting?: boolean;
}

export function SplashScreen({ message = 'Loading...', isExiting = false }: SplashScreenProps) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWidthInsufficient = screenWidth < 1280;

  return (
    <div className={`splash-screen ${isExiting ? 'exiting' : ''}`}>
      {!isWidthInsufficient && (
        <div className={`splash-screen-loader ${isExiting ? 'exiting' : ''}`}>
          <div className="splash-screen-ring"></div>
          <div className="splash-screen-ring"></div>
          <div className="splash-screen-ring"></div>
        </div>
      )}
      <div className="splash-screen-content">
        <div className="splash-screen-logo">
          <h1 className="splash-screen-title">ThinkLab</h1>
          <p className="splash-screen-subtitle">from Buggy Code</p>
          <p className="splash-screen-main-title">バグコードで学ぶ論理的思考</p>
          {message && <p className="splash-screen-message">{message}</p>}
        </div>
        {isWidthInsufficient && (
          <div className="splash-screen-warning">
            <div className="warning-header">
              <div className="warning-icon">⚠️</div>
              <h3>画面幅が不足しています</h3>
            </div>
            <div className="warning-content">
              <p>このアプリケーションを使用するには、画面幅が1280px以上必要です。</p>
              <p className="warning-detail">
                現在の画面幅: <strong>{screenWidth}px</strong>
              </p>
              <p className="warning-suggestion">
                ブラウザウィンドウを広げるか、より大きな画面でアクセスしてください。
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
