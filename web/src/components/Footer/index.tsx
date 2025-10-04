export default function Footer() {
  const year = new Date().getFullYear()
  return (
<footer className="mt-auto border-t border-border/30 glass backdrop-blur-xl">
      <div className="container-max py-5">
        {/* Centered content row */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-xs text-neutral-400">© {year} What is Life - Open Source Personal Use Only</div>
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
