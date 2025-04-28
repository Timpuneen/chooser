import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaInfoCircle, 
  FaGithub, 
  FaTelegram, 
  FaInstagram,
  FaUsers,
  FaGamepad,
  FaListAlt,
  FaRobot,
  FaBolt,
  FaPlay,
  FaCrown,
  FaStar 
} from "react-icons/fa";

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
      {showOrientationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Пожалуйста, поверните телефон</h2>
            <p className="text-lg mb-4">Для игры требуется портретная ориентация экрана</p>
            <div className="text-5xl">↻ 📱 ↻</div>
          </div>
        </div>
      )}

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
        <div className="fixed inset-0 bg-black bg-opacity-0 z-40 flex items-center justify-center pl-4 pr-4">
          <div className="bg-white rounded-xl p-6 mp-6 max-w-md w-full shadow-lg flex flex-col" style={{ maxHeight: '85vh' }}>
            <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Правила игры
            </h3>
            
            <div className="overflow-y-auto flex-grow pr-2 -mr-2">
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Простой режим:</span> приложение работает как рулетка, которая выбирает случайного игрока
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Режим с заданиями:</span> при каждом "прокруте" игрок должен выполнить выпашее ему задание
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Режим на выбывание:</span> если игрок не выполняет задание, то игрок выбывает. 
                    Когда запущен простом режим с выбыванием, то игрок, который был выбран, выбывает из игры
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Функция AI:</span> задания генерируются при помощи AI вместо базы данных
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg text-gray-800">
                    <span className="font-bold">Дополнительная информация:</span> Игра предназначена для веселых компаний и дружеских посиделок. 
                    Используйте ее, чтобы сделать ваши встречи более интересными!
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <a 
                  href="https://github.com/timpuneen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <FaGithub size={28} />
                </a>
                <a 
                  href="https://t.me/timpuheen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FaTelegram size={28} />
                </a>
                <a 
                  href="https://instagram.com/timpuhin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <FaInstagram size={28} />
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowInfoPopup(false)}
              className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 flex items-center justify-center gap-2"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}