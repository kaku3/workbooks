import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
}

interface Particle {
  id: number;
  left: number;
  angle?: number;
  velocity?: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  type: 'fall' | 'burst';
}

export function Confetti({ active }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0', '#FF9800'];
      const newParticles: Particle[] = [];
      
      // タイプ1: 上からバラバラと降ってくる紙吹雪 (40個)
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          type: 'fall',
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 720
        });
      }
      
      // タイプ2: 下から弾けるように上に飛ぶ紙吹雪 (60個)
      for (let i = 0; i < 60; i++) {
        const spreadAngle = (Math.random() - 0.5) * 80; // -40度から+40度の範囲
        newParticles.push({
          id: 40 + i,
          type: 'burst',
          left: 50 + (Math.random() - 0.5) * 20,
          angle: spreadAngle,
          velocity: 400 + Math.random() * 300,
          delay: Math.random() * 0.15,
          duration: 2 + Math.random() * 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 1080
        });
      }
      
      // 非同期でsetStateを実行してカスケードレンダリングを防ぐ
      const timer = setTimeout(() => {
        setParticles(newParticles);
      }, 0);

      // 4秒後にクリア
      const clearTimer = setTimeout(() => {
        setParticles([]);
      }, 4500);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((particle) => {
        if (particle.type === 'fall') {
          // 上から降ってくるタイプ
          return (
            <div
              key={particle.id}
              className="confetti-particle confetti-fall"
              style={{
                left: `${particle.left}%`,
                '--rotation': `${particle.rotation}deg`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                backgroundColor: particle.color
              } as React.CSSProperties & { '--rotation': string }}
            />
          );
        } else {
          // 下から弾けるタイプ
          const translateX = Math.sin((particle.angle! * Math.PI) / 180) * particle.velocity!;
          
          return (
            <div
              key={particle.id}
              className="confetti-particle confetti-burst"
              style={{
                left: `${particle.left}%`,
                '--translate-x': `${translateX}px`,
                '--initial-velocity': `${particle.velocity}px`,
                '--rotation': `${particle.rotation}deg`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
                backgroundColor: particle.color
              } as React.CSSProperties & { '--translate-x': string; '--initial-velocity': string; '--rotation': string }}
            />
          );
        }
      })}
    </div>
  );
}
