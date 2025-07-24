# Frontend Architecture for Programmable Pattern Music Studio

## Overview

The frontend for the Programmable Pattern Music Studio will be built using Next.js with Tailwind CSS for styling. It will provide a rich, interactive user interface for composing music using both visual components and the custom DSL.

## Core Components

### 1. Next.js Application Structure

The application will be built using Next.js, which provides server-side rendering, static site generation, and API routes.

```javascript
// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

// pages/index.js
import Head from 'next/head';
import Studio from '../components/Studio';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pattern Music Studio</title>
        <meta name="description" content="Programmable Pattern Music Studio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Studio />
      </main>
    </div>
  );
}
```

### 2. State Management

We'll use Zustand for state management, which provides a simple and flexible approach:

```javascript
// store/useStudioStore.js
import create from 'zustand';

const useStudioStore = create((set) => ({
  // Pattern state
  patternCode: '',
  parsedPattern: null,
  isPlaying: false,
  currentTime: 0,
  bpm: 120,
  
  // Instruments state
  instruments: {},
  selectedInstrument: 'piano',
  
  // EQ state
  eq: {
    low: 0,
    mid: 0,
    high: 0,
  },
  
  // Actions
  setPatternCode: (code) => set({ patternCode: code }),
  setParsedPattern: (pattern) => set({ parsedPattern: pattern }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setBpm: (bpm) => set({ bpm }),
  setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),
  setEq: (eq) => set({ eq }),
}));

export default useStudioStore;
```

### 3. Main UI Components

The UI will be organized into several key components:

#### Studio Component

The main container component that orchestrates all other components:

```jsx
// components/Studio.jsx
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
    initAudio();
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <div className="flex-1 flex">
        <div className="w-2/3 p-4">
          <PatternEditor />
          <PatternVisualizer />
        </div>
        <div className="w-1/3 p-4 flex flex-col">
          <InstrumentSelector />
          <EqControls />
          <Keyboard />
        </div>
      </div>
      <Transport />
    </div>
  );
}
```

#### Pattern Editor Component

Monaco-based code editor for the DSL:

```jsx
// components/PatternEditor.jsx
import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import useStudioStore from '../store/useStudioStore';
import { parsePattern } from '../utils/apiClient';

export default function PatternEditor() {
  const { patternCode, setPatternCode, setParsedPattern } = useStudioStore();
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  
  const handleParsePattern = async () => {
    try {
      const pattern = await parsePattern(patternCode);
      setParsedPattern(pattern);
    } catch (error) {
      console.error('Error parsing pattern:', error);
      // Show error notification
    }
  };
  
  return (
    <div className="h-1/2 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Pattern Editor</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          onClick={handleParsePattern}
        >
          Parse & Play
        </button>
      </div>
      <div className="h-full border border-gray-700 rounded">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={patternCode}
          onChange={setPatternCode}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
```

#### Keyboard Component

Interactive piano keyboard:

