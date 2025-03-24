// src/utils/dateUtils.ts

/**
 * Format a date string for display
 * @param dateString ISO date string to format
 * @param timeOnly Only show the time portion (optional)
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  timeOnly: boolean = false
): string => {
  const date = new Date(dateString);

  if (timeOnly) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculate relative time (e.g. "2 hours ago", "in 3 days")
 * @param dateString ISO date string to format
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffMs < 0) {
    // Past
    if (diffSec > -60) return `${Math.abs(diffSec)} seconds ago`;
    if (diffMin > -60) return `${Math.abs(diffMin)} minutes ago`;
    if (diffHour > -24) return `${Math.abs(diffHour)} hours ago`;
    if (diffDay > -30) return `${Math.abs(diffDay)} days ago`;

    return formatDate(dateString);
  } else {
    // Future
    if (diffSec < 60) return `in ${diffSec} seconds`;
    if (diffMin < 60) return `in ${diffMin} minutes`;
    if (diffHour < 24) return `in ${diffHour} hours`;
    if (diffDay < 30) return `in ${diffDay} days`;

    return formatDate(dateString);
  }
};

/**
 * Check if a date is today
 * @param dateString ISO date string to check
 * @returns Boolean indicating if the date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Get duration between two dates in hours and minutes
 * @param startDateString Start date ISO string
 * @param endDateString End date ISO string
 * @returns Duration string (e.g. "2h 30m")
 */
export const getDuration = (
  startDateString: string,
  endDateString: string
): string => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 0 && diffMinutes > 0) {
    return `${diffHours}h ${diffMinutes}m`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else {
    return `${diffMinutes}m`;
  }
};
