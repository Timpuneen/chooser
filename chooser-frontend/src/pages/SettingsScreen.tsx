import { useState } from "react";
import { useNavigate } from "react-router-dom"


export default function SettingsScreen() {
  const [playersCount, setPlayersCount] = useState(2);
  const [eliminationMode, setEliminationMode] = useState(false);
  const [gameType, setGameType] = useState<"simple" | "tasks">("simple");
  const [useAI, setUseAI] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");

  const navigate = useNavigate();

  const startGame = () => {
    console.log("START GAME:", {
      playersCount,
      eliminationMode,
      gameType,
      useAI,
      difficulty,
    });
  
    navigate("/touch", {
      state: {
        playersCount,
        eliminationMode,
        gameType,
        useAI,
        difficulty,
      },
    });
  };
  

  return (
<div className="min-h-safe-screen flex flex-col justify-center max-w-lg mx-auto space-y-8 pt-8 pb-6">
  <h1 className="text-3xl font-bold text-center">Настройки игры</h1>

  <div>
    <label className="block mb-2 font-semibold">Количество игроков</label>
    <div className="flex gap-3">
      {[2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => setPlayersCount(n)}
          className={`flex-1 py-3 rounded-2xl text-xl ${
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
    <label className="block mb-2 font-semibold">Режим игры</label>
    <div className="flex gap-3">
      <button
        onClick={() => setEliminationMode(false)}
        className={`flex-1 py-3 rounded-2xl text-xl ${
          !eliminationMode
            ? "bg-blue-500"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        Без выбывания
      </button>
      <button
        onClick={() => setEliminationMode(true)}
        className={`flex-1 py-3 rounded-2xl text-xl ${
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
    <label className="block mb-2 font-semibold">Тип игры</label>
    <div className="flex gap-3">
      <button
        onClick={() => setGameType("simple")}
        className={`flex-1 py-3 rounded-2xl text-xl ${
          gameType === "simple"
            ? "bg-blue-500"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        Простой
      </button>
      <button
        onClick={() => setGameType("tasks")}
        className={`flex-1 py-3 rounded-2xl text-xl ${
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
    <div className="space-y-5">
      <div>
        <label className="block mb-2 font-semibold">Использовать AI</label>
        <div className="flex gap-3">
          <button
            onClick={() => setUseAI(true)}
            className={`flex-1 py-3 rounded-2xl text-xl ${
              useAI
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            Да
          </button>
          <button
            onClick={() => setUseAI(false)}
            className={`flex-1 py-3 rounded-2xl text-xl ${
              !useAI
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
          >
            Нет
          </button>
        </div>
      </div>
      
      <div>
        <label className="block mb-2 font-semibold">Сложность</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full bg-gray-800 text-white p-3 rounded-2xl text-lg focus:outline-none"
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
    className="w-full bg-green-500 hover:bg-green-600 text-xl py-4 rounded-2xl font-bold"
  >
    Старт
  </button>
</div>

  );
}
