const currentYear = new Date().getFullYear()

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-gray-500">
          © {currentYear} Portify. Build your digital identity.
        </p>

        <p className="text-sm text-gray-500">
          Made for developers ❤️
        </p>
      </div>
    </footer>
  )
}

export default Footer
