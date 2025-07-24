import useStudioStore from '../store/useStudioStore';
import { updateEq } from '../utils/audioEngine';

export default function EqControls() {
  const { eq, setEq } = useStudioStore();
  
  const handleEqChange = (band, value) => {
    const newEq = { ...eq, [band]: value };
    setEq(newEq);
    updateEq(newEq);
  };
  
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">EQ</h2>
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <span>Low</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.low}
            onChange={(e) => handleEqChange('low', parseInt(e.target.value, 10))}
            className="eq-slider"
            aria-label="Low frequency EQ"
          />
          <span>{eq.low} dB</span>
        </div>
        <div className="flex flex-col items-center">
          <span>Mid</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.mid}
            onChange={(e) => handleEqChange('mid', parseInt(e.target.value, 10))}
            className="eq-slider"
            aria-label="Mid frequency EQ"
          />
          <span>{eq.mid} dB</span>
        </div>
        <div className="flex flex-col items-center">
          <span>High</span>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={eq.high}
            onChange={(e) => handleEqChange('high', parseInt(e.target.value, 10))}
            className="eq-slider"
            aria-label="High frequency EQ"
          />
          <span>{eq.high} dB</span>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-400">
        Adjust the EQ to shape the sound of the instruments.
      </div>
    </div>
  );
}