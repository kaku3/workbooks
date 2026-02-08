interface SplashScreenProps {
  message?: string;
}

export function SplashScreen({ message = 'Loading...' }: SplashScreenProps) {
  return (
    <div className="splash-screen">
      <div className="splash-screen-loader">
        <div className="splash-screen-ring"></div>
        <div className="splash-screen-ring"></div>
        <div className="splash-screen-ring"></div>
      </div>
      <div className="splash-screen-content">
        <div className="splash-screen-logo">
          <h1 className="splash-screen-title">ThinkLab</h1>
          <p className="splash-screen-subtitle">from Buggy Code</p>
          {message && <p className="splash-screen-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
