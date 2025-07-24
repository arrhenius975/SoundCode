# Integration Architecture: Connecting Frontend and Backend

This document outlines how the frontend and backend components of the Programmable Pattern Music Studio will be integrated and synchronized.

## Overview

The integration between the Next.js frontend and the Python FastAPI backend will primarily occur through:

1. **REST API Calls**: For pattern parsing, instrument data, and other non-real-time operations
2. **WebSockets** (future enhancement): For real-time updates and collaborative features

## Communication Flow

```
+-------------------+                 +-------------------+
|                   |  1. HTTP POST   |                   |
|                   | --------------> |                   |
|                   |  Pattern Code   |                   |
|                   |                 |                   |
|    Next.js        |                 |    FastAPI        |
|    Frontend       |  2. HTTP 200    |    Backend        |
|                   | <-------------- |                   |
|                   |  Parsed Pattern |                   |
|                   |                 |                   |
|                   |                 |                   |
+-------------------+                 +-------------------+
        |                                      |
        |                                      |
        v                                      v
+-------------------+                 +-------------------+
|                   |                 |                   |
|    Tone.js        |                 |    Pattern        |
|    Audio Engine   |                 |    Parser         |
|                   |                 |                   |
+-------------------+                 +-------------------+
```

## API Endpoints and Data Flow

### 1. Pattern Parsing

**Frontend to Backend:**
```javascript
// Frontend code (utils/apiClient.js)
export const parsePattern = async (patternCode) => {
  const response = await fetch('http://localhost:8000/api/parse', {
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
};
```

**Backend Endpoint:**
```python
# Backend code (app/api/routes.py)
@app.post("/api/parse", response_model=ParseResponse)
async def parse_pattern(request: ParseRequest):
    try:
        # Parse the pattern code
        parse_tree = pattern_parser.parse(request.pattern_code)
        transformer = PatternTransformer()
        pattern_data = transformer.transform(parse_tree)
        
        return {
            "success": True,
            "pattern": pattern_data,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "pattern": None,
            "error": str(e)
        }
```

**Data Format:**
```json
// Request
{
  "pattern_code": "import piano from \"pianoset\";\n\nmelody {\n  piano C4 0;\n  piano E4 0.5;\n  piano G4 1.0;\n}"
}

// Response
{
  "success": true,
  "pattern": {
    "imports": [
      {
        "instrument": "piano",
        "module": "pianoset"
      }
    ],
    "patterns": {
      "melody": [
        {
          "instrument": "piano",
          "note": "C4",
          "time": 0
        },
        {
          "instrument": "piano",
          "note": "E4",
          "time": 0.5
        },
        {
          "instrument": "piano",
          "note": "G4",
          "time": 1.0
        }
      ]
    }
  },
  "error": null
}
```

### 2. Instrument Data

**Frontend to Backend:**
```javascript
// Frontend code (utils/apiClient.js)
export const getInstruments = async () => {
  const response = await fetch('http://localhost:8000/api/instruments');
  const data = await response.json();
  return data;
};
```

**Backend Endpoint:**
```python
# Backend code (app/api/routes.py)
@app.get("/api/instruments")
async def get_instruments():
    # This would be replaced with actual instrument data
    instruments = {
        "piano": ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
        "synth": ["Kick", "Snare", "HiHat", "Crash", "Tom"],
        "guitar": ["E2", "A2", "D3", "G3", "B3", "E4"]
    }
    
    return instruments
```

**Data Format:**
```json
// Response
{
  "piano": ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  "synth": ["Kick", "Snare", "HiHat", "Crash", "Tom"],
  "guitar": ["E2", "A2", "D3", "G3", "B3", "E4"]
}
```

### 3. Save/Load Patterns (Future Feature)

**Frontend to Backend (Save):**
```javascript
// Frontend code (utils/apiClient.js)
export const savePattern = async (pattern, name) => {
  const response = await fetch('http://localhost:8000/api/patterns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pattern, name }),
  });
  
  const data = await response.json();
  return data;
};
```

**Backend Endpoint (Save):**
```python
# Backend code (app/api/routes.py)
@app.post("/api/patterns", response_model=PatternResponse)
async def save_pattern(request: SavePatternRequest):
    try:
        # Save pattern to database or file
        pattern_id = str(uuid.uuid4())
        
        # In a real implementation, this would save to a database
        patterns_db[pattern_id] = {
            "id": pattern_id,
            "name": request.name,
            "pattern": request.pattern,
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "pattern_id": pattern_id,
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "pattern_id": None,
            "error": str(e)
        }
```

