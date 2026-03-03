function parseTimeToMinutes(timeStr) {
  // "09:30" -> 570
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function setDateMinutes(baseDate, minutesFromMidnight) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutesFromMidnight);
  return d;
}

function generateSlotsForDate(availability, date) {
  const startMin = parseTimeToMinutes(availability.startTime);
  const endMin = parseTimeToMinutes(availability.endTime);
  const duration = availability.slotDuration || 30;

  const slots = [];
  for (let t = startMin; t + duration <= endMin; t += duration) {
    const start = setDateMinutes(date, t);
    const end = setDateMinutes(date, t + duration);
    slots.push({ start, end });
  }
  return slots;
}

module.exports = { generateSlotsForDate };