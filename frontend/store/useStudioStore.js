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
  
  // Reset state
  resetState: () => set({
    patternCode: '',
    parsedPattern: null,
    isPlaying: false,
    currentTime: 0,
    bpm: 120,
    selectedInstrument: 'piano',
    eq: {
      low: 0,
      mid: 0,
      high: 0,
    },
  }),
}));

export default useStudioStore;