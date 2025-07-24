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

/**
 * Initialize the audio engine.
 * This must be called after a user interaction to start the audio context.
 */
export const initAudio = async () => {
  try {
    // Wait for user interaction before starting audio context
    await Tone.start();
    console.log('Audio context started');
    
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
      onload: () => console.log('Piano samples loaded'),
    }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
    
    instruments.synth = new Tone.Sampler({
      urls: {
        Kick: "kick.mp3",
        Snare: "snare.mp3",
        HiHat: "hihat.mp3",
      },
      baseUrl: "/instruments/synth/",
      onload: () => console.log('Synth samples loaded'),
    }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
    
    instruments.guitar = new Tone.Sampler({
      urls: {
        E2: "E2.mp3",
        A2: "A2.mp3",
        D3: "D3.mp3",
      },
      baseUrl: "/instruments/guitar/",
      onload: () => console.log('Guitar samples loaded'),
    }).chain(eq.low, eq.mid, eq.high, Tone.Destination);
    
    // Set initial BPM
    Tone.Transport.bpm.value = 120;
    
    // Set up transport loop
    Tone.Transport.loop = true;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = '4m';
    
    console.log('Audio engine initialized');
    return true;
  } catch (error) {
    console.error('Error initializing audio engine:', error);
    throw error;
  }
};

/**
 * Play a single note.
 * 
 * @param {string} instrumentName - The name of the instrument to play.
 * @param {string} note - The note to play.
 */
export const playNote = (instrumentName, note) => {
  if (!instruments[instrumentName]) {
    console.error(`Instrument ${instrumentName} not found`);
    return;
  }
  
  try {
    instruments[instrumentName].triggerAttackRelease(note, "8n");
  } catch (error) {
    console.error(`Error playing note ${note} on ${instrumentName}:`, error);
  }
};

/**
 * Update the EQ settings.
 * 
 * @param {Object} eqSettings - The EQ settings.
 * @param {number} eqSettings.low - The low frequency gain.
 * @param {number} eqSettings.mid - The mid frequency gain.
 * @param {number} eqSettings.high - The high frequency gain.
 */
export const updateEq = (eqSettings) => {
  try {
    eq.low.low.value = eqSettings.low;
    eq.mid.mid.value = eqSettings.mid;
    eq.high.high.value = eqSettings.high;
  } catch (error) {
    console.error('Error updating EQ:', error);
  }
};

/**
 * Play a pattern.
 * 
 * @param {Object} pattern - The pattern to play.
 */
export const playPattern = (pattern) => {
  try {
    // Clear any existing pattern
    stopPattern();
    
    currentPattern = pattern;
    
    // Create a part for each pattern type
    Object.keys(pattern.patterns).forEach((type) => {
      const notes = pattern.patterns[type];
      
      patternParts[type] = new Tone.Part((time, note) => {
        // Check if the instrument exists
        if (!instruments[note.instrument]) {
          console.error(`Instrument ${note.instrument} not found`);
          return;
        }
        
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
  } catch (error) {
    console.error('Error playing pattern:', error);
  }
};

/**
 * Stop the current pattern.
 */
export const stopPattern = () => {
  try {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    
    // Dispose of all parts
    Object.values(patternParts).forEach(part => {
      part.dispose();
    });
    
    patternParts = {};
    currentPattern = null;
  } catch (error) {
    console.error('Error stopping pattern:', error);
  }
};

/**
 * Pause the current pattern.
 */
export const pausePattern = () => {
  try {
    Tone.Transport.pause();
  } catch (error) {
    console.error('Error pausing pattern:', error);
  }
};

/**
 * Set the BPM (beats per minute).
 * 
 * @param {number} bpm - The BPM to set.
 */
export const setBpm = (bpm) => {
  try {
    Tone.Transport.bpm.value = bpm;
  } catch (error) {
    console.error('Error setting BPM:', error);
  }
};

/**
 * Get the current transport position.
 * 
 * @returns {number} - The current position in beats.
 */
export const getCurrentPosition = () => {
  try {
    const position = Tone.Transport.position;
    const [bars, beats, sixteenths] = position.split(':').map(Number);
    return bars * 4 + beats + sixteenths / 4;
  } catch (error) {
    console.error('Error getting current position:', error);
    return 0;
  }
};

/**
 * Clean up the audio engine.
 * Call this when the component unmounts.
 */
export const cleanupAudio = () => {
  try {
    stopPattern();
    
    // Dispose of instruments
    Object.values(instruments).forEach(instrument => {
      if (instrument) {
        instrument.dispose();
      }
    });
    
    // Dispose of EQ
    Object.values(eq).forEach(eqBand => {
      if (eqBand) {
        eqBand.dispose();
      }
    });
    
    instruments = {
      piano: null,
      synth: null,
      guitar: null,
    };
    
    eq = {
      low: null,
      mid: null,
      high: null,
    };
    
    console.log('Audio engine cleaned up');
  } catch (error) {
    console.error('Error cleaning up audio engine:', error);
  }
};