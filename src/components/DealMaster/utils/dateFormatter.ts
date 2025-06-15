
export const formatDateForDatabase = (date: Date | null) => {
  console.log('Formatting date:', date, 'Type:', typeof date);
  
  if (!date) {
    console.log('Date is null or undefined');
    return null;
  }
  
  // Handle string dates that might come from inputs
  if (typeof date === 'string') {
    console.log('Date is string, converting to Date object');
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.log('String date is invalid:', date);
      return null;
    }
    date = parsedDate;
  }
  
  // Handle Date objects that have custom structure (from date pickers)
  if (date && typeof date === 'object' && '_type' in date && date._type === 'Date') {
    console.log('Date has custom structure, extracting value');
    const dateValue = (date as any).value;
    if (dateValue && dateValue.iso) {
      date = new Date(dateValue.iso);
    } else if (dateValue && typeof dateValue === 'number') {
      date = new Date(dateValue);
    } else {
      console.log('Cannot parse custom date structure:', date);
      return null;
    }
  }
  
  // Check if it's a valid Date object
  if (!(date instanceof Date)) {
    console.log('Date is not a Date object:', date, 'Type:', typeof date);
    return null;
  }
  
  if (isNaN(date.getTime())) {
    console.log('Date object is invalid:', date);
    return null;
  }
  
  // Format to YYYY-MM-DD for database
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formatted = `${year}-${month}-${day}`;
  
  console.log('Successfully formatted date:', date, '->', formatted);
  return formatted;
};
