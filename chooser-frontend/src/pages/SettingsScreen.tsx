import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaInfoCircle, 
  FaUsers,
  FaGamepad,
  FaListAlt,
  FaRobot,
  FaBolt,
  FaPlay,
  FaCrown,
  FaStar 
} from "react-icons/fa";
import InfoPopup from "./InfoPopup";
import OrientationWarningModal from "./OrientationWarningModal";

export default function SettingsScreen() {
  const [playersCount, setPlayersCount] = useState(2);
  const [eliminationMode, setEliminationMode] = useState(false);
  const [gameType, setGameType] = useState<"simple" | "tasks">("simple");
  const [useAI, setUseAI] = useState(false);
  const [difficulty, setDifficulty] = useState("normal");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();

  const toggleBodyOverflow = (hidden: boolean) => {
    if (hidden) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  };

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
      if (!portrait && isMobile) {
        toggleBodyOverflow(true);
      } else {
        toggleBodyOverflow(false);
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
      toggleBodyOverflow(false);
    };
  }, [isMobile]);

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

  const showOrientationWarning = !isPortrait && isMobile;

  useEffect(() => {
    if (showOrientationWarning) {
      toggleBodyOverflow(true);
    } else {
      toggleBodyOverflow(false);
    }
  }, [showOrientationWarning]);

  return (
    <div className="min-h-safe-screen flex flex-col justify-center max-w-lg mx-auto space-y-8 pt-8 pb-6 ">
      {showOrientationWarning && <OrientationWarningModal />}

      <h1 className="text-3xl font-bold text-center">Настройки игры</h1>

      <div>
        <label className="block mb-2 font-semibold flex items-center gap-2">
          <FaUsers size={20} />
          Количество игроков
        </label>
        <div className="flex gap-3">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setPlayersCount(n)}
              className={`flex-1 py-3 rounded-2xl text-xl ${
                playersCount === n
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-2 font-semibold flex items-center gap-2">
          <FaGamepad size={20} />
          Режим игры
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setEliminationMode(false)}
            className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
              !eliminationMode
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {!eliminationMode && <FaBolt className="text-yellow-300" />}
            Без выбывания
          </button>
          <button
            onClick={() => setEliminationMode(true)}
            className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
              eliminationMode
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {eliminationMode && <FaCrown className="text-yellow-300" />}
            На выбывание
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-2 font-semibold flex items-center gap-2">
          <FaListAlt size={20} />
          Тип игры
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setGameType("simple")}
            className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
              gameType === "simple"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {gameType === "simple" && <FaBolt className="text-yellow-300" />}
            Простой
          </button>
          <button
            onClick={() => setGameType("tasks")}
            className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
              gameType === "tasks"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {gameType === "tasks" && <FaListAlt className="text-yellow-300" />}
            С заданиями
          </button>
        </div>
      </div>

      {gameType === "tasks" && (
        <div className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold flex items-center gap-2">
              <FaRobot size={20} />
              Использовать AI
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setUseAI(true)}
                className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
                  useAI
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                {useAI && <FaRobot className="text-yellow-300" />}
                Да
              </button>
              <button
                onClick={() => setUseAI(false)}
                className={`flex-1 py-3 rounded-2xl text-xl flex items-center justify-center gap-2 ${
                  !useAI
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                {!useAI && <FaRobot className="text-red-300" />}
                Нет
              </button>
            </div>
          </div>
          
          <div>
            <label className="block mb-2 font-semibold flex items-center gap-2">
              <FaStar size={20} />
              Сложность
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-gray-800 text-white p-3 rounded-2xl text-lg focus:outline-none appearance-none"
            >
              <option value="easy">Лёгкая</option>
              <option value="normal">Средняя</option>
              <option value="hard">Сложная</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          className="bg-gray-500 p-3 rounded-full text-white transition-colors hover:bg-gray-600"
          onClick={() => setShowInfoPopup(true)}
          title="Информация об игре"
        >
          <FaInfoCircle size={24} />
        </button>
        
        <button
          onClick={startGame}
          className="flex-1 bg-green-500 hover:bg-green-600 text-xl py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <FaPlay />
          Старт
        </button>
      </div>

      {showInfoPopup && (
        <InfoPopup onClose={() => setShowInfoPopup(false)} />
      )}
    </div>
  );
}