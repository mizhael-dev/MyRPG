interface LineSelectionModalProps {
  isOpen: boolean;
  onSelectLine: (line: 'high' | 'horizontal' | 'center' | 'low' | 'diagonal') => void;
  onCancel: () => void;
  likelyLines?: string[]; // Highlighted based on telegraphs
}

export function LineSelectionModal({ isOpen, onSelectLine, onCancel, likelyLines = [] }: LineSelectionModalProps) {
  if (!isOpen) return null;

  const lines = [
    { id: 'high' as const, label: 'High', icon: '⬆️', description: 'Overhead attacks' },
    { id: 'horizontal' as const, label: 'Horizontal', icon: '➡️', description: 'Side slashes' },
    { id: 'center' as const, label: 'Center', icon: '🎯', description: 'Thrusts' },
    { id: 'low' as const, label: 'Low', icon: '⬇️', description: 'Rising attacks' },
    { id: 'diagonal' as const, label: 'Diagonal', icon: '↘️', description: 'Angled cuts' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" onClick={onCancel}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Select Parry Line</h2>

        <div className="space-y-2 mb-4">
          {lines.map((line) => {
            const isLikely = likelyLines.includes(line.id);
            return (
              <button
                key={line.id}
                onClick={() => onSelectLine(line.id)}
                className={`w-full p-3 rounded text-left transition-colors ${
                  isLikely
                    ? 'bg-green-600 hover:bg-green-700 border-2 border-yellow-400'
                    : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
              >
                <span className="text-2xl mr-3">{line.icon}</span>
                <span className="font-bold">{line.label}</span>
                {isLikely && <span className="ml-2 text-yellow-400">⭐ Likely</span>}
                <div className="text-sm text-gray-300 ml-10">{line.description}</div>
              </button>
            );
          })}
        </div>

        <button onClick={onCancel} className="w-full p-2 bg-gray-600 hover:bg-gray-500 rounded text-white">
          Cancel
        </button>
      </div>
    </div>
  );
}
