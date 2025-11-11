/**
 * ViewModeSelector.tsx - View Mode Toggle
 *
 * Allows switching between Debug, PC, and NPC perspectives
 */

export type ViewMode = 'debug' | 'pc' | 'npc';

interface ViewModeSelectorProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

export function ViewModeSelector({ currentMode, onModeChange }: ViewModeSelectorProps) {
  const modes: { id: ViewMode; label: string; key: string; color: string }[] = [
    { id: 'debug', label: 'Debug', key: '1', color: 'yellow' },
    { id: 'pc', label: 'PC View', key: '2', color: 'blue' },
    { id: 'npc', label: 'NPC View', key: '3', color: 'red' },
  ];

  return (
    <div className="flex gap-2 items-center">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;

        // Color classes based on mode
        let colorClasses = '';
        if (mode.color === 'yellow') {
          colorClasses = isActive
            ? 'bg-yellow-600 text-white border-yellow-500'
            : 'bg-gray-700 text-yellow-400 border-yellow-600/30 hover:bg-yellow-900/30';
        } else if (mode.color === 'blue') {
          colorClasses = isActive
            ? 'bg-blue-600 text-white border-blue-500'
            : 'bg-gray-700 text-blue-400 border-blue-600/30 hover:bg-blue-900/30';
        } else if (mode.color === 'red') {
          colorClasses = isActive
            ? 'bg-red-600 text-white border-red-500'
            : 'bg-gray-700 text-red-400 border-red-600/30 hover:bg-red-900/30';
        }

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`px-3 py-1.5 rounded text-sm font-semibold border-2 transition-all ${colorClasses}`}
          >
            {mode.label}
            <span className="ml-1.5 text-xs opacity-60">({mode.key})</span>
          </button>
        );
      })}
    </div>
  );
}
