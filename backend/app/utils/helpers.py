import logging
from typing import Dict, List, Any

# Configure logging
logger = logging.getLogger(__name__)

def format_error_response(error: Exception) -> Dict[str, Any]:
    """
    Format an error response.
    
    Args:
        error: The exception that occurred.
        
    Returns:
        A dictionary with the error details.
    """
    return {
        "success": False,
        "error": str(error)
    }

def validate_pattern_structure(pattern: Dict[str, Any]) -> bool:
    """
    Validate the structure of a pattern.
    
    Args:
        pattern: The pattern to validate.
        
    Returns:
        True if the pattern is valid, False otherwise.
    """
    try:
        # Check if the pattern has the required keys
        if "imports" not in pattern or "patterns" not in pattern:
            logger.error("Pattern is missing required keys")
            return False
        
        # Check if imports is a list
        if not isinstance(pattern["imports"], list):
            logger.error("Pattern imports is not a list")
            return False
        
        # Check if patterns is a dictionary
        if not isinstance(pattern["patterns"], dict):
            logger.error("Pattern patterns is not a dictionary")
            return False
        
        # Check each import
        for import_statement in pattern["imports"]:
            if not isinstance(import_statement, dict):
                logger.error("Import statement is not a dictionary")
                return False
            
            if "instrument" not in import_statement or "module" not in import_statement:
                logger.error("Import statement is missing required keys")
                return False
        
        # Check each pattern
        for pattern_type, notes in pattern["patterns"].items():
            if not isinstance(notes, list):
                logger.error(f"Pattern {pattern_type} is not a list")
                return False
            
            for note in notes:
                if not isinstance(note, dict):
                    logger.error("Note is not a dictionary")
                    return False
                
                if "instrument" not in note or "note" not in note or "time" not in note:
                    logger.error("Note is missing required keys")
                    return False
        
        return True
    except Exception as e:
        logger.error(f"Error validating pattern: {str(e)}")
        return False

def get_available_instruments() -> Dict[str, List[str]]:
    """
    Get a list of available instruments.
    
    Returns:
        A dictionary mapping instrument names to lists of available notes.
    """
    # This would be replaced with actual instrument data from a database or file
    return {
        "piano": ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
        "synth": ["Kick", "Snare", "HiHat", "Crash", "Tom"],
        "guitar": ["E2", "A2", "D3", "G3", "B3", "E4"]
    }