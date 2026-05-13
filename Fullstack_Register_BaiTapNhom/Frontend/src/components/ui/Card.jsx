const Card = ({ children }) => {
  return (
    <div
      className="
        w-full
        max-w-md
        bg-white
        shadow-xl
        rounded-2xl
        p-8
      "
    >
      {children}
    </div>
  );
};

export default Card;
