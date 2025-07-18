
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
  
  // Ensure end date is after start date
  if (end <= start) return 0;
  
  // Calculate the difference in months more accurately
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  // Total months calculation
  let totalMonths = years * 12 + months;
  
  // If the end day is before the start day, we haven't completed a full month yet
  if (days < 0) {
    totalMonths--;
  }
  
  // Add one month to include both start and end months
  totalMonths = totalMonths + 1;
  
  // Ensure minimum of 1 month
  return Math.max(totalMonths, 1);
};
