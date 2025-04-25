import { useState } from "react";

export default function SettingsScreen() {
  const [playersCount, setPlayersCount] = useState(2);
  const [eliminationMode, setEliminationMode] = useState(false);
  const [gameType, setGameType] = useState<"simple" | "tasks">("simple");
  const [useAI, setUseAI] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");

  const startGame = () => {
    console.log("START GAME:", {
      playersCount,
      eliminationMode,
      gameType,
      useAI,
      difficulty,
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Настройки игры</h1>

      <div>
        <label className="block mb-1 font-medium">Количество игроков</label>
        <div className="flex gap-2">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setPlayersCount(n)}
              className={`flex-1 py-2 rounded-xl text-lg ${
                playersCount === n
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Режим игры</label>
        <div className="flex gap-2">
          <button
            onClick={() => setEliminationMode(false)}
            className={`flex-1 py-2 rounded-xl text-lg ${
              !eliminationMode
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Без выбывания
          </button>
          <button
            onClick={() => setEliminationMode(true)}
            className={`flex-1 py-2 rounded-xl text-lg ${
              eliminationMode
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            На выбывание
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Тип игры</label>
        <div className="flex gap-2">
          <button
            onClick={() => setGameType("simple")}
            className={`flex-1 py-2 rounded-xl text-lg ${
              gameType === "simple"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Простой
          </button>
          <button
            onClick={() => setGameType("tasks")}
            className={`flex-1 py-2 rounded-xl text-lg ${
              gameType === "tasks"
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            С заданиями
          </button>
        </div>
      </div>

      {gameType === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              id="useAI"
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            <label htmlFor="useAI">Использовать AI</label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Сложность</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-800 text-white p-2 rounded-xl"
            >
              <option value="easy">Лёгкая</option>
              <option value="normal">Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </div>
        </div>
      )}

      <button
        onClick={startGame}
        className="w-full bg-green-500 hover:bg-green-600 text-lg py-3 rounded-2xl font-bold"
      >
        Старт
      </button>
    </div>
  );
}
