# Pattern Music Studio Frontend

This is the frontend for the Programmable Pattern Music Studio, a web-based digital audio workstation (DAW) that enables users to create music using a virtual keyboard, programmable patterns, and custom instruments.

## Features

- Interactive piano keyboard with computer keyboard support
- Pattern editor with Monaco editor for writing custom DSL code
- Pattern visualizer to see the notes on a timeline
- Transport controls for playback
- EQ controls for sound shaping
- Multiple instrument support (piano, synth, guitar)

## Tech Stack

- **Next.js**: React framework for building the UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Tone.js**: Web Audio framework for sound generation and playback
- **Monaco Editor**: Code editor for the pattern DSL
- **Zustand**: State management library

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Backend API running (see the backend README)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pattern-music-studio/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Running the Application

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Keyboard

- Use your computer keyboard to play notes (keys a-k)
- Click on the piano keys with your mouse

### Pattern Editor

1. Write your pattern code in the editor
2. Click "Parse & Play" to hear your pattern
3. The pattern will be visualized in the Pattern Visualizer

### Example Pattern Code

```
import piano from "pianoset";
import synth from "synthset";

melody {
    piano C4 0;
    piano E4 0.5;
    piano G4 1.0;
}

rhythm {
    synth Kick 0;
    synth Snare 0.5;
    synth Kick 1.0;
}
```

### Transport Controls

- Play: Start playback
- Pause: Pause playback
- Stop: Stop playback and reset to beginning
- BPM: Adjust the tempo

### EQ Controls

- Adjust the low, mid, and high frequency bands to shape the sound

## Project Structure

```
frontend/
├── pages/
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── components/
│   ├── Studio.jsx
│   ├── Keyboard.jsx
│   ├── PatternEditor.jsx
│   ├── PatternVisualizer.jsx
│   ├── Transport.jsx
│   ├── InstrumentSelector.jsx
│   └── EqControls.jsx
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
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Building for Production

```bash
npm run build
# or
yarn build
```

Then, you can start the production server:

```bash
npm run start
# or
yarn start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.