import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TouchScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const playersCount = state?.playersCount || 3;
  const [activeTouches, setActiveTouches] = useState<boolean[]>(
    new Array(playersCount).fill(false)
  );
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );

  // Количество активных касаний
  const activeCount = activeTouches.filter(Boolean).length;

  useEffect(() => {
    const PORTRAIT_BG_COLOR = "rgb(17, 24, 39)";
    const LANDSCAPE_BG_COLOR = "black";

    const handleOrientationChange = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setIsPortrait(portrait);
      
      // Устанавливаем высоту html для гарантии работы
      document.documentElement.style.height = '100%';
      
      // Применяем стили с !important через setProperty
      document.documentElement.style.setProperty(
        'background-color', 
        portrait ? PORTRAIT_BG_COLOR : LANDSCAPE_BG_COLOR,
        'important'
      );
      
      document.body.style.setProperty(
        'background-color', 
        portrait ? PORTRAIT_BG_COLOR : LANDSCAPE_BG_COLOR,
        'important'
      );
    };

    handleOrientationChange();

    const events = ['orientationchange', 'resize'];
    events.forEach(e => window.addEventListener(e, handleOrientationChange));

    return () => {
      document.documentElement.style.height = '';
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      events.forEach(e => window.removeEventListener(e, handleOrientationChange));
    };
}, []);

  useEffect(() => {
    // Если все игроки касаются своих кружочков
    if (activeCount === playersCount) {
      setShowProgress(true);
      
      // Запускаем таймер прогресса
      let progress = 0;
      setHoldProgress(0);
      holdTimer.current = setInterval(() => {
        progress += 100;
        setHoldProgress(progress);
        
        // Если прошло 2 секунды
        if (progress >= 2000) {
          clearInterval(holdTimer.current!);
          holdTimer.current = null;
          
          if (navigator.vibrate) {
            navigator.vibrate(200); // Вибрация
          }
          
          navigate("/game", { state });
        }
      }, 100);
    } else {
      // Если не все удерживают - сбрасываем прогресс
      setShowProgress(false);
      if (holdTimer.current) {
        clearInterval(holdTimer.current);
        holdTimer.current = null;
      }
      setHoldProgress(0);
    }

    return () => {
      if (holdTimer.current) {
        clearInterval(holdTimer.current);
      }
    };
  }, [activeCount, playersCount]);

  const handleTouchStart = (index: number) => {
    const updatedTouches = [...activeTouches];
    updatedTouches[index] = true;
    setActiveTouches(updatedTouches);

    if (navigator.vibrate) {
      navigator.vibrate(100); // Вибрация при касании
    }
  };

  const handleTouchEnd = (index: number) => {
    const updatedTouches = [...activeTouches];
    updatedTouches[index] = false;
    setActiveTouches(updatedTouches);
  };

  const getProgressPercentage = () => Math.min(holdProgress / 2000, 1) * 100;

  const getTouchPosition = (index: number) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (playersCount === 2) {
      return {
        top: (index === 0 ? height * 0.3 : height * 0.6) - 40,
        left: width * 0.5 - 40,
      };
    }

    if (playersCount === 3) {
      return {
        top: (index === 0 ? height * 0.2 : index === 1 ? height * 0.45 : height * 0.7) - 40,
        left: width * 0.5 - 40,
      };
    }

    if (playersCount === 4) {
      return {
        left: (index === 0 ? width * 0.25 : index === 1 ? width * 0.75 : index === 2 ? width * 0.25 : width * 0.75) - 40,
        top: index < 2 ? height * 0.3 - 40 : height * 0.6 - 40,
      };
    }

    if (playersCount === 5) {
      return {
        left: (index === 0 ? width * 0.3 : index === 1 ? width * 0.7 : index === 2 ? width * 0.2 : index === 3 ? width * 0.8 : width * 0.5) - 40,
        top: index === 2 ? height * 0.5 - 40: index === 3 ? height * 0.5 - 40 : index < 2 ? height * 0.3 - 40 : height * 0.65 - 40,
      };
    }

    return { left: 0, top: 0 };
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      {/* Модальное окно для альбомной ориентации */}
      {!isPortrait && (
        <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex items-center justify-center p-4 text-black">
          <div className="bg-white rounded-lg p-6 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Пожалуйста, поверните телефон</h2>
            <p className="text-lg mb-4">Для игры требуется портретная ориентация экрана</p>
            <div className="text-5xl">↻  📱  ↻</div>
          </div>
        </div>
      )}

      <div className="absolute top-8 w-full px-4 z-30">
        <div className="max-w-lg mx-auto text-center">
          {showProgress ? (
            <div className="w-24 h-24 mx-auto relative">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle
                  className="text-gray-300"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-500"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={Math.PI * 2 * 45}
                  strokeDashoffset={Math.PI * 2 * 45 * (1 - getProgressPercentage() / 100)}
                  r="45"
                  cx="50"
                  cy="50"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {Math.round(getProgressPercentage())}%
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Положите пальцы на экран</h1>
              <p className="text-lg mt-2">
                Ожидание игроков: {activeCount} / {playersCount}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="absolute top-[80px] w-full h-[calc(100vh-80px)] flex justify-center items-center">
        {new Array(playersCount).fill(0).map((_, index) => {
          const position = getTouchPosition(index);
          return (
            <div 
              key={index}
              className="absolute"
              style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
              }}
            >
              {/* Добавляем номер игрока над кружочком */}
              <div 
                className="text-center text-2xl italic font-medium text-yellow-200 mb-0.5"
                style={{ transform: 'translateY(-10px)' }}
              >
                {index + 1}
              </div>
              {/* Сам кружочек */}
              <div
                className={`w-24 h-24 rounded-full transition-all duration-300 ${
                  activeTouches[index] ? "bg-green-500 scale-110" : "bg-gray-300"
                }`}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}