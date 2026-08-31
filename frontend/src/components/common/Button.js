import Link from "next/link";

const styles = {
  flat: "bg-button text-white border border-button hover:bg-white hover:text-button",
  border: "bg-transparent text-white border border-white hover:bg-white hover:text-black",
  "bottom-line": "bg-transparent text-black border-b border-black",
  dark: "bg-black text-white border border-black hover:bg-white hover:text-black",
};

export default function Button({
  href,
  children,
  variant = "flat",
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-medium uppercase tracking-wide transition-colors duration-300 whitespace-nowrap";
  const classes = `${base} ${styles[variant] || styles.flat} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}
