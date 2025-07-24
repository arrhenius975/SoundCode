import { useEffect, useRef } from 'react';
import useStudioStore from '../store/useStudioStore';

export default function PatternVisualizer() {
  const { parsedPattern, currentTime } = useStudioStore();
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!parsedPattern || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Vertical lines (time divisions)
    for (let i = 0; i <= 16; i++) {
      const x = (i / 16) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines (note divisions)
    const patternTypes = Object.keys(parsedPattern.patterns);
    const rowHeight = height / Math.max(patternTypes.length, 1);
    
    patternTypes.forEach((type, index) => {
      const y = index * rowHeight;
      
      // Draw row label
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '14px sans-serif';
      ctx.fillText(type, 5, y + 20);
      
      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Draw notes
      parsedPattern.patterns[type].forEach((note) => {
        const x = (note.time / 16) * width;
        
        ctx.fillStyle = type === 'melody' 
          ? '#3b82f6' // blue
          : type === 'rhythm' 
            ? '#ef4444' // red
            : type === 'harmony' 
              ? '#10b981' // green
              : '#8b5cf6'; // purple
        
        ctx.beginPath();
        ctx.arc(x, y + rowHeight / 2, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    });
    
    // Draw playhead
    if (currentTime > 0) {
      const playheadX = (currentTime / 16) * width;
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
    }
  }, [parsedPattern, currentTime]);
  
  return (
    <div className="h-1/2">
      <h2 className="text-xl font-bold mb-2">Pattern Visualizer</h2>
      
      {!parsedPattern ? (
        <div className="flex items-center justify-center h-full border border-gray-700 rounded bg-gray-800">
          <p className="text-gray-400">
            Parse a pattern to see the visualization
          </p>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="w-full h-full border border-gray-700 rounded"
          width={800}
          height={300}
          aria-label="Visual representation of the musical pattern"
        ></canvas>
      )}
      
      <div className="mt-2 text-sm text-gray-400">
        The visualizer shows notes from each pattern section on a timeline.
      </div>
    </div>
  );
}