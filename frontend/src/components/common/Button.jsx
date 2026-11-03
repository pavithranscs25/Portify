const styles = {
  primary: 'bg-violet-600 text-white hover:bg-violet-500',
  secondary: 'border border-white/10 text-gray-200 hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-300 hover:bg-red-500/20',
}

function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant] || styles.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button