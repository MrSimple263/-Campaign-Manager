import { useState, forwardRef } from "react";

const InputPassword = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} ref={ref} {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-indigo-600"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
});

export default InputPassword;
