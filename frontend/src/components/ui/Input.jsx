function Input({
    type = "text",
    placeholder,
    value,
    onChange,
    name,
  }) {
    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-zinc-700
          bg-zinc-800
          px-4
          py-3
          text-white
          placeholder:text-zinc-500
          outline-none
          transition
          duration-200
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500/20
        "
      />
    );
  }
  
  export default Input;