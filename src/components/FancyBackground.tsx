export default function FancyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-pulse delay-500"></div>
    </div>
  );
}