```jsx
// components/Keyboard.jsx
import { useEffect } from 'react';
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
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = KEYS.find((k) => k.key === e.key.toLowerCase());
      if (key) {
        playNote(selectedInstrument, key.note);
        // Highlight the key in the UI
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedInstrument]);
  
  const handleKeyClick = (note) => {
    playNote(selectedInstrument, note);
  };
  
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Keyboard</h2>
      <div className="relative h-48 flex">
        {KEYS.map((key) => (
          <div
            key={key.note}
            className={`
              ${key.type === 'white' 
                ? 'bg-white text-black z-0 w-12' 
                : 'bg-black text-white z-10 w-8 h-28 absolute'
              } 
              border border-gray-300 flex items-end justify-center pb-2 cursor-pointer
            `}
            style={{
              left: key.type === 'black' 
                ? `${KEYS.filter(k => k.type === 'white').indexOf(KEYS.find(k => k.note[0] === key.note[0])) * 48 + 32}px` 
                : undefined
            }}
            onClick={() => handleKeyClick(key.note)}
          >
            <span>{key.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Transport Controls Component

Play, pause, stop, and other transport controls:

```jsx
// components/Transport.jsx
import { useState, useEffect } from 'react';
import useStudioStore from '../store/useStudioStore';
import { playPattern, stopPattern, pausePattern } from '../utils/audioEngine';

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
  
  return (
    <div className="h-16 bg-gray-800 border-t border-gray-700 flex items-center px-4">
      <div className="flex space-x-2">
        <button 
          className="bg-green-500 hover:bg-green-600 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={handlePlay}
          disabled={!parsedPattern}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="bg-yellow-500 hover:bg-yellow-600 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={handlePause}
          disabled={!isPlaying}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="bg-red-500 hover:bg-red-600 w-12 h-12 rounded-full flex items-center justify-center"
          onClick={handleStop}
          disabled={!isPlaying && currentTime === 0}
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
          onChange={(e) => setBpm(parseInt(e.target.value, 10))}
          min={40}
          max={240}
        />
      </div>
      
      <div className="ml-8">
        <div className="w-64 h-4 bg-gray-700 rounded">
          <div 
            className="h-full bg-blue-500 rounded"
            style={{ width: `${(currentTime / 16) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
```

#### Pattern Visualizer Component

Visual representation of the pattern:

```jsx
// components/PatternVisualizer.jsx
import { useEffect, useRef } from 'react';
import useStudioStore from '../store/useStudioStore';

export default function PatternVisualizer() {
  const { parsedPattern, currentTime } = useStudioStore();
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!parsedPattern || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Vertical lines (time divisions)
    for (let i = 0; i <= 16; i++) {
      const x = (i / 16) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines (note divisions)
    const noteTypes = Object.keys(parsedPattern.patterns);
    const rowHeight = height / noteTypes.length;
    
    noteTypes.forEach((type, index) => {
      const y = index * rowHeight;
      
      // Draw row label
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '14px sans-serif';
      ctx.fillText(type, 5, y + 20);
      
      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Draw notes
      parsedPattern.patterns[type].forEach((note) => {
        const x = (note.time / 16) * width;
        
        ctx.fillStyle = type === 'melody' 
          ? '#3b82f6' // blue
          : type === 'rhythm' 
            ? '#ef4444' // red
            : type === 'harmony' 
              ? '#10b981' // green
              : '#8b5cf6'; // purple
        
        ctx.beginPath();
        ctx.arc(x, y + rowHeight / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    
    // Draw playhead
    if (currentTime > 0) {
      const playheadX = (currentTime / 16) * width;
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }
  }, [parsedPattern, currentTime]);
  
  return (
    <div className="h-1/2">
      <h2 className="text-xl font-bold mb-2">Pattern Visualizer</h2>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full border border-gray-700 rounded"
        width={800}
        height={300}
      ></canvas>
    </div>
  );
}
```

#### Instrument Selector Component

For selecting different instruments:

```jsx
// components/InstrumentSelector.jsx
import useStudioStore from '../store/useStudioStore';

const INSTRUMENTS = [
  { id: 'piano', name: 'Piano' },
  { id: 'synth', name: 'Synth' },
  { id: 'guitar', name: 'Guitar' },
];

export default function InstrumentSelector() {
  const { selectedInstrument, setSelectedInstrument } = useStudioStore();
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Instruments</h2>
      <div className="flex space-x-2 mb-4">
        {INSTRUMENTS.map((instrument) => (
          <button
            key={instrument.id}
            className={`px-4 py-2 rounded ${
              selectedInstrument === instrument.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedInstrument(instrument.id)}
          >
            {instrument.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

#### EQ Controls Component

For adjusting the EQ settings:

```jsx
// components/EqControls.jsx
import useStudioStore from '../store/useStudioStore';
import { updateEq } from '../utils/audioEngine';

export default function EqControls() {
  const { eq, setEq } = useStudioStore();
  
  const handleEqChange = (band, value) => {
    const newEq = { ...eq, [band]: value };
    setEq(newEq);
    updateEq(newEq);
  };
  
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">EQ</h2>
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <span>Low</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.low}
            onChange={(e) => handleEqChange('low', parseInt(e.target.value, 10))}
            className="h-32 appearance-none bg-gray-700 rounded-full overflow-hidden"
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
          />
          <span>{eq.low} dB</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Mid</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.mid}
            onChange={(e) => handleEqChange('mid', parseInt(e.target.value, 10))}
            className="h-32 appearance-none bg-gray-700 rounded-full overflow-hidden"
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
          />
          <span>{eq.mid} dB</span>
        </div>
        <div className="flex flex-col items-center">
          <span>High</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.high}
            onChange={(e) => handleEqChange('high', parseInt(e.target.value, 10))}
            className="h-32 appearance-none bg-gray-700 rounded-full overflow-hidden"
            style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
          />
          <span>{eq.high} dB</span>
        </div>
      </div>
    </div>
  );
}
```

### 4. Audio Engine

The audio engine will be built using Tone.js:

```javascript
// utils/audioEngine.js
import * as Tone from 'tone';

// Instruments
let instruments = {
  piano: null,
  synth: null,
  guitar: null,
};

// EQ
let eq = {
  low: null,
  mid: null,
  high: null,
};

// Transport
let currentPattern = null;
let patternParts = {};

export const initAudio = async () => {
  // Wait for user interaction before starting audio context
  await Tone.start();
  
  // Create EQ
  eq.low = new Tone.EQ3(-1, 0, 0);
  eq.mid = new Tone.EQ3(0, 0, 0);
  eq.high = new Tone.EQ3(0, 0, -1);
  
  // Create instruments
  instruments.piano = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      E4: "E4.mp3",
      G4: "G4.mp3",
    },
    baseUrl: "/instruments/piano/",
  }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
  
  instruments.synth = new Tone.Sampler({
    urls: {
      Kick: "kick.mp3",
      Snare: "snare.mp3",
      HiHat: "hihat.mp3",
    },
    baseUrl: "/instruments/synth/",
  }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
  
  instruments.guitar = new Tone.Sampler({
    urls: {
      E2: "E2.mp3",
      A2: "A2.mp3",
      D3: "D3.mp3",
    },
    baseUrl: "/instruments/guitar/",
  }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
  
  // Set initial BPM
  Tone.Transport.bpm.value = 120;
};

export const playNote = (instrumentName, note) => {
  if (!instruments[instrumentName]) return;
  instruments[instrumentName].triggerAttackRelease(note, "8n");
};

export const updateEq = (eqSettings) => {
  eq.low.low.value = eqSettings.low;
  eq.mid.mid.value = eqSettings.mid;
  eq.high.high.value = eqSettings.high;
};

export const playPattern = (pattern) => {
  // Clear any existing pattern
  stopPattern();
  
  currentPattern = pattern;
  
  // Create a part for each pattern type
  Object.keys(pattern.patterns).forEach((type) => {
    const notes = pattern.patterns[type];
    
    patternParts[type] = new Tone.Part((time, note) => {
      instruments[note.instrument].triggerAttackRelease(
        note.note, 
        note.duration || "8n", 
        time, 
        note.velocity || 1
      );
    }, notes.map(note => [note.time, note]));
    
    patternParts[type].start(0);
    patternParts[type].loop = true;
    patternParts[type].loopEnd = 16;
  });
  
  // Start the transport
  Tone.Transport.start();
};

export const stopPattern = () => {
  Tone.Transport.stop();
  Tone.Transport.position = 0;
  
  // Dispose of all parts
  Object.values(patternParts).forEach(part => {
    part.dispose();
  });
  
  patternParts = {};
  currentPattern = null;
};

export const pausePattern = () => {
  Tone.Transport.pause();
};

export const setBpm = (bpm) => {
  Tone.Transport.bpm.value = bpm;
};
```

### 5. API Client

For communicating with the backend:

```javascript
// utils/apiClient.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const parsePattern = async (patternCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pattern_code: patternCode }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to parse pattern');
    }
    
    return data.pattern;
  } catch (error) {
    console.error('Error parsing pattern:', error);
    throw error;
  }
};

export const getInstruments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/instruments`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
};

export const savePattern = async (pattern) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pattern }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving pattern:', error);
    throw error;
  }
};

