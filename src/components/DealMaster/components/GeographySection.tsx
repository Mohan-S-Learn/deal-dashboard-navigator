
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Geography } from '../types';

interface GeographySectionProps {
  geographies: Geography[];
  selectedGeographies: number[];
  onGeographyChange: (geographyId: number, checked: boolean) => void;
}

export const GeographySection: React.FC<GeographySectionProps> = ({
  geographies,
  selectedGeographies,
  onGeographyChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geography & Service Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
          {geographies.map(geo => (
            <div key={geo.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`geo-${geo.id}`}
                checked={selectedGeographies.includes(geo.id)}
                onCheckedChange={(checked) => onGeographyChange(geo.id, checked as boolean)}
              />
              <Label htmlFor={`geo-${geo.id}`} className="text-sm">
                {geo.city}, {geo.country}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
