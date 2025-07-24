import { useState, useEffect } from 'react';
import useStudioStore from '../store/useStudioStore';
import { playPattern, stopPattern, pausePattern, setBpm as setAudioBpm } from '../utils/audioEngine';

export default function Transport() {
  const { 
    isPlaying, 
    setIsPlaying, 
    parsedPattern, 
    currentTime, 
    setCurrentTime,
    bpm,
    setBpm
  } = useStudioStore();
  
  // Update the transport position display
  useEffect(() => {
    let interval;
    
    if (isPlaying) {
      interval = setInterval(() => {
        // Update the current time (this would normally come from the audio engine)
        setCurrentTime((prev) => {
          // Loop back to 0 after 16 beats
          if (prev >= 16) {
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, setCurrentTime]);
  
  const handlePlay = () => {
    if (parsedPattern) {
      playPattern(parsedPattern);
      setIsPlaying(true);
    }
  };
  
  const handleStop = () => {
    stopPattern();
    setIsPlaying(false);
    setCurrentTime(0);
  };
  
  const handlePause = () => {
    pausePattern();
    setIsPlaying(false);
  };
  
  const handleBpmChange = (e) => {
    const newBpm = parseInt(e.target.value, 10);
    setBpm(newBpm);
    setAudioBpm(newBpm);
  };
  
  return (
    <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center px-4">
      <div className="flex space-x-2">
        <button 
          className="transport-button play"
          onClick={handlePlay}
          disabled={!parsedPattern || isPlaying}
          aria-label="Play"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="transport-button pause"
          onClick={handlePause}
          disabled={!isPlaying}
          aria-label="Pause"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="transport-button stop"
          onClick={handleStop}
          disabled={!isPlaying && currentTime === 0}
          aria-label="Stop"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="ml-8 flex items-center">
        <span className="mr-2">BPM:</span>
        <input 
          type="number" 
          className="bg-gray-700 text-white px-2 py-1 w-16 rounded"
          value={bpm}
          onChange={handleBpmChange}
          min={40}
          max={240}
          aria-label="Tempo in beats per minute"
        />
      </div>
      
      <div className="ml-8 flex-1">
        <div className="w-full h-4 bg-gray-700 rounded">
          <div 
            className="h-full bg-blue-500 rounded"
            style={{ width: `${(currentTime / 16) * 100}%` }}
            aria-label={`Playhead position: ${Math.floor(currentTime)} beats`}
          ></div>
        </div>
      </div>
      
      <div className="ml-4 text-sm">
        {Math.floor(currentTime)}.{Math.floor((currentTime % 1) * 10)}
      </div>
    </div>
  );
}