interface AppButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const AppButton = ({
  onClick,
  children,
  className = "",
  type = "button",
  disabled = false,
}: AppButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg
                ${className}`}
    >
      {children}
    </button>
  );
};

export default AppButton;
