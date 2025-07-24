import { useEffect, useState } from 'react';
import useStudioStore from '../store/useStudioStore';
import { playNote } from '../utils/audioEngine';

const KEYS = [
  { note: 'C4', key: 'a', type: 'white' },
  { note: 'C#4', key: 'w', type: 'black' },
  { note: 'D4', key: 's', type: 'white' },
  { note: 'D#4', key: 'e', type: 'black' },
  { note: 'E4', key: 'd', type: 'white' },
  { note: 'F4', key: 'f', type: 'white' },
  { note: 'F#4', key: 't', type: 'black' },
  { note: 'G4', key: 'g', type: 'white' },
  { note: 'G#4', key: 'y', type: 'black' },
  { note: 'A4', key: 'h', type: 'white' },
  { note: 'A#4', key: 'u', type: 'black' },
  { note: 'B4', key: 'j', type: 'white' },
  { note: 'C5', key: 'k', type: 'white' },
];

export default function Keyboard() {
  const { selectedInstrument } = useStudioStore();
  const [activeKeys, setActiveKeys] = useState({});
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = KEYS.find((k) => k.key === e.key.toLowerCase());
      if (key && !activeKeys[key.note]) {
        playNote(selectedInstrument, key.note);
        setActiveKeys((prev) => ({ ...prev, [key.note]: true }));
      }
    };
    
    const handleKeyUp = (e) => {
      const key = KEYS.find((k) => k.key === e.key.toLowerCase());
      if (key) {
        setActiveKeys((prev) => {
          const newActiveKeys = { ...prev };
          delete newActiveKeys[key.note];
          return newActiveKeys;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedInstrument, activeKeys]);
  
  const handleKeyClick = (note) => {
    playNote(selectedInstrument, note);
  };
  
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2" id="keyboard-heading">Keyboard</h2>
      <div 
        className="relative h-48 flex"
        role="group"
        aria-labelledby="keyboard-heading"
      >
        {KEYS.map((key, index) => {
          if (key.type === 'white') {
            return (
              <div
                key={key.note}
                role="button"
                aria-label={`Play ${key.note} (${key.key} key)`}
                tabIndex={0}
                className={`piano-key white ${activeKeys[key.note] ? 'bg-blue-200' : ''}`}
                onClick={() => handleKeyClick(key.note)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleKeyClick(key.note);
                  }
                }}
              >
                <span>{key.key}</span>
              </div>
            );
          }
          return null;
        })}
        
        {KEYS.map((key, index) => {
          if (key.type === 'black') {
            // Find the index of the previous white key
            const prevWhiteKeyIndex = KEYS.findIndex(
              (k, i) => i < index && k.type === 'white'
            );
            
            // Calculate the position
            const position = prevWhiteKeyIndex * 48 + 32;
            
            return (
              <div
                key={key.note}
                role="button"
                aria-label={`Play ${key.note} (${key.key} key)`}
                tabIndex={0}
                className={`piano-key black ${activeKeys[key.note] ? 'bg-blue-800' : ''}`}
                style={{ left: `${position}px` }}
                onClick={() => handleKeyClick(key.note)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleKeyClick(key.note);
                  }
                }}
              >
                <span>{key.key}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-2 text-sm text-gray-400">
        Use your computer keyboard to play the notes (keys a-k)
      </div>
    </div>
  );
}