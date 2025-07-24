import { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import useStudioStore from '../store/useStudioStore';
import { parsePattern } from '../utils/apiClient';

const DEFAULT_PATTERN = `import piano from "pianoset";
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
}`;

export default function PatternEditor() {
  const { patternCode, setPatternCode, setParsedPattern } = useStudioStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };
  
  const handleParsePattern = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const pattern = await parsePattern(patternCode || DEFAULT_PATTERN);
      setParsedPattern(pattern);
      
      // Show success message
      console.log('Pattern parsed successfully!');
    } catch (error) {
      console.error('Error parsing pattern:', error);
      
      // Set error state
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-1/2 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Pattern Editor</h2>
        <button 
          className={`px-4 py-2 rounded ${
            isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={handleParsePattern}
          disabled={isLoading}
        >
          {isLoading ? 'Parsing...' : 'Parse & Play'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-500 text-white p-2 mb-2 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="h-full border border-gray-700 rounded">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={patternCode || DEFAULT_PATTERN}
          onChange={setPatternCode}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-400">
        Write your pattern code here and click "Parse & Play" to hear it.
      </div>
    </div>
  );
}