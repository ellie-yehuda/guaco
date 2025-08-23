import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

type WaterFormData = {
  qty?: number;
  unit?: string;
};

interface TrackWaterModalProps {
  onClose: () => void;
  onSave: (data: WaterFormData) => void;
}

const TrackWaterModal = ({ onClose, onSave }: TrackWaterModalProps) => {
  const [formData, setFormData] = useState<WaterFormData>({
    qty: 250,
    unit: 'ml',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'unit' ? value : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Predefined water amounts
  const quickAmounts = [100, 250, 500, 750, 1000];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Water</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                id="qty"
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.qty === amount
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, qty: amount })}
                  >
                    {amount} ml
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackWaterModal;