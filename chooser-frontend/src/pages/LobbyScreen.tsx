import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LobbyScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  //settings from prev screen
  const settings = location.state || {
    playersCount: 3, 
  };

  const [connected, setConnected] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setConnected((prev) => {
        const next = prev + 1;
        if (next >= settings.playersCount) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/game", { state: settings });
          }, 1000);
        }
        return next;
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold mb-4">Ожидание игроков...</h2>
      <p className="text-xl">
        Подключено: <span className="font-bold">{connected}</span> /{" "}
        {settings.playersCount}
      </p>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: settings.playersCount }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full transition ${
              i < connected ? "bg-green-400" : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
