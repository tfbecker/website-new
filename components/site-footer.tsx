export function SiteFooter() {
  return (
    <footer className="relative">
      {/* Castle/End Level Design */}
      <div className="brick-pattern py-6 md:py-8 px-4 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-white">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-mario-gold rounded-full border-2 border-yellow-600 flex items-center justify-center font-pixel text-[8px] md:text-xs">
              F
            </div>
            <p className="font-pixel text-[8px] md:text-xs drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)] md:drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              GAME OVER - {new Date().getFullYear()}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-right">
            <p className="text-[10px] md:text-xs text-white/80">
              Design inspired by ansonyu.me
            </p>
            <a
              href="https://github.com/tfbecker/website-new"
              className="mario-btn px-3 py-2 min-h-[36px] md:min-h-[32px] text-[8px] flex items-center justify-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW CODE
            </a>
          </div>
        </div>

        {/* Decorative pipes at bottom - scaled for mobile */}
        <div className="flex justify-center gap-4 md:gap-8 mt-4 md:mt-6">
          <div className="flex flex-col items-center">
            <div className="pipe-top w-6 md:w-10 h-2 md:h-3" />
            <div className="pipe w-5 md:w-8 h-4 md:h-6" />
          </div>
          <div className="flex flex-col items-center">
            <div className="pipe-top w-6 md:w-10 h-2 md:h-3" />
            <div className="pipe w-5 md:w-8 h-6 md:h-10" />
          </div>
          <div className="flex flex-col items-center">
            <div className="pipe-top w-6 md:w-10 h-2 md:h-3" />
            <div className="pipe w-5 md:w-8 h-3 md:h-4" />
          </div>
        </div>

        {/* Thank you message */}
        <div className="text-center mt-4 md:mt-6">
          <p className="font-pixel text-[8px] md:text-xs text-mario-gold animate-pulse">
            THANK YOU FOR PLAYING!
          </p>
        </div>
      </div>

      {/* Ground at very bottom */}
      <div className="ground-pattern h-4" />
    </footer>
  )
}
