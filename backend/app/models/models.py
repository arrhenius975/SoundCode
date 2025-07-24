from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ImportStatement(BaseModel):
    """
    Model for an import statement in the pattern DSL.
    """
    instrument: str
    module: str

class NoteEvent(BaseModel):
    """
    Model for a note event in a pattern.
    """
    instrument: str
    note: str
    time: float
    velocity: float = 1.0  # Default velocity
    duration: float = 0.5  # Default duration

class Pattern(BaseModel):
    """
    Model for a complete pattern.
    """
    imports: List[ImportStatement]
    patterns: Dict[str, List[NoteEvent]]

class ParseRequest(BaseModel):
    """
    Request model for the parse endpoint.
    """
    pattern_code: str = Field(..., description="The pattern DSL code to parse")

class ParseResponse(BaseModel):
    """
    Response model for the parse endpoint.
    """
    success: bool
    pattern: Optional[Pattern] = None
    error: Optional[str] = None

class SavePatternRequest(BaseModel):
    """
    Request model for the save pattern endpoint.
    """
    pattern: Pattern
    name: str

class PatternResponse(BaseModel):
    """
    Response model for the save pattern endpoint.
    """
    success: bool
    pattern_id: Optional[str] = None
    error: Optional[str] = None

class LoadPatternResponse(BaseModel):
    """
    Response model for the load pattern endpoint.
    """
    success: bool
    pattern: Optional[Pattern] = None
    error: Optional[str] = None

class PatternListItem(BaseModel):
    """
    Model for a pattern list item.
    """
    id: str
    name: str
    created_at: str

class PatternListResponse(BaseModel):
    """
    Response model for the list patterns endpoint.
    """
    success: bool
    patterns: List[PatternListItem] = []
    error: Optional[str] = None