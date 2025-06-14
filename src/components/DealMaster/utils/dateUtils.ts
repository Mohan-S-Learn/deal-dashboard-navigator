
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Check if it's in dd/mm/yyyy format
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const match = dateString.match(ddmmyyyyRegex);
  
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
    const year = parseInt(match[3], 10);
    
    const date = new Date(year, month, day);
    
    // Validate the date
    if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
      return date;
    }
  }
  
  return null;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const calculateDuration = (startDate: Date | null, endDate: Date | null): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate the difference in months more accurately
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months += end.getMonth() - start.getMonth();
  
  // If the end day is before the start day in the month, subtract 1
  if (end.getDate() < start.getDate()) {
    months--;
  }
  
  // Ensure we have at least 1 month if there's any time difference
  if (months <= 0 && end > start) {
    months = 1;
  }
  
  return Math.max(0, months);
};
