function PortfolioForm({ children, className = '', onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit?.(event)
  }

  return <form className={className} onSubmit={handleSubmit}>{children}</form>
}

export default PortfolioForm