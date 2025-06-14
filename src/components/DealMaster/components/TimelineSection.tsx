
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from './DatePicker';
import { QuoteData } from '../types';

interface TimelineSectionProps {
  quoteData: QuoteData;
  onDateChange: (field: keyof QuoteData, date: Date | undefined) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ quoteData, onDateChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label>Knowledge Transition Start Date</Label>
          <DatePicker 
            value={quoteData.knowledge_transition_start_date} 
            onChange={(date) => onDateChange('knowledge_transition_start_date', date)}
            placeholder="Select start date"
          />
        </div>
        <div className="space-y-2">
          <Label>Knowledge Transition End Date</Label>
          <DatePicker 
            value={quoteData.knowledge_transition_end_date} 
            onChange={(date) => onDateChange('knowledge_transition_end_date', date)}
            placeholder="Select end date"
          />
        </div>
        <div className="space-y-2">
          <Label>Steady State Start Date</Label>
          <DatePicker 
            value={quoteData.steady_state_start_date} 
            onChange={(date) => onDateChange('steady_state_start_date', date)}
            placeholder="Select start date"
          />
        </div>
        <div className="space-y-2">
          <Label>Steady State End Date</Label>
          <DatePicker 
            value={quoteData.steady_state_end_date} 
            onChange={(date) => onDateChange('steady_state_end_date', date)}
            placeholder="Select end date"
          />
        </div>
        <div className="space-y-2">
          <Label>Overall Duration (Months)</Label>
          <Input 
            type="number" 
            value={quoteData.overall_duration_months || ''} 
            readOnly 
            className="bg-gray-50"
            placeholder="Auto-calculated"
          />
        </div>
      </CardContent>
    </Card>
  );
};
