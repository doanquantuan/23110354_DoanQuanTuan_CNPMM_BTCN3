const Alert = ({ message, type = "success" }) => {
  const styles = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div
      className={`
        p-3
        rounded-lg
        mb-4
        ${styles[type]}
      `}
    >
      {message}
    </div>
  );
};

export default Alert;
