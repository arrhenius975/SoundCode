from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any, Optional
import logging

from app.models.models import ParseRequest, ParseResponse, ImportStatement, NoteEvent, Pattern
from app.services.parser import PatternParser

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# In-memory storage for patterns (to be replaced with a database in production)
patterns_db = {}

@router.post("/parse", response_model=ParseResponse)
async def parse_pattern(request: ParseRequest):
    """
    Parse a pattern DSL code and return the structured pattern data.
    """
    try:
        logger.info(f"Parsing pattern code: {request.pattern_code[:50]}...")
        
        # Initialize the parser
        parser = PatternParser()
        
        # Parse the pattern code
        pattern_data = parser.parse(request.pattern_code)
        
        return {
            "success": True,
            "pattern": pattern_data,
            "error": None
        }
    except Exception as e:
        logger.error(f"Error parsing pattern: {str(e)}")
        return {
            "success": False,
            "pattern": None,
            "error": str(e)
        }

@router.get("/instruments")
async def get_instruments():
    """
    Get a list of available instruments.
    """
    # This would be replaced with actual instrument data from a database or file
    instruments = {
        "piano": ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
        "synth": ["Kick", "Snare", "HiHat", "Crash", "Tom"],
        "guitar": ["E2", "A2", "D3", "G3", "B3", "E4"]
    }
    
    return instruments

@router.post("/patterns")
async def save_pattern(pattern: Pattern, name: str):
    """
    Save a pattern to the database.
    """
    try:
        import uuid
        from datetime import datetime
        
        # Generate a unique ID for the pattern
        pattern_id = str(uuid.uuid4())
        
        # Save the pattern to the in-memory database
        patterns_db[pattern_id] = {
            "id": pattern_id,
            "name": name,
            "pattern": pattern,
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "pattern_id": pattern_id,
            "error": None
        }
    except Exception as e:
        logger.error(f"Error saving pattern: {str(e)}")
        return {
            "success": False,
            "pattern_id": None,
            "error": str(e)
        }

@router.get("/patterns/{pattern_id}")
async def load_pattern(pattern_id: str):
    """
    Load a pattern from the database.
    """
    try:
        if pattern_id not in patterns_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pattern not found"
            )
        
        return {
            "success": True,
            "pattern": patterns_db[pattern_id]["pattern"],
            "error": None
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error loading pattern: {str(e)}")
        return {
            "success": False,
            "pattern": None,
            "error": str(e)
        }

@router.get("/patterns")
async def list_patterns():
    """
    List all patterns in the database.
    """
    try:
        patterns = [
            {
                "id": pattern_id,
                "name": data["name"],
                "created_at": data["created_at"]
            }
            for pattern_id, data in patterns_db.items()
        ]
        
        return {
            "success": True,
            "patterns": patterns,
            "error": None
        }
    except Exception as e:
        logger.error(f"Error listing patterns: {str(e)}")
        return {
            "success": False,
            "patterns": [],
            "error": str(e)
        }