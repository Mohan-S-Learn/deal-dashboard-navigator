
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface GeographyDuplicateAlertProps {
  duplicates: number[];
}

export const GeographyDuplicateAlert: React.FC<GeographyDuplicateAlertProps> = ({
  duplicates
}) => {
  if (duplicates.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-red-600 text-sm">
      <AlertTriangle className="h-4 w-4" />
      Duplicate locations detected. Please select different values.
    </div>
  );
};
