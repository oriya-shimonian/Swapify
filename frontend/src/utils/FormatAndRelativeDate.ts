export function getRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime(); // ⬅️ הפוך את כיוון הזמן

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat("he-IL", { numeric: "auto" });

  if (days >= 1) return rtf.format(-days, "day");
  if (hours >= 1) return rtf.format(-hours, "hour");
  if (minutes >= 1) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
}


export function getFormattedDate(date: Date) {
  return date.toLocaleString("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function getFormattedDateWithRelative(date: Date) {
  const exact = getFormattedDate(date);
  const relative = getRelativeTime(date);
  return `${relative} (${exact})`;
}
