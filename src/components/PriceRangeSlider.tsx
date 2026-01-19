import { useState, useEffect } from 'react';

interface PriceRangeSliderProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function PriceRangeSlider({ 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange,
  min = 0,
  max = 2000
}: PriceRangeSliderProps) {
  const [minInput, setMinInput] = useState(minValue.toString());
  const [maxInput, setMaxInput] = useState(maxValue.toString());

  useEffect(() => {
    setMinInput(minValue.toString());
  }, [minValue]);

  useEffect(() => {
    setMaxInput(maxValue.toString());
  }, [maxValue]);

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxValue - 1);
    if (onMinChange) {
      onMinChange(value);
    }
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minValue + 1);
    if (onMaxChange) {
      onMaxChange(value);
    }
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinInput(e.target.value);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxInput(e.target.value);
  };

  const handleMinInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleMaxInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const handleMinInputBlur = () => {
    const value = Number(minInput);
    if (!isNaN(value)) {
      const clampedValue = Math.max(min, Math.min(value, maxValue - 1));
      if (onMinChange) {
        onMinChange(clampedValue);
      }
      setMinInput(clampedValue.toString());
    } else {
      setMinInput(minValue.toString());
    }
  };

  const handleMaxInputBlur = () => {
    const value = Number(maxInput);
    if (!isNaN(value)) {
      const clampedValue = Math.min(max, Math.max(value, minValue + 1));
      if (onMaxChange) {
        onMaxChange(clampedValue);
      }
      setMaxInput(clampedValue.toString());
    } else {
      setMaxInput(maxValue.toString());
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-300 p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Price Range Slider</h2>
      
      <div className="relative h-2 mb-6">
        {/* Background track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>
        
        {/* Active gradient track */}
        <div 
          className="absolute h-2 rounded-full"
          style={{
            background: 'linear-gradient(to right, #FF9100, #FFC94C)',
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`
          }}
        ></div>
        
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={handleMinSliderChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
        />
        
        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={handleMaxSliderChange}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>
      
      {/* Min and Max labels */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Min:</span>
          <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 bg-white">
            <span className="text-sm">$</span>
            <input
              type="number"
              value={minInput}
              onChange={handleMinInputChange}
              onBlur={handleMinInputBlur}
              onKeyDown={handleMinInputKeyDown}
              className="w-16 text-sm outline-none ml-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Max:</span>
          <div className="flex items-center border border-gray-300 rounded px-3 py-1.5 bg-white">
            <span className="text-sm">$</span>
            <input
              type="number"
              value={maxInput}
              onChange={handleMaxInputChange}
              onBlur={handleMaxInputBlur}
              onKeyDown={handleMaxInputKeyDown}
              className="w-16 text-sm outline-none ml-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}