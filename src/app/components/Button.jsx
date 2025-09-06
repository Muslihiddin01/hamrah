import React from "react";

const Button = ({ children, variant = "primary", size = "md", ...props }) => {
  let baseClasses =
    "font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  let sizeClasses = "";
  switch (size) {
    case "sm":
      sizeClasses = "px-3 py-2 text-sm";
      break;
    case "md":
      sizeClasses = "px-4 py-2 text-base";
      break;
    case "lg":
      sizeClasses = "px-5 py-3 text-lg";
      break;
      case "full" : sizeClasses = "py-3 px-5 w-full"
  }

  let variantClasses = "";
  switch (variant) {
    case "primary":
      variantClasses =
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500";
      break;
    case "outline":
      variantClasses =
        "border border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500";
      break;
  }

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
