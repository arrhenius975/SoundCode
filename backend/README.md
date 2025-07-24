# Pattern Music Studio Backend

This is the backend for the Programmable Pattern Music Studio, a web-based digital audio workstation (DAW) that enables users to create music using a virtual keyboard, programmable patterns, and custom instruments.

## Features

- Custom DSL (Domain-Specific Language) for programming musical patterns
- RESTful API for parsing patterns, managing instruments, and more
- Support for multiple instruments (piano, synth, guitar)
- Pattern storage and retrieval

## Tech Stack

- **FastAPI**: High-performance web framework for building APIs
- **Lark**: Parser toolkit for implementing the pattern DSL
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for running the FastAPI application

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pattern-music-studio/backend
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

### Running the Application

1. Start the development server:

```bash
uvicorn app.main:app --reload --port 8000
```

2. The API will be available at http://localhost:8000

3. Access the API documentation at http://localhost:8000/docs

## API Endpoints

- `GET /`: Root endpoint to check if the API is running
- `GET /health`: Health check endpoint
- `POST /api/parse`: Parse a pattern DSL code and return the structured pattern data
- `GET /api/instruments`: Get a list of available instruments
- `POST /api/patterns`: Save a pattern to the database
- `GET /api/patterns/{pattern_id}`: Load a pattern from the database
- `GET /api/patterns`: List all patterns in the database

## Pattern DSL Syntax

The Pattern DSL allows users to define musical patterns using a simple syntax:

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

## Testing

Run the tests using pytest:

```bash
pytest
```

## Development

### Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── routes.py        # API endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # Application configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py        # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   └── parser.py        # Pattern DSL parser
│   └── utils/
│       ├── __init__.py
│       └── helpers.py       # Utility functions
├── tests/
│   ├── __init__.py
│   └── test_parser.py       # Tests for the parser
├── .env                     # Environment variables (create this file)
├── requirements.txt         # Dependencies
└── README.md                # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.