
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parseDate, formatDate } from '../utils/dateUtils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = React.useState(formatDate(value));

  React.useEffect(() => {
    setInputValue(formatDate(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsedDate = parseDate(newValue);
    if (parsedDate) {
      onChange(parsedDate);
    } else if (newValue === '') {
      onChange(undefined);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    onChange(date);
    setInputValue(formatDate(date || null));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="dd/mm/yyyy"
            className="w-full pr-10"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            type="button"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border shadow-lg z-50" align="start">
        <Calendar 
          mode="single" 
          selected={value || undefined} 
          onSelect={handleCalendarSelect} 
          initialFocus 
        />
      </PopoverContent>
    </Popover>
  );
};
