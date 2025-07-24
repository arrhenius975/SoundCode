# 🎹 Programmable Pattern Music Studio

A web-based digital audio workstation (DAW) that enables users to create music using a virtual keyboard, programmable patterns, and custom instruments.

## 📘 Overview

The Pattern Music Studio is a hybrid music sequencer and scripting platform that allows users to create music using:

- A visual keyboard interface
- A custom domain-specific language (DSL) for programming musical patterns
- Multiple instruments (piano, synth, guitar)
- EQ controls for sound shaping

This fusion allows people with minimal music theory knowledge but strong logical/programming skills to create complex music compositions.

## 🧱 System Architecture

The system consists of two main components:

1. **Frontend**: A Next.js web application with a user interface for composing and playing music.
2. **Backend**: A Python FastAPI application that handles pattern parsing and other server-side operations.

```
                     +----------------------------+
                     |        Frontend UI         |
                     | (Next.js + Tailwind CSS)   |
                     +-------------+--------------+
                                   |
                        HTTP / WebSocket API
                                   |
                     +-------------v--------------+
                     |         Python Backend     |
                     |   (FastAPI / Flask App)    |
                     +-------------+--------------+
                                   |
                      Pattern Parsing & Logic Engine
                                   |
                     +-------------v--------------+
                     |     Pattern Processor      |
                     |  (Python Custom DSL Parser)|
                     +-------------+--------------+
                                   |
                              Audio Scheduler
                        (Browser with Tone.js or Python Synth Engine)
```

## 🔧 Technology Stack

| Layer              | Technology Used                             |
| ------------------ | ------------------------------------------- |
| UI Framework       | Next.js (React-based)                       |
| Styling            | Tailwind CSS                                |
| Code Editor        | Monaco Editor                               |
| Audio Playback     | Tone.js (Web Audio API)                     |
| Backend API        | Python (FastAPI)                            |
| Pattern Parsing    | Python Custom Parser (string → JSON)        |
| Communication      | REST API (JSON payloads)                    |
| Sound Synthesis    | Tone.js                                     |
| State Management   | Zustand                                     |

## 🎯 Key Features

- 🎹 **Visual Keyboard**: On-screen piano or keyboard component to input notes.
- 📝 **Code-based Pattern Editor**: DSL-based editor to compose structured patterns.
- 🧠 **DSL Pattern Parser**: A backend service to parse and convert scripts to timed note events.
- 🔊 **Audio Playback Engine**: Trigger instrument samples via frontend.
- 🎛️ **Basic EQ Interface**: Sliders for frequency range gain control.
- 🗂️ **Instrument Selector**: Users can choose and load different instruments.

## 🧩 Example Pattern Script (DSL)

```plaintext
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

## 🛠️ Getting Started

### Prerequisites

- Node.js 14.x or higher
- Python 3.8 or higher
- npm or yarn
- pip (Python package installer)

### Installation

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

- On Windows:
```bash
venv\Scripts\activate
```

- On macOS/Linux:
```bash
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start the backend server:

```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at http://localhost:8000.

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the frontend directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Start the frontend development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at http://localhost:3000.

## 📖 Usage

### Keyboard

- Use your computer keyboard to play notes (keys a-k)
- Click on the piano keys with your mouse

### Pattern Editor

1. Write your pattern code in the editor
2. Click "Parse & Play" to hear your pattern
3. The pattern will be visualized in the Pattern Visualizer

### Transport Controls

- Play: Start playback
- Pause: Pause playback
- Stop: Stop playback and reset to beginning
- BPM: Adjust the tempo

### EQ Controls

- Adjust the low, mid, and high frequency bands to shape the sound

## 📁 Project Structure

```
project-root/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── store/
│   ├── utils/
│   ├── public/
│   │   └── instruments/
│   ├── styles/
│   └── package.json
│
├── docs/
│   ├── backend_architecture.md
│   ├── frontend_architecture.md
│   └── integration_architecture.md
│
└── README.md
```

## 🧪 Testing

See the [test_plan.md](test_plan.md) file for details on testing the application.

## 📈 Future Enhancements

- 💻 Export projects to full DAW (Ableton, FL Studio)
- 🧠 AI-Assisted pattern generation
- 🧩 Plugin marketplace
- 📜 DSL with full control flow (conditions, loops, custom functions)
- 🔗 Real-time multiplayer jamming sessions (WebRTC/WebSocket)
- 🎹 MIDI keyboard input support (Web MIDI API)
- 📤 Export patterns as MIDI and WAV
- 🎚️ Add mixer: volume, panning, EQ per instrument

## 🧠 Target Audience

- Musicians who want programmable composition
- Developers who don't know music theory
- Hobbyists and beatmakers with a creative-tech mindset
- Educational use for music + programming integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.