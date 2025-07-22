interface LocationBubblesProps {
  locations: string[];
  className?: string; // אופציונלי, אם תרצי להוסיף מרווחים וכו'
}

export default function LocationBubbles({ locations, className = "" }: LocationBubblesProps) {
  if (!locations.length) return null;

  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {locations.map(location => (
        <div
          key={location}
          className="bg-blue-100 dark:bg-blue-900 text-sm rounded-full px-3 py-1"
        >
          {location}
        </div>
      ))}
    </div>
  );
}
