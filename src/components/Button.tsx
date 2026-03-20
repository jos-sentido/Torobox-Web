import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "white" | "outline-white";
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  fullWidth = false,
  disabled = false,
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200";
  
  const variants = {
    primary: "bg-brand-red hover:bg-brand-red-hover text-white px-6 py-3",
    secondary: "bg-brand-black hover:bg-brand-dark text-white px-6 py-3",
    outline: "border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-6 py-2.5",
    white: "bg-white text-brand-red hover:bg-gray-100 px-6 py-3",
    "outline-white": "border-2 border-white text-white hover:bg-white hover:text-brand-black px-6 py-2.5",
  };
  
  const combinedClasses = `${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${combinedClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={disabled}>
      {children}
    </button>
  );
}
