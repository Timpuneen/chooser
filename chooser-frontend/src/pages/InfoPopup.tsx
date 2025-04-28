import { FaGithub, FaTelegram, FaInstagram } from "react-icons/fa";

interface InfoPopupProps {
  onClose: () => void;
}

export default function InfoPopup({ onClose }: InfoPopupProps) {
  return (
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
          onClick={onClose}
          className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors mt-4 flex items-center justify-center gap-2"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}