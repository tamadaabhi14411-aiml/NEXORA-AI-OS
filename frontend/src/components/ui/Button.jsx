function Button({
    children,
    type = "button",
    onClick,
    disabled = false,
    className = "",
  }) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full
          rounded-xl
          bg-blue-600
          px-4
          py-3
          font-semibold
          text-white
          transition-all
          duration-200
          hover:bg-blue-700
          active:scale-95
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
      >
        {children}
      </button>
    );
  }
  
  export default Button;