export default function OrientationWarningModal() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md text-center text-black">
          <h2 className="text-2xl font-bold mb-4">Пожалуйста, поверните телефон</h2>
          <p className="text-lg mb-4">Для игры требуется портретная ориентация экрана</p>
          <div className="text-5xl">↻ 📱 ↻</div>
        </div>
      </div>
    );
  }