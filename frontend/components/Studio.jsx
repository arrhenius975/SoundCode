import { useEffect } from 'react';
import Keyboard from './Keyboard';
import PatternEditor from './PatternEditor';
import Transport from './Transport';
import InstrumentSelector from './InstrumentSelector';
import EqControls from './EqControls';
import PatternVisualizer from './PatternVisualizer';
import useStudioStore from '../store/useStudioStore';
import { initAudio } from '../utils/audioEngine';

export default function Studio() {
  const { parsedPattern, isPlaying, currentTime } = useStudioStore();
  
  useEffect(() => {
    // Initialize audio engine
    const initializeAudio = async () => {
      try {
        await initAudio();
        console.log('Audio engine initialized');
      } catch (error) {
        console.error('Error initializing audio engine:', error);
      }
    };
    
    initializeAudio();
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-4">
          <PatternEditor />
          <PatternVisualizer />
        </div>
        <div className="w-full md:w-1/3 p-4 flex flex-col">
          <InstrumentSelector />
          <EqControls />
          <Keyboard />
        </div>
      </div>
      <Transport />
    </div>
  );
}