export const loadPattern = async (patternId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/load/${patternId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading pattern:', error);
    throw error;
  }
};
```

## Project Structure

The frontend project will be organized as follows:

```
frontend/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   ├── index.js
│   └── api/
│       └── proxy.js
├── components/
│   ├── Studio.jsx
│   ├── Keyboard.jsx
│   ├── PatternEditor.jsx
│   ├── PatternVisualizer.jsx
│   ├── Transport.jsx
│   ├── InstrumentSelector.jsx
│   ├── EqControls.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Slider.jsx
│       └── Modal.jsx
├── store/
│   └── useStudioStore.js
├── utils/
│   ├── audioEngine.js
│   └── apiClient.js
├── public/
│   ├── instruments/
│   │   ├── piano/
│   │   ├── synth/
│   │   └── guitar/
│   └── favicon.ico
├── styles/
│   └── globals.css
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Dependencies

The frontend will require the following npm packages:

```json
{
  "dependencies": {
    "next": "^12.0.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "@monaco-editor/react": "^4.4.5",
    "tone": "^14.7.77",
    "zustand": "^3.6.9",
    "tailwindcss": "^2.2.19",
    "postcss": "^8.3.11",
    "autoprefixer": "^10.4.0"
  },
  "devDependencies": {
    "eslint": "^8.1.0",
    "eslint-config-next": "^12.0.0"
  }
}
```

## Responsive Design

The UI will be designed to be responsive, with different layouts for desktop and mobile:

```jsx
// Example of responsive design in Studio.jsx
export default function Studio() {
  // ...
  
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
```

## Accessibility

The UI will be designed with accessibility in mind:

```jsx
// Example of accessibility in Keyboard.jsx
export default function Keyboard() {
  // ...
  
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2" id="keyboard-heading">Keyboard</h2>
      <div 
        className="relative h-48 flex"
        role="group"
        aria-labelledby="keyboard-heading"
      >
        {KEYS.map((key) => (
          <div
            key={key.note}
            role="button"
            aria-label={`Play ${key.note} (${key.key} key)`}
            tabIndex={0}
            className={`
              ${key.type === 'white' 
                ? 'bg-white text-black z-0 w-12' 
                : 'bg-black text-white z-10 w-8 h-28 absolute'
              } 
              border border-gray-300 flex items-end justify-center pb-2 cursor-pointer
            `}
            style={{
              left: key.type === 'black' 
                ? `${KEYS.filter(k => k.type === 'white').indexOf(KEYS.find(k => k.note[0] === key.note[0])) * 48 + 32}px` 
                : undefined
            }}
            onClick={() => handleKeyClick(key.note)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleKeyClick(key.note);
              }
            }}
          >
            <span>{key.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Error Handling

The frontend will implement comprehensive error handling:

```jsx
// Example of error handling in PatternEditor.jsx
export default function PatternEditor() {
  const { patternCode, setPatternCode, setParsedPattern } = useStudioStore();
  const [error, setError] = useState(null);
  
  const handleParsePattern = async () => {
    try {
      setError(null);
      const