**Frontend to Backend (Load):**
```javascript
// Frontend code (utils/apiClient.js)
export const loadPattern = async (patternId) => {
  const response = await fetch(`http://localhost:8000/api/patterns/${patternId}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load pattern');
  }
  
  return data.pattern;
};
```

**Backend Endpoint (Load):**
```python
# Backend code (app/api/routes.py)
@app.get("/api/patterns/{pattern_id}", response_model=LoadPatternResponse)
async def load_pattern(pattern_id: str):
    try:
        if pattern_id not in patterns_db:
            return {
                "success": False,
                "pattern": None,
                "error": "Pattern not found"
            }
        
        return {
            "success": True,
            "pattern": patterns_db[pattern_id]["pattern"],
            "error": None
        }
    except Exception as e:
        return {
            "success": False,
            "pattern": None,
            "error": str(e)
        }
```

## CORS Configuration

To enable cross-origin requests between the frontend and backend during development:

**Backend CORS Configuration:**
```python
# Backend code (app/main.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Frontend API Base URL Configuration:**
```javascript
// Frontend code (utils/apiClient.js)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Then use API_BASE_URL in all fetch calls
```

## Error Handling

### Frontend Error Handling

```javascript
// Frontend code (components/PatternEditor.jsx)
const handleParsePattern = async () => {
  try {
    setError(null);
    setIsLoading(true);
    
    const pattern = await parsePattern(patternCode);
    setParsedPattern(pattern);
    
    // Success notification
    toast.success('Pattern parsed successfully!');
  } catch (error) {
    console.error('Error parsing pattern:', error);
    
    // Set error state
    setError(error.message);
    
    // Error notification
    toast.error(`Error: ${error.message}`);
  } finally {
    setIsLoading(false);
  }
};
```

### Backend Error Handling

```python
# Backend code (app/api/routes.py)
@app.post("/api/parse", response_model=ParseResponse)
async def parse_pattern(request: ParseRequest):
    try:
        # Parse the pattern code
        parse_tree = pattern_parser.parse(request.pattern_code)
        transformer = PatternTransformer()
        pattern_data = transformer.transform(parse_tree)
        
        return {
            "success": True,
            "pattern": pattern_data,
            "error": None
        }
    except Exception as e:
        # Log the error
        logger.error(f"Error parsing pattern: {str(e)}")
        
        # Return error response
        return {
            "success": False,
            "pattern": None,
            "error": str(e)
        }
```

## WebSocket Integration (Future Enhancement)

For real-time features like collaborative editing and live playback synchronization:

### Backend WebSocket Setup

```python
# Backend code (app/api/websockets.py)
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Process the received data
            # For example, if a user updates a pattern, broadcast it to all connected clients
            await manager.broadcast({"type": "pattern_update", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

### Frontend WebSocket Integration

```javascript
// Frontend code (utils/websocket.js)
let socket = null;

export const connectWebSocket = () => {
  if (socket) return;
  
  socket = new WebSocket('ws://localhost:8000/ws');
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
  };
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Handle different message types
    switch (data.type) {
      case 'pattern_update':
        // Update the pattern in the UI
        break;
      // Handle other message types
      default:
        console.log('Unknown message type:', data.type);
    }
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed');
    socket = null;
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendWebSocketMessage = (message) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.error('WebSocket not connected');
    return;
  }
  
  socket.send(JSON.stringify(message));
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
```

## Development Environment Setup

To facilitate local development and testing of the integrated system:

### Backend Development Server

```bash
# Start the backend server
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend Development Server

```bash
# Start the frontend server
cd frontend
npm install
npm run dev
```

## Deployment Considerations

For production deployment, consider the following:

1. **Backend Deployment**:
   - Deploy to a platform like Railway, Render, or Heroku
   - Set up proper environment variables for production
   - Configure CORS to only allow requests from the production frontend URL

2. **Frontend Deployment**:
   - Deploy to Vercel or Netlify
   - Set environment variables for the production API URL
   - Enable build-time optimization

3. **Integration**:
   - Ensure the frontend is configured to use the production backend URL
   - Set up proper error handling and monitoring
   - Implement rate limiting and other security measures

## Testing the Integration

To ensure the frontend and backend work together correctly:

1. **Unit Tests**:
   - Test the pattern parser in isolation
   - Test the audio engine in isolation
   - Test the API client functions in isolation

2. **Integration Tests**:
   - Test the pattern parsing flow from frontend to backend and back
   - Test the instrument data retrieval flow
   - Test error handling scenarios

3. **End-to-End Tests**:
   - Test the complete user flow from writing a pattern to hearing it play
   - Test edge cases and error scenarios
   - Test performance under load

## Conclusion

This integration architecture provides a solid foundation for connecting the frontend and backend components of the Programmable Pattern Music Studio. By following these guidelines, we can ensure a smooth and efficient communication between the two parts of the system, enabling a seamless user experience.