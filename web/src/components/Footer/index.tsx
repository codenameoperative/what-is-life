export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto border-t border-neutral-800/70 bg-black/70">
      <div className="container-max py-5">
        {/* Top row: left copyright, right community links */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-xs text-neutral-400"> {year} What is Life</div>
          <nav className="flex items-center gap-4 text-sm">
            <a
              href="#"
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="Join the official Discord (placeholder)"
            >
              Discord
            </a>
            <a
              href="#"
              className="text-neutral-300 hover:text-white transition-colors"
              aria-label="Visit the official Reddit (placeholder)"
            >
              Reddit
            </a>
          </nav>
        </div>

        {/* Bottom row: centered donation buttons */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-xl border border-neutral-800/70 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200 transition-colors cursor-default select-none"
            aria-label="Donate to keep the server running (placeholder)"
          >
            Donate (keep the server running)
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-xl border border-neutral-800/70 bg-neutral-900/60 hover:bg-neutral-900 hover:border-neutral-700 text-neutral-200 transition-colors cursor-default select-none"
            aria-label="Buy me a coffee (placeholder)"
          >
            Buy Me a Coffee
          </button>
        </div>
      </div>
    </footer>
  )
}
