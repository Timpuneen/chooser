import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type TouchData = {
  id: number;
  playerIndex: number;
};

export default function TouchScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const playersCount = state?.playersCount || 3;
  const [activeTouches, setActiveTouches] = useState<boolean[]>(
    new Array(playersCount).fill(false)
  );
  const touchesMap = useRef<Map<number, TouchData>>(new Map());
  const holdTimer = useRef<NodeJS.Timeout | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Количество активных касаний
  const activeCount = activeTouches.filter(Boolean).length;

  useEffect(() => {
    const PORTRAIT_BG_COLOR = "rgb(17, 24, 39)";
    const LANDSCAPE_BG_COLOR = "black";

    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipod|android|windows phone|mobile/i.test(userAgent));
    };

    const handleOrientationChange = () => {
      const portrait = window.matchMedia("(orientation: portrait)").matches;
      setIsPortrait(portrait);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      if (isMobile) {
        document.documentElement.style.height = '100%';
        document.documentElement.style.backgroundColor = portrait 
          ? PORTRAIT_BG_COLOR 
          : LANDSCAPE_BG_COLOR;
        document.body.style.backgroundColor = portrait 
          ? PORTRAIT_BG_COLOR 
          : LANDSCAPE_BG_COLOR;
      }
    };

    checkIfMobile();
    handleOrientationChange();

    const events = ['orientationchange', 'resize'];
    events.forEach(e => window.addEventListener(e, handleOrientationChange));

    return () => {
      if (isMobile) {
        document.documentElement.style.height = '';
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
      }
      events.forEach(e => window.removeEventListener(e, handleOrientationChange));
    };
  }, [isMobile]);

  useEffect(() => {
    if (activeCount === playersCount) {
      setShowProgress(true);
      let progress = 0;
      setHoldProgress(0);
      
      holdTimer.current = setInterval(() => {
        progress += 100;
        setHoldProgress(progress);

        if (progress >= 2000) {
          clearInterval(holdTimer.current!);
          holdTimer.current = null;

          if (navigator.vibrate) navigator.vibrate(200);
          navigate("/game", { state });
        }
      }, 100);
    } else {
      setShowProgress(false);
      if (holdTimer.current) {
        clearInterval(holdTimer.current);
        holdTimer.current = null;
      }
      setHoldProgress(0);
    }

    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, [activeCount, playersCount, navigate, state]);

  useEffect(() => {
    const handleDocumentTouchStart = (e: TouchEvent) => {
      
      // Получаем все активные касания
      const allTouches = Array.from(e.touches);
      
      // Сбрасываем все текущие касания
      setActiveTouches(new Array(playersCount).fill(false));
      
      // Временный массив для новых активных касаний
      const newActiveTouches = new Array(playersCount).fill(false);
      
      // Проверяем все активные касания
      allTouches.forEach((touch) => {
        const element = document.elementFromPoint(
          touch.clientX, 
          touch.clientY
        ) as HTMLElement | null;
    
        if (element?.closest('.player-touch-area')) {
          const playerIndex = parseInt(
            element.closest('.player-touch-area')?.getAttribute('data-player-index') || '0', 
            10
          );
          
          // Обновляем временный массив
          newActiveTouches[playerIndex] = true;
          
          // Обновляем карту касаний
          touchesMap.current.set(touch.identifier, {
            id: touch.identifier,
            playerIndex
          });
        }
      });
      
      // Применяем все изменения сразу
      setActiveTouches(newActiveTouches);
      
      // Вибрация только при новом касании
      if (e.changedTouches.length > 0 && navigator.vibrate) {
        navigator.vibrate(30);
      }
    };
    
    const handleDocumentTouchEnd = (e: TouchEvent) => {
      // Получаем все еще активные касания
      const remainingTouches = new Set<number>();
      Array.from(e.touches).forEach(t => remainingTouches.add(t.identifier));
      
      // Сбрасываем все текущие касания
      setActiveTouches(new Array(playersCount).fill(false));
      
      // Временный массив для новых активных касаний
      const newActiveTouches = new Array(playersCount).fill(false);
      
      // Обновляем карту касаний и собираем активные
      touchesMap.current.forEach((touchData, identifier) => {
        if (remainingTouches.has(identifier)) {
          newActiveTouches[touchData.playerIndex] = true;
        } else {
          touchesMap.current.delete(identifier);
        }
      });
      
      // Проверяем новые завершенные касания
      Array.from(e.changedTouches).forEach((touch) => {
        const element = document.elementFromPoint(
          touch.clientX, 
          touch.clientY
        ) as HTMLElement | null;
    
        if (element?.closest('.player-touch-area')) {
          const playerIndex = parseInt(
            element.closest('.player-touch-area')?.getAttribute('data-player-index') || '0', 
            10
          );
          newActiveTouches[playerIndex] = false;
        }
      });
      
      setActiveTouches(newActiveTouches);
    };

    document.addEventListener('touchstart', handleDocumentTouchStart);
    document.addEventListener('touchend', handleDocumentTouchEnd);
    document.addEventListener('touchcancel', handleDocumentTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleDocumentTouchStart);
      document.removeEventListener('touchend', handleDocumentTouchEnd);
      document.removeEventListener('touchcancel', handleDocumentTouchEnd);
    };
  }, []);

  const getProgressPercentage = () => Math.min(holdProgress / 2000, 1) * 100;

  const getTouchPosition = (index: number) => {
    const width = windowSize.width;
    const height = windowSize.height;
    const circleSize = 80;

    switch (playersCount) {
      case 2:
        return {
          top: height * (index === 0 ? 0.3 : 0.6) - circleSize/2,
          left: width * 0.5 - circleSize/2,
        };
      case 3:
        return {
          top: height * (index === 0 ? 0.2 : index === 1 ? 0.45 : 0.7) - circleSize/2,
          left: width * 0.5 - circleSize/2,
        };
      case 4:
        const isWideScreen = width / height > 1.5;
        const baseSpacing = Math.min(width, height) * 0.3;
        const maxSpacing = isWideScreen ? width * 0.25 : baseSpacing;
        const spacing = Math.min(baseSpacing, maxSpacing);
        const col4 = index % 2;
        const row4 = Math.floor(index / 2);
        
        return {
          left: width * 0.5 + (col4 ? spacing : -spacing) - circleSize/2,
          top: height * 0.5 + (row4 ? spacing * 0.9 : -spacing * 0.9) - circleSize/2,
        };
        case 5:
          const isWideScreen5 = width / height > 1.5;
          const baseSpacing5 = Math.min(width, height) * 0.3;
          const maxSpacing5 = isWideScreen5 ? width * 0.25 : baseSpacing5;
          const spacing5 = Math.min(baseSpacing5, maxSpacing5);
        
          if (index === 0) {
            // Центральный верхний кружок
            return {
              left: width * 0.5 - circleSize / 2,
              top: height * 0.46 - spacing5 * 1.8 - circleSize / 2,
            };
          } else {
            // Остальные кружки по сторонам
            const col5 = (index - 1) % 2;
            const row5 = Math.floor((index - 1) / 2);
        
            if (row5 === 0) {
              // Центральные кружки
              return {
                left: width * 0.5 + (col5 ? spacing5 : -spacing5) - circleSize / 2,
                top: height * 0.45 - circleSize / 2,
              };
            } else {
              // Нижние кружки (уменьшаем горизонтальное расстояние для нижних двух)
              const reducedSpacing = spacing5 * 0.75;  // Уменьшаем горизонтальное расстояние для нижних кружков
        
              return {
                left: width * 0.5 + (col5 ? reducedSpacing : -reducedSpacing) - circleSize / 2,
                top: height * 0.75 - circleSize / 2,  // Нижний уровень
              };
            }
          }
      default:
        return { left: 0, top: 0 };
    }
  };

  const showOrientationWarning = !isPortrait && isMobile;

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      {showOrientationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Пожалуйста, поверните телефон</h2>
            <p className="text-lg mb-4">Для игры требуется портретная ориентация экрана</p>
            <div className="text-5xl">↻ 📱 ↻</div>
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
              <div
                className="text-center text-2xl italic font-medium text-yellow-200 mb-0.5"
                style={{ transform: 'translateY(-10px)' }}
              >
                {index + 1}
              </div>
              <div
                className={`w-24 h-24 rounded-full transition-all duration-300 player-touch-area ${
                  activeTouches[index] ? "bg-green-500 scale-110" : "bg-gray-300"
                }`}
                data-player-index={index}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}