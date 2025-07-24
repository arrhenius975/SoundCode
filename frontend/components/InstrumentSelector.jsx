import { useEffect, useState } from 'react';
import useStudioStore from '../store/useStudioStore';
import { getInstruments } from '../utils/apiClient';

const DEFAULT_INSTRUMENTS = [
  { id: 'piano', name: 'Piano' },
  { id: 'synth', name: 'Synth' },
  { id: 'guitar', name: 'Guitar' },
];

export default function InstrumentSelector() {
  const { selectedInstrument, setSelectedInstrument } = useStudioStore();
  const [instruments, setInstruments] = useState(DEFAULT_INSTRUMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await getInstruments();
        
        // Transform the data into the format we need
        const instrumentList = Object.keys(data).map((id) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
        }));
        
        setInstruments(instrumentList);
      } catch (error) {
        console.error('Error fetching instruments:', error);
        setError('Failed to load instruments');
        // Fall back to default instruments
        setInstruments(DEFAULT_INSTRUMENTS);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInstruments();
  }, []);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Instruments</h2>
      
      {isLoading && (
        <div className="text-gray-400 mb-2">Loading instruments...</div>
      )}
      
      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {instruments.map((instrument) => (
          <button
            key={instrument.id}
            className={`px-4 py-2 rounded ${
              selectedInstrument === instrument.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
            onClick={() => setSelectedInstrument(instrument.id)}
            aria-pressed={selectedInstrument === instrument.id}
          >
            {instrument.name}
          </button>
        ))}
      </div>
    </div>
  );
}