# Backend Architecture for Programmable Pattern Music Studio

## Overview

The backend for the Programmable Pattern Music Studio will be built using Python with FastAPI as the web framework. It will handle pattern parsing, audio processing logic, and provide RESTful API endpoints for the frontend to interact with.

## Core Components

### 1. FastAPI Application

The main application will be built using FastAPI, which provides high performance, automatic API documentation, and type checking.

```python
# Main application structure
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Pattern Music Studio API",
    description="Backend API for the Programmable Pattern Music Studio",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Pattern DSL Parser

The Pattern DSL Parser will be the core component that translates the custom music programming language into a structured format that can be processed by the audio engine.

#### Parser Architecture

We'll use a combination of lexical analysis and parsing techniques to process the DSL:

1. **Lexer**: Tokenizes the input string into meaningful tokens
2. **Parser**: Converts tokens into an abstract syntax tree (AST)
3. **Interpreter**: Traverses the AST to generate the final pattern data

We'll use the `lark` library for parsing, which provides a powerful and flexible parsing toolkit:

```python
from lark import Lark, Transformer

# Define the grammar for our DSL
pattern_grammar = """
    start: import_statement* pattern_block+
    
    import_statement: "import" INSTRUMENT "from" MODULE_NAME ";"
    
    pattern_block: BLOCK_TYPE "{" statement* "}"
    
    statement: INSTRUMENT NOTE TIMESTAMP ";"
    
    INSTRUMENT: /[a-zA-Z_][a-zA-Z0-9_]*/
    NOTE: /[A-G][#b]?[0-9]|[A-Za-z]+/
    TIMESTAMP: /[0-9]+(\.[0-9]+)?/
    BLOCK_TYPE: "melody" | "rhythm" | "harmony" | "contrast"
    MODULE_NAME: /\"[a-zA-Z_][a-zA-Z0-9_]*\"/
    
    %import common.WS
    %ignore WS
"""

# Create the parser
pattern_parser = Lark(pattern_grammar)

# Transformer to convert parse tree to JSON
class PatternTransformer(Transformer):
    def start(self, items):
        result = {"imports": [], "patterns": {}}
        for item in items:
            if isinstance(item, dict) and "import" in item:
                result["imports"].append(item["import"])
            elif isinstance(item, dict) and "block_type" in item:
                result["patterns"][item["block_type"]] = item["statements"]
        return result
    
    def import_statement(self, items):
        return {"import": {"instrument": items[0], "module": items[1]}}
    
    def pattern_block(self, items):
        block_type = items[0]
        statements = items[1:]
        return {"block_type": block_type, "statements": statements}
    
    def statement(self, items):
        return {
            "instrument": items[0],
            "note": items[1],
            "time": float(items[2])
        }
    
    # Add other transformation methods as needed
```

### 3. Data Models

We'll define Pydantic models for data validation and serialization:

```python
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ImportStatement(BaseModel):
    instrument: str
    module: str

class NoteEvent(BaseModel):
    instrument: str
    note: str
    time: float
    velocity: float = 1.0  # Default velocity
    duration: float = 0.5  # Default duration

class Pattern(BaseModel):
    imports: List[ImportStatement]
    patterns: Dict[str, List[NoteEvent]]

class ParseRequest(BaseModel):
    pattern_code: str

class ParseResponse(BaseModel):
    success: bool
    pattern: Optional[Pattern] = None
    error: Optional[str] = None
```

### 4. API Endpoints

The backend will expose the following RESTful API endpoints:

```python
@app.post("/api/parse", response_model=ParseResponse)
async def parse_pattern(request: ParseRequest):
    """
    Parse a pattern DSL code and return the structured pattern data.
    """
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

@app.get("/api/instruments")
async def get_instruments():
    """
    Get a list of available instruments.
    """
    # This would be replaced with actual instrument data
    instruments = {
        "piano": ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
        "synth": ["Kick", "Snare", "HiHat", "Crash", "Tom"],
        "guitar": ["E2", "A2", "D3", "G3", "B3", "E4"]
    }
    
    return instruments

# Additional endpoints for future features
@app.post("/api/save")
async def save_pattern():
    # Save pattern to database or file
    pass

@app.get("/api/load/{pattern_id}")
async def load_pattern(pattern_id: str):
    # Load pattern from database or file
    pass
```

### 5. Audio Processing (Optional Backend Component)

While most audio processing will happen in the frontend using Tone.js, we might need some backend audio processing for more complex features:

```python
# This is a placeholder for potential backend audio processing
# For example, using libraries like pydub, mido, or fluidsynth
class AudioProcessor:
    def __init__(self):
        # Initialize audio processing components
        pass
    
    def process_pattern(self, pattern: Pattern):
        # Process the pattern and generate audio data
        pass
    
    def export_midi(self, pattern: Pattern, filename: str):
        # Export the pattern as a MIDI file
        pass
    
    def export_wav(self, pattern: Pattern, filename: str):
        # Export the pattern as a WAV file
        pass
```

## Project Structure

The backend project will be organized as follows:

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py        # API endpoints
│   │   └── dependencies.py  # API dependencies
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py        # Application configuration
│   │   └── security.py      # Authentication and security
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py        # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── parser.py        # Pattern DSL parser
│   │   └── audio.py         # Audio processing service
│   └── utils/
│       ├── __init__.py
│       └── helpers.py       # Utility functions
├── tests/
│   ├── __init__.py
│   ├── test_api.py
│   ├── test_parser.py
│   └── test_audio.py
├── .env                     # Environment variables
├── .gitignore
├── requirements.txt
└── README.md
```

## Dependencies

The backend will require the following Python packages:

```
fastapi>=0.68.0
uvicorn>=0.15.0
pydantic>=1.8.2
lark-parser>=0.12.0
python-dotenv>=0.19.0
pytest>=6.2.5
httpx>=0.19.0  # For testing
```

## Deployment Considerations

For initial development, the backend will be deployed locally. In production, it can be deployed to platforms like:

- Railway
- Render
- Heroku
- AWS Lambda with API Gateway
- Google Cloud Run

## Future Extensions

The backend architecture is designed to be extensible for future features:

1. **WebSocket Support**: For real-time updates and collaborative features
2. **Database Integration**: To store and retrieve patterns
3. **Authentication**: User accounts and access control
4. **Advanced Audio Processing**: More sophisticated audio manipulation
5. **Plugin System**: For extending the DSL and adding new instruments

## Error Handling

The backend will implement comprehensive error handling:

```python
from fastapi import HTTPException, status

# Example of error handling in an endpoint
@app.post("/api/parse")
async def parse_pattern(request: ParseRequest):
    try:
        # Parse the pattern code
        # ...
    except SyntaxError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Syntax error in pattern code: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while parsing the pattern: {str(e)}"
        )
```

## Logging

The backend will implement structured logging:

```python
import logging
from fastapi.logger import logger as fastapi_logger

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

# Example of logging in an endpoint
@app.post("/api/parse")
async def parse_pattern(request: ParseRequest):
    fastapi_logger.info(f"Parsing pattern code: {request.pattern_code[:50]}...")
    # ...
```

## Conclusion

This backend architecture provides a solid foundation for the Programmable Pattern Music Studio. It's designed to be modular, extensible, and maintainable, allowing for easy addition of new features as the project evolves.