import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameScreen() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const playersCount = state?.playersCount || 3;
  const eliminationMode = state?.eliminationMode || false;
  const gameType = state?.gameType || "simple";
  const useAI = state?.useAI || false;
  const difficulty = state?.difficulty || "normal";

  const [players, setPlayers] = useState(
    Array.from({ length: playersCount }, (_, i) => ({ id: i, active: true }))
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [task, setTask] = useState<string | null>(null);
  const [isChoosing, setIsChoosing] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const PORTRAIT_BG_COLOR = "rgb(17, 24, 39)";
    const LANDSCAPE_BG_COLOR = "black";

    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileCheck = /iphone|ipod|android|windows phone|mobile/i.test(userAgent);
      setIsMobile(isMobileCheck);
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

  const getTouchPosition = (index: number) => {
    const width = windowSize.width;
    const height = windowSize.height;
    const circleSize = 80;

    switch (playersCount) {
      case 2:
        return {
          top: height * (index === 0 ? 0.3 : 0.6) - circleSize / 2,
          left: width * 0.5 - circleSize / 2,
        };
      case 3:
        return {
          top: height * (index === 0 ? 0.2 : index === 1 ? 0.45 : 0.7) - circleSize / 2,
          left: width * 0.5 - circleSize / 2,
        };
      case 4:
        const isWideScreen = width / height > 1.5;
        const baseSpacing = Math.min(width, height) * 0.3;
        const maxSpacing = isWideScreen ? width * 0.25 : baseSpacing;
        const spacing = Math.min(baseSpacing, maxSpacing);
        const col4 = index % 2;
        const row4 = Math.floor(index / 2);
        return {
          left: width * 0.5 + (col4 ? spacing : -spacing) - circleSize / 2,
          top: height * 0.5 + (row4 ? spacing * 0.9 : -spacing * 0.9) - circleSize / 2,
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
              top: height * 0.52 - spacing5 * 1.8 - circleSize / 2,
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
                top: height * 0.7 - circleSize / 2,  // Нижний уровень
              };
            }
          }
    }
  };

  const chooseRandomPlayer = async () => {
    if (isChoosing) return;
    setIsChoosing(true);
    setTask(null);
    setSelectedId(null);

    // Анимация случайного подсвечивания
    const activePlayers = players.filter((p) => p.active);
    if (activePlayers.length === 0) {
      setIsChoosing(false);
      return;
    }

    // Количество "промежуточных" подсвечиваний
    const iterations = 10;
    const delay = 200; // Задержка между сменой подсветки

    for (let i = 0; i < iterations; i++) {
      const randomIndex = Math.floor(Math.random() * activePlayers.length);
      const tempSelected = activePlayers[randomIndex].id;
      setSelectedId(tempSelected);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Финальный выбор
    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const chosen = activePlayers[randomIndex];
    setSelectedId(chosen.id);

    // Вибрация при выборе
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Получение задания (если нужно)
    if (gameType === "tasks") {
      if (useAI) {
        try {
          const response = await fetch(
            `http://192.168.1.50:8000/task/ai?difficulty=${difficulty}`
          );
          if (!response.ok) throw new Error("Ошибка AI");
          const data = await response.json();
          setTask(data.task);
        } catch {
          setTask("AI не смог придумать задание 🤖");
        }
      } else {
        try {
          const response = await fetch(
            `http://192.168.1.50:8000/task/random?difficulty=${difficulty}`
          );
          if (!response.ok) throw new Error("Ошибка запроса");
          const data = await response.json();
          setTask(data.text);
        } catch (error) {
          setTask("Не удалось получить задание 😢");
        }
      }
    }

    if (eliminationMode) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === chosen.id ? { ...p, active: false } : p))
      );
    }

    setIsChoosing(false);
  };

  useEffect(() => {
    const alive = players.filter((p) => p.active);
    if (alive.length === 1 && eliminationMode) {
      setTimeout(() => {
        alert("Конец игры! Победитель найден.");
        navigate("/");
      }, 1500);
    }
  }, [players, eliminationMode, navigate]);

  const restartGame = () => {
    navigate("/");
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

      {/* Заголовок с увеличенным отступом сверху */}
      <div className="absolute top-10 w-full px-4 z-30">  {/* Изменено с top-8 на top-16 */}
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold">Выбор игрока</h2>
          {task && (
            <div className="mt-2">
              <p className="text-xl font-semibold">Задание:</p>
              <p className="text-lg italic">{task}</p>
            </div>
          )}
        </div>
      </div>

      {/* Кружочки с уменьшенным отступом сверху */}
      <div className="absolute w-full h-[calc(100vh-200px)] flex justify-center items-center">
        {players.map((p) => {
          const position = getTouchPosition(p.id);
          return (
            <div
              key={p.id}
              className="absolute transition-all duration-300"
              style={{
                left: `${position?.left ?? 0}px`,
                top: `${position?.top ?? 0}px`,
              }}
            >
              <div
                className="text-center text-2xl italic font-medium text-yellow-200 mb-0.5"
                style={{ transform: "translateY(-10px)" }}
              >
                {p.id + 1}
              </div>
              <div
                className={`w-24 h-24 rounded-full transition-all duration-200 ${
                  !p.active
                    ? "bg-gray-700"
                    : selectedId === p.id
                    ? "bg-yellow-400 scale-110" // Добавляем scale-110 для увеличения
                    : "bg-white"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Кнопки с увеличенным отступом снизу */}
      <div className="absolute bottom-8 w-full px-4 z-30">  {/* Изменено с bottom-4 на bottom-8 */}
        <div className="max-w-lg mx-auto flex justify-center gap-4">
          <button
            className="bg-blue-500 px-6 py-3 rounded-xl text-white disabled:opacity-50 text-lg" 
            onClick={chooseRandomPlayer}
            disabled={isChoosing || players.filter((p) => p.active).length <= 1}
          >
            Сделать выбор
          </button>
          <button
            className="bg-red-500 px-6 py-3 rounded-xl text-white text-lg"  
            onClick={restartGame}
          >
            Перезапуск
          </button>
        </div>
      </div>
    </div>
  );
}