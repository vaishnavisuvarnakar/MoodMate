import Link from "next/link";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-surface-lowest rounded-3xl p-6 border border-outline-variant/30 ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-5 py-2.5 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-primary-container text-on-primary-container hover:scale-[1.02]",
    secondary: "bg-secondary-container text-on-secondary-container hover:scale-[1.02]",
    ghost: "bg-surface-container text-on-surface hover:scale-[1.02]",
    danger: "bg-error-container text-on-error-container hover:scale-[1.02]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold text-sm px-5 py-2.5 transition-transform hover:scale-[1.02]";
  const variants: Record<string, string> = {
    primary: "bg-primary-container text-on-primary-container",
    secondary: "bg-secondary-container text-on-secondary-container",
    ghost: "bg-surface-container text-on-surface",
  };
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function FAB({ onClick, label = "Add" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-20 md:bottom-8 right-6 md:right-10 w-14 h-14 rounded-full bg-primary-container text-on-primary-container shadow-lg flex items-center justify-center text-2xl font-bold hover:scale-105 active:scale-95 transition-transform z-20"
    >
      +
    </button>
  );
}
