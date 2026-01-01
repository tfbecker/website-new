export function SiteFooter() {
  return (
    <footer className="relative">
      {/* Castle/End Level Design */}
      <div className="brick-pattern py-8 px-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mario-gold rounded-full border-2 border-yellow-600 flex items-center justify-center font-pixel text-xs">
              F
            </div>
            <p className="font-pixel text-xs drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              GAME OVER - {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
            <p className="text-xs text-white/80">
              Design inspired by ansonyu.me
            </p>
            <a
              href="https://github.com/tfbecker/website-new"
              className="mario-btn px-3 py-1 text-[8px]"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW CODE
            </a>
          </div>
        </div>

        {/* Decorative pipes at bottom */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex flex-col items-center">
            <div className="pipe-top w-10 h-3" />
            <div className="pipe w-8 h-6" />
          </div>
          <div className="flex flex-col items-center">
            <div className="pipe-top w-10 h-3" />
            <div className="pipe w-8 h-10" />
          </div>
          <div className="flex flex-col items-center">
            <div className="pipe-top w-10 h-3" />
            <div className="pipe w-8 h-4" />
          </div>
        </div>

        {/* Thank you message */}
        <div className="text-center mt-6">
          <p className="font-pixel text-xs text-mario-gold animate-pulse">
            THANK YOU FOR PLAYING!
          </p>
        </div>
      </div>

      {/* Ground at very bottom */}
      <div className="ground-pattern h-4" />
    </footer>
  )
}
