import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/components.css'
import App from './App.tsx'

// スプラッシュスクリーンを削除する関数
function removeSplashScreen() {
  const splash = document.getElementById('splash-screen')
  if (splash) {
    // 弾け飛ぶエフェクトを追加
    splash.classList.add('explode')
    
    // エフェクト完了後にフェードアウト
    setTimeout(() => {
      splash.classList.add('fade-out')
      
      // フェードアウト完了後に要素を削除
      setTimeout(() => {
        splash.remove()
      }, 500)
    }, 600)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// React のレンダリング完了後、少し待ってからスプラッシュスクリーンを削除
setTimeout(removeSplashScreen, 800)
