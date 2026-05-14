import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function Button({ children, href, variant = "primary", className, onClick, type = "button" }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-all duration-200";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-teal text-white hover:bg-teal-dark",
    secondary: "border-2 border-navy text-navy hover:bg-navy hover:text-white",
    ghost: "text-teal hover:underline",
  };

  if (href) {
    return <a href={href} className={cn(base, variants[variant], className)}>{children}</a>;
  }

  return <button type={type} onClick={onClick} className={cn(base, variants[variant], className)}>{children}</button>;
}
