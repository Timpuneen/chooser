import { Routes, Route } from "react-router-dom";
import SettingsScreen from "./pages/SettingsScreen";
import LobbyScreen from "./pages/LobbyScreen";
import GameScreen from "./pages/GameScreen";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Routes>
        <Route path="/" element={<SettingsScreen />} />
        <Route path="/lobby" element={<LobbyScreen />} />
        <Route path="/game" element={<GameScreen />} />
      </Routes>
    </div>
  );
}
