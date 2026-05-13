const Button = ({ children, type = "submit" }) => {
  return (
    <button
      type={type}
      className="
        w-full
        bg-blue-500
        hover:bg-blue-600
        text-white
        py-3
        rounded-lg
        transition
        duration-300
        font-medium
      "
    >
      {children}
    </button>
  );
};

export default Button;
