export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};