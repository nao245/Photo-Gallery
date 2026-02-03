
import React from 'react';

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children?: React.ReactNode;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onClose, onConfirm, title = "削除の確認", children }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in"
    >
      <div 
        className="relative bg-gray-950 border border-gray-800 rounded-lg shadow-2xl shadow-black/50 w-full max-w-md p-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white text-center mb-4">{title}</h2>
        <div className="text-gray-400 text-center mb-8">
            {children || (
                <p>本当にこの写真を削除しますか？<br/>この操作は元に戻せません。</p>
            )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 active:bg-gray-800 transition-colors duration-200"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
          >
            削除
          </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmDeleteModal;
