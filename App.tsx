import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameState, ShapeType } from './types';
import { LEVELS, SHAPE_STATS } from './constants';
import { audioService } from './services/audioService';
import { Volume2, VolumeX, RefreshCw, Play, ArrowRight, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentShape, setCurrentShape] = useState<ShapeType>(ShapeType.SQUARE);
  const [isMuted, setIsMuted] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  const handleStart = () => {
    audioService.playMorph(); // Just a sound to init audio context
    setGameState(GameState.PLAYING);
  };

  const handleDie = () => {
    audioService.playDie();
    setGameState(GameState.GAME_OVER);
  };

  const handleWin = () => {
    audioService.playWin();
    if (currentLevelId >= LEVELS.length) {
        setGameState(GameState.VICTORY);
    } else {
        setGameState(GameState.LEVEL_COMPLETE);
    }
  };

  const handleNextLevel = () => {
    setCurrentLevelId(prev => prev + 1);
    setGameState(GameState.PLAYING);
  };

  const handleRestart = () => {
    setGameKey(prev => prev + 1);
    setGameState(GameState.PLAYING);
    // Force re-render of canvas logic implicitly via key change or just state update
  };

  const handleRestartGame = () => {
    setCurrentLevelId(1);
    setGameKey(0);
    setGameState(GameState.MENU);
  };

  const toggleMute = () => {
    audioService.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            ShapeShifter
          </h1>
          <p className="text-xs text-slate-500">Level {currentLevelId}: {currentLevel.name}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
             <span className="text-xs uppercase text-slate-400">Current Form:</span>
             <span style={{ color: SHAPE_STATS[currentShape].color }} className="font-bold">
               {SHAPE_STATS[currentShape].label}
             </span>
          </div>
          <button 
            onClick={toggleMute} 
            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      {/* Game Container */}
      <div className="relative">
        <GameCanvas 
          key={`${currentLevelId}-${gameKey}`} // Reset physics/state on restart or level change
          level={currentLevel}
          gameState={gameState}
          onDie={handleDie}
          onWin={handleWin}
          onShapeChange={setCurrentShape}
        />

        {/* Overlays */}
        {gameState === GameState.MENU && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10">
            <h2 className="text-6xl font-bold text-white mb-4">ShapeShifter</h2>
            <div className="flex gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-500 rounded-sm animate-pulse"></div>
              <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[48px] border-b-red-500 animate-bounce"></div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-slate-300 mb-8 max-w-md text-center">
              Use <span className="font-bold text-white">Arrow Keys</span> to move and jump. 
              Find morph zones to change shape and pass the specific exit gate.
            </p>
            <button 
              onClick={handleStart}
              className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition transform hover:scale-105"
            >
              <Play size={24} /> START GAME
            </button>
          </div>
        )}

        {gameState === GameState.GAME_OVER && (
          <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10">
            <h2 className="text-5xl font-bold text-red-500 mb-2">GAME OVER</h2>
            <p className="text-red-200 mb-8">The spikes were too sharp.</p>
            <button 
              onClick={handleRestart}
              className="flex items-center gap-2 px-6 py-3 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-200 transition"
            >
              <RefreshCw size={20} /> TRY AGAIN
            </button>
          </div>
        )}

        {gameState === GameState.LEVEL_COMPLETE && (
          <div className="absolute inset-0 bg-green-950/90 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm z-10">
            <h2 className="text-5xl font-bold text-green-400 mb-2">CLEARED!</h2>
            <p className="text-green-200 mb-8">Form matched successfully.</p>
            <button 
              onClick={handleNextLevel}
              className="flex items-center gap-2 px-6 py-3 bg-white text-green-900 font-bold rounded-lg hover:bg-gray-200 transition"
            >
              NEXT LEVEL <ArrowRight size={20} />
            </button>
          </div>
        )}

        {gameState === GameState.VICTORY && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center rounded-lg z-10">
            <div className="mb-6 text-yellow-400">
               <CheckCircle2 size={80} />
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">YOU WIN!</h2>
            <p className="text-indigo-200 mb-8 text-center max-w-md">
              You have mastered the art of shape shifting and conquered all obstacles.
            </p>
            <button 
              onClick={handleRestartGame}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-lg transition"
            >
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-slate-600 flex gap-8">
        <span>MOVE: Arrows / WASD</span>
        <span>JUMP: Space / Up</span>
        <span>RESET: R</span>
      </div>
    </div>
  );
};

export default App;