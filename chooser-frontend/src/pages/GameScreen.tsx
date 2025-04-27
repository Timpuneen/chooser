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
  const [showTaskPopup, setShowTaskPopup] = useState(false);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [showWinnerPopup, setShowWinnerPopup] = useState(false);

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
          return {
            left: width * 0.5 - circleSize / 2,
            top: height * 0.52 - spacing5 * 1.8 - circleSize / 2,
          };
        } else {
          const col5 = (index - 1) % 2;
          const row5 = Math.floor((index - 1) / 2);
      
          if (row5 === 0) {
            return {
              left: width * 0.5 + (col5 ? spacing5 : -spacing5) - circleSize / 2,
              top: height * 0.45 - circleSize / 2,
            };
          } else {
            const reducedSpacing = spacing5 * 0.75;
            return {
              left: width * 0.5 + (col5 ? reducedSpacing : -reducedSpacing) - circleSize / 2,
              top: height * 0.7 - circleSize / 2,
            };
          }
        }
      default:
        return { top: 0, left: 0 };
    }
  };

  const chooseRandomPlayer = async () => {
    if (isChoosing) return;
    setIsChoosing(true);
    setTask(null);
    setSelectedId(null);

    const activePlayers = players.filter((p) => p.active);
    if (activePlayers.length === 0) {
      setIsChoosing(false);
      return;
    }

    const iterations = 10;
    const delay = 200;

    for (let i = 0; i < iterations; i++) {
      const randomIndex = Math.floor(Math.random() * activePlayers.length);
      const tempSelected = activePlayers[randomIndex].id;
      setSelectedId(tempSelected);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const chosen = activePlayers[randomIndex];
    setSelectedId(chosen.id);

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    if (gameType === "tasks") {
      try {
        const response = await fetch(
          `http://192.168.1.50:8000/task/${useAI ? "ai" : "random"}?difficulty=${difficulty}`
        );
        if (!response.ok) throw new Error("Ошибка запроса");
        const data = await response.json();
        setTask(useAI ? data.task : data.text);
        setShowTaskPopup(true);
      } catch {
        setTask("Не удалось получить задание 😢");
        setShowTaskPopup(true);
      }
    } else if (eliminationMode) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === chosen.id ? { ...p, active: false } : p))
      );
    }

    setIsChoosing(false);
  };

  const handleTaskCompletion = (completed: boolean) => {
    if (!completed && selectedId !== null && eliminationMode) {
      setPlayers(prev =>
        prev.map(p => p.id === selectedId ? { ...p, active: false } : p)
      );
    }
    setShowTaskPopup(false);
  };

  useEffect(() => {
    const alive = players.filter((p) => p.active);
    if (alive.length === 1 && eliminationMode) {
      setWinnerId(alive[0].id);
      setShowWinnerPopup(true);
    }
  }, [players, eliminationMode]);

  const restartGame = () => {
    navigate("/");
  };

  const closeWinnerPopup = () => {
    setShowWinnerPopup(false);
    navigate("/");
  };

  const showOrientationWarning = !isPortrait && isMobile;

  return (
    <div className="fixed inset-0 overflow-hidden select-none">
      {/* Основной контент игры */}
      <div className="relative h-full w-full">
        {/* Заголовок */}
        <div className="absolute top-10 w-full px-4 z-20">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold text-white">Выбор игрока</h2>
          </div>
        </div>

        {/* Кружочки игроков */}
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
                      ? "bg-yellow-400 scale-110"
                      : "bg-white"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Кнопки управления */}
        <div className="absolute bottom-8 w-full px-4 z-20">
          <div className="max-w-lg mx-auto flex justify-center gap-4">
            <button
              className="bg-blue-700 px-6 py-3 rounded-xl text-white disabled:opacity-50 text-lg hover:bg-blue-600 transition-colors"
              onClick={chooseRandomPlayer}
              disabled={isChoosing || players.filter((p) => p.active).length <= 1}
            >
              Сделать выбор
            </button>
            <button
              className="bg-yellow-700 px-6 py-3 rounded-xl text-white text-lg hover:bg-yellow-600 transition-colors"
              onClick={restartGame}
            >
              Перезапуск
            </button>
          </div>
        </div>

        {/* Попап с заданием (z-30) */}
        {showTaskPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-30 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800">
                Задание для игрока {selectedId !== null ? selectedId + 1 : ""}
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-lg text-center italic text-gray-800">{task}</p>
              </div>

              {eliminationMode ? (
                <div className="space-y-3">
                  <p className="text-gray-600 text-center font-medium">Игрок выполнил задание?</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleTaskCompletion(true)}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg flex-1 hover:bg-green-600 transition-colors"
                    >
                      Да
                    </button>
                    <button
                      onClick={() => handleTaskCompletion(false)}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg flex-1 hover:bg-red-600 transition-colors"
                    >
                      Нет
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowTaskPopup(false)}
                  className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Далее
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Попап победителя (z-50) */}
      {showWinnerPopup && winnerId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-40 p-4">
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-8 max-w-md w-full shadow-2xl text-center">
            <h2 className="text-4xl font-bold text-white mb-6">🎉 Победа! 🎉</h2>
            <div className="bg-white rounded-lg p-6 mb-8">
              <p className="text-3xl font-bold text-gray-800">Игрок {winnerId + 1}</p>
              <p className="text-xl mt-2 text-gray-600">становится победителем!</p>
            </div>
            <button
              onClick={closeWinnerPopup}
              className="bg-white text-yellow-700 font-bold px-8 py-3 rounded-lg text-lg hover:bg-gray-100 transition-colors"
            >
              Новая игра
            </button>
          </div>
        </div>
      )}

      {/* Предупреждение о повороте (z-40) */}
      {showOrientationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Пожалуйста, поверните телефон</h2>
            <p className="text-lg mb-4">Для игры требуется портретная ориентация экрана</p>
            <div className="text-5xl">↻ 📱 ↻</div>
          </div>
        </div>
      )}
    </div>
  );
}