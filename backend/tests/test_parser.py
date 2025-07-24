import pytest
from app.services.parser import PatternParser
from app.models.models import Pattern, ImportStatement, NoteEvent

def test_parser_initialization():
    """
    Test that the parser can be initialized.
    """
    parser = PatternParser()
    assert parser is not None

def test_parse_simple_pattern():
    """
    Test parsing a simple pattern.
    """
    parser = PatternParser()
    
    pattern_code = """
        import piano from "pianoset";
        
        melody {
            piano C4 0;
            piano E4 0.5;
            piano G4 1.0;
        }
    """
    
    pattern = parser.parse(pattern_code)
    
    assert isinstance(pattern, Pattern)
    assert len(pattern.imports) == 1
    assert pattern.imports[0].instrument == "piano"
    assert pattern.imports[0].module == "pianoset"
    
    assert "melody" in pattern.patterns
    assert len(pattern.patterns["melody"]) == 3
    
    assert pattern.patterns["melody"][0].instrument == "piano"
    assert pattern.patterns["melody"][0].note == "C4"
    assert pattern.patterns["melody"][0].time == 0.0
    
    assert pattern.patterns["melody"][1].instrument == "piano"
    assert pattern.patterns["melody"][1].note == "E4"
    assert pattern.patterns["melody"][1].time == 0.5
    
    assert pattern.patterns["melody"][2].instrument == "piano"
    assert pattern.patterns["melody"][2].note == "G4"
    assert pattern.patterns["melody"][2].time == 1.0

def test_parse_multiple_blocks():
    """
    Test parsing a pattern with multiple blocks.
    """
    parser = PatternParser()
    
    pattern_code = """
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
    """
    
    pattern = parser.parse(pattern_code)
    
    assert isinstance(pattern, Pattern)
    assert len(pattern.imports) == 2
    assert pattern.imports[0].instrument == "piano"
    assert pattern.imports[0].module == "pianoset"
    assert pattern.imports[1].instrument == "synth"
    assert pattern.imports[1].module == "synthset"
    
    assert "melody" in pattern.patterns
    assert "rhythm" in pattern.patterns
    
    assert len(pattern.patterns["melody"]) == 3
    assert len(pattern.patterns["rhythm"]) == 3
    
    assert pattern.patterns["melody"][0].instrument == "piano"
    assert pattern.patterns["melody"][0].note == "C4"
    assert pattern.patterns["melody"][0].time == 0.0
    
    assert pattern.patterns["rhythm"][0].instrument == "synth"
    assert pattern.patterns["rhythm"][0].note == "Kick"
    assert pattern.patterns["rhythm"][0].time == 0.0

def test_parse_invalid_pattern():
    """
    Test parsing an invalid pattern.
    """
    parser = PatternParser()
    
    pattern_code = """
        import piano from "pianoset";
        
        melody {
            piano C4 0;
            piano E4 0.5;
            piano G4 1.0
        }
    """
    
    with pytest.raises(Exception):
        parser.parse(pattern_code)

def test_parse_empty_pattern():
    """
    Test parsing an empty pattern.
    """
    parser = PatternParser()
    
    pattern_code = """
        import piano from "pianoset";
        
        melody {
        }
    """
    
    pattern = parser.parse(pattern_code)
    
    assert isinstance(pattern, Pattern)
    assert len(pattern.imports) == 1
    assert pattern.imports[0].instrument == "piano"
    assert pattern.imports[0].module == "pianoset"
    
    assert "melody" in pattern.patterns
    assert len(pattern.patterns["melody"]) == 0