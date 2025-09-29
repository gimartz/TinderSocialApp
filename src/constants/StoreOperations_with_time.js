/**
 * Convert 12-hour time string (e.g., "9:00 AM", "12:30 PM") to 24-hour "HH:mm" format (e.g., "09:00", "12:30").
 * Returns empty string if input invalid or empty.
 */
const formatTimeTo24Hour = (timeStr) => {
  if (!timeStr) return '';
  // Match with regex capturing hour, minute and AM/PM parts
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return ''; // Invalid format

  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hour !== 12) {
    hour += 12;
  } else if (meridiem === 'AM' && hour === 12) {
    hour = 0;
  }
  // Pad with leading zero if needed
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;

  return `${hourStr}:${minute}`;
};

/**
 * Map days array to openingHours object with formatted times.
 */
const mapDaysToOpeningHours = (daysArray) => {
  const dayKeys = {
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday',
    Sunday: 'sunday',
  };

  if (daysArray.length === 1 && daysArray[0].day === 'Default') {
    const open = formatTimeTo24Hour(daysArray[0].open);
    const close = formatTimeTo24Hour(daysArray[0].close);

    return {
      monday: { open, close },
      tuesday: { open, close },
      wednesday: { open, close },
      thursday: { open, close },
      friday: { open, close },
      saturday: { open, close },
      sunday: { open, close },
    };
  }

  // For multiple selected days
  const openingHours = {
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' },
  };

  daysArray.forEach(({ day, open, close }) => {
    const key = dayKeys[day];
    if (key) {
      openingHours[key] = {
        open: formatTimeTo24Hour(open),
        close: formatTimeTo24Hour(close),
      };
    }
  });

  return openingHours;
};

export { formatTimeTo24Hour, mapDaysToOpeningHours };
