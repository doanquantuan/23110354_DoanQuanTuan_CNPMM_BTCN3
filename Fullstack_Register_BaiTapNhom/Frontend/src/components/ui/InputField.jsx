const InputField = ({ label, type = "text", name, placeholder }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        className="
          w-full
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    </div>
  );
};

export default InputField;
