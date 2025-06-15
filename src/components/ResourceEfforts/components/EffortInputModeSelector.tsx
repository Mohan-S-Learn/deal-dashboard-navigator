
import React from 'react';
import { Button } from '@/components/ui/button';
import { EffortInputMode } from '../types';

interface EffortInputModeSelectorProps {
  mode: EffortInputMode;
  onModeChange: (mode: EffortInputMode) => void;
}

export const EffortInputModeSelector: React.FC<EffortInputModeSelectorProps> = ({
  mode,
  onModeChange
}) => {
  return (
    <div className="flex rounded-md overflow-hidden border">
      <Button
        variant={mode === 'year' ? 'default' : 'outline'}
        onClick={() => onModeChange('year')}
        className="rounded-none border-none"
      >
        By Year
      </Button>
      <Button
        variant={mode === 'month' ? 'default' : 'outline'}
        onClick={() => onModeChange('month')}
        className="rounded-none border-none border-l"
      >
        By Month
      </Button>
    </div>
  );
};
