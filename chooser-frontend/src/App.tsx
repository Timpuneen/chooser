import { Routes, Route } from "react-router-dom";
import { useEffect} from "react";
import SettingsScreen from "./pages/SettingsScreen";
import LobbyScreen from "./pages/LobbyScreen";
import GameScreen from "./pages/GameScreen";
import TouchScreen from "./pages/TouchScreen";

export default function App() {
  useEffect(() => {
    const updateRootHeight = () => {
      const mainContent = document.querySelector("body");
        if (mainContent) {
        (mainContent as HTMLElement).scrollTo(0, 0);
      }
    };
    
    window.addEventListener('orientationchange', updateRootHeight);
    return () => {
      window.removeEventListener('orientationchange', updateRootHeight);
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4">
      <Routes>
        <Route path="/" element={<SettingsScreen />} />
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/touch" element={<TouchScreen />} />
      </Routes>
    </div>
  );
}
