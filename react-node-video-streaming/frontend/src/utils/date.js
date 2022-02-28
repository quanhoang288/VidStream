import { intervalToDuration } from 'date-fns';

const convertToDateDistance = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const { years, months, days, hours, minutes } = intervalToDuration({
    start: dateObj,
    end: new Date(),
  });

  if (years > 0) {
    return `${years}y`;
  }
  if (months > 0) {
    return `${months}mo`;
  }
  if (days > 0) {
    return days > 6 ? `${Math.floor(days / 7)}w` : `${days}d`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return 'just now';
};

export { convertToDateDistance };
