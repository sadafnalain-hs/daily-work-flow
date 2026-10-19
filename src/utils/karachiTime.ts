export function getKarachiCurrentTime(): {
  dateStr: string;
  timeStr: string;
  hour: number;
  minute: number;
  fullDate: Date;
  greeting: string;
} {
  const now = new Date();
  
  // Format in Asia/Karachi
  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    hour: 'numeric',
    hour12: false,
  });

  const minuteFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    minute: 'numeric',
  });

  const hour = parseInt(hourFormatter.format(now), 10);
  const minute = parseInt(minuteFormatter.format(now), 10);

  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening';
  } else if (hour >= 22 || hour < 5) {
    greeting = 'Good night';
  }

  return {
    dateStr: dateFormatter.format(now),
    timeStr: timeFormatter.format(now),
    hour,
    minute,
    fullDate: now,
    greeting,
  };
}

export function parseMinutesFromTimeString(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
}

export function checkScheduleOverlap(
  taskA: { id: string; startTime: string; endTime: string; title: string },
  taskB: { id: string; startTime: string; endTime: string; title: string }
): boolean {
  if (taskA.id === taskB.id) return false;
  const startA = parseMinutesFromTimeString(taskA.startTime);
  let endA = parseMinutesFromTimeString(taskA.endTime);
  if (endA === 0 && taskA.endTime.startsWith('00:00')) endA = 1440; // midnight end

  const startB = parseMinutesFromTimeString(taskB.startTime);
  let endB = parseMinutesFromTimeString(taskB.endTime);
  if (endB === 0 && taskB.endTime.startsWith('00:00')) endB = 1440;

  // Handle overnight crossover
  if (endA < startA) endA += 1440;
  if (endB < startB) endB += 1440;

  return Math.max(startA, startB) < Math.min(endA, endB);
}
