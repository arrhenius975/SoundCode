from lark import Lark, Transformer, v_args
from typing import Dict, List, Any
import logging

from app.models.models import ImportStatement, NoteEvent, Pattern

# Configure logging
logger = logging.getLogger(__name__)

class PatternParser:
    """
    Parser for the pattern DSL.
    """
    def __init__(self):
        # Define the grammar for the pattern DSL
        self.grammar = r"""
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
        self.lark_parser = Lark(self.grammar, start="start", parser="lalr")
        
        # Create the transformer
        self.transformer = PatternTransformer()
    
    def parse(self, pattern_code: str) -> Pattern:
        """
        Parse a pattern DSL code and return a Pattern object.
        
        Args:
            pattern_code: The pattern DSL code to parse.
            
        Returns:
            A Pattern object representing the parsed pattern.
            
        Raises:
            Exception: If there is an error parsing the pattern.
        """
        try:
            # Parse the pattern code
            parse_tree = self.lark_parser.parse(pattern_code)
            
            # Transform the parse tree into a Pattern object
            pattern_data = self.transformer.transform(parse_tree)
            
            # Create a Pattern object
            pattern = Pattern(
                imports=pattern_data["imports"],
                patterns=pattern_data["patterns"]
            )
            
            return pattern
        except Exception as e:
            logger.error(f"Error parsing pattern: {str(e)}")
            raise Exception(f"Error parsing pattern: {str(e)}")


@v_args(inline=True)
class PatternTransformer(Transformer):
    """
    Transformer for the pattern DSL parse tree.
    """
    def start(self, *items):
        """
        Transform the start rule.
        """
        result = {"imports": [], "patterns": {}}
        
        for item in items:
            if isinstance(item, dict):
                if "import" in item:
                    result["imports"].append(item["import"])
                elif "block_type" in item:
                    result["patterns"][item["block_type"]] = item["statements"]
        
        return result
    
    def import_statement(self, instrument, module):
        """
        Transform an import statement.
        """
        # Remove quotes from module name
        module_str = str(module).strip('"')
        
        return {
            "import": ImportStatement(
                instrument=str(instrument),
                module=module_str
            )
        }
    
    def pattern_block(self, block_type, *statements):
        """
        Transform a pattern block.
        """
        return {
            "block_type": str(block_type),
            "statements": list(statements)
        }
    
    def statement(self, instrument, note, timestamp):
        """
        Transform a statement.
        """
        return NoteEvent(
            instrument=str(instrument),
            note=str(note),
            time=float(timestamp)
        )


# Example usage
if __name__ == "__main__":
    # Create a parser
    parser = PatternParser()
    
    # Example pattern code
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
    
    # Parse the pattern code
    pattern = parser.parse(pattern_code)
    
    # Print the pattern
    print(pattern)