export const humanizeTime = (supabaseTime: string) => {
  const option: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Europe/London',
  };

  return new Date(supabaseTime).toLocaleDateString(undefined, option);
};
