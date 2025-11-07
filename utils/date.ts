

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayDateString = (): string => {
    return formatDate(new Date());
}

export const getDatesForLastYear = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Fix: Standardize to midnight
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date);
  }
  return dates.reverse();
};

export const getDatesForMonthView = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()); // Start from the Sunday of the first week

    // Create a 6-week (42-day) grid for a consistent calendar height
    for (let i = 0; i < 42; i++) {
        dates.push(new Date(startDate));
        startDate.setDate(startDate.getDate() + 1);
    }
    
    return dates;
};