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

  // Функция выбора случайного игрока
  const chooseRandomPlayer = async () => {
    if (isChoosing) return;
    setIsChoosing(true);
    setTask(null);
    setSelectedId(null);
  
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    // Получаем активных игроков из текущего состояния
    const activePlayers = players.filter((p) => p.active);
    if (activePlayers.length === 0) {
      setIsChoosing(false);
      return;
    }
  
    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const chosen = activePlayers[randomIndex];
  
    setSelectedId(chosen.id);
  
    // Установка задания (отдельно!)
    if (gameType === "tasks") {
      if (useAI) {
        const fakeTask = `AI-задание (${difficulty})`;
        setTask(fakeTask);
      } else {
        const basicTasks = [
          "Сделай 10 приседаний",
          "Спой песню",
          "Расскажи анекдот",
        ];
        const randomTask =
          basicTasks[Math.floor(Math.random() * basicTasks.length)];
        setTask(randomTask);
      }
    }
  
    // Обновляем список игроков
    if (eliminationMode) {
      setPlayers((prev) =>
        prev.map((p) => (p.id === chosen.id ? { ...p, active: false } : p))
      );
    }
  
    setIsChoosing(false);
  };
  
  // Проверка окончания игры
  useEffect(() => {
    const alive = players.filter((p) => p.active);
    if (alive.length === 1 && eliminationMode) {
      setTimeout(() => {
        alert("Конец игры! Победитель найден.");
        navigate("/");
      }, 1500);
    }
  }, [players]);

  const restartGame = () => {
    navigate("/");
  };

  return (
    <div className="text-center mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Выбор игрока</h2>

      <div className="flex justify-center gap-3 flex-wrap mt-4">
        {players.map((p) => (
          <div
            key={p.id}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition duration-300 ${
              !p.active
                ? "bg-gray-700"
                : selectedId === p.id
                ? "bg-yellow-400 text-black"
                : "bg-green-500"
            }`}
          >
            {p.id + 1}
          </div>
        ))}
      </div>

      {task && (
        <div className="mt-6">
          <p className="text-xl font-semibold">Задание:</p>
          <p className="text-lg mt-2 italic">{task}</p>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          className="bg-blue-500 px-4 py-2 rounded-xl text-white disabled:opacity-50"
          onClick={chooseRandomPlayer}
          disabled={isChoosing || players.filter((p) => p.active).length <= 1}
        >
          Сделать выбор
        </button>

        <button
          className="bg-red-500 px-4 py-2 rounded-xl text-white"
          onClick={restartGame}
        >
          Перезапуск
        </button>
      </div>
    </div>
  );
}
