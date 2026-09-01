// Shared button styles so every page/form uses the same primary, secondary,
// and inline-link (edit/delete-style) treatments instead of one-off classes.

const VARIANTS = {
  primary: "bg-primary px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-white hover:bg-black",
  secondary:
    "border border-border-form px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-body hover:border-black hover:text-heading",
  link: "text-sm font-medium text-link hover:text-primary",
  linkDanger: "text-sm font-medium text-primary-text hover:text-primary",
};

export default function Button({ variant = "primary", className = "", type = "button", children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
