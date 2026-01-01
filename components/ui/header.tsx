"use client";

import { useRef, useState, useEffect } from "react";

// Mario Cloud Component
const MarioCloud = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <div
    className={`absolute ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="relative">
      {/* Main cloud body */}
      <div className="w-24 h-10 bg-white rounded-full shadow-lg" />
      {/* Cloud bumps */}
      <div className="absolute -top-4 left-4 w-10 h-10 bg-white rounded-full" />
      <div className="absolute -top-6 left-10 w-12 h-12 bg-white rounded-full" />
      <div className="absolute -top-3 right-4 w-8 h-8 bg-white rounded-full" />
    </div>
  </div>
);

// Animated Coin
const Coin = ({ className }: { className?: string }) => (
  <div className={`coin ${className}`} />
);

// Question Block
const QuestionBlock = ({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) => {
  const [hit, setHit] = useState(false);
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`question-block ${sizeClasses[size]} ${hit ? 'block-hit' : ''} cursor-pointer ${className}`}
      onClick={() => {
        setHit(true);
        setTimeout(() => setHit(false), 200);
      }}
    />
  );
};

// Pipe Component
const MarioPipe = ({ height = 80, className = "" }: { height?: number; className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <div className="pipe-top w-20 h-6" />
    <div className="pipe w-16 mx-auto" style={{ height: `${height}px` }} />
  </div>
);

// Hill Component
const MarioHill = ({ width = 200, height = 80, className = "" }: { width?: number; height?: number; className?: string }) => (
  <div
    className={`mario-hill ${className}`}
    style={{ width: `${width}px`, height: `${height}px` }}
  />
);

const Header: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coinCount, setCoinCount] = useState(0);

  const collectCoin = () => {
    setCoinCount(prev => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[350px] md:min-h-[500px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #5c94fc 0%, #87ceeb 60%, #87ceeb 100%)',
      }}
    >
      {/* Floating Clouds - fewer on mobile */}
      <MarioCloud className="top-4 md:top-8 left-[5%] animate-float scale-50 md:scale-100" delay={0} />
      <MarioCloud className="hidden md:block top-16 left-[25%] animate-float scale-75" delay={1} />
      <MarioCloud className="top-2 md:top-6 left-[50%] md:left-[55%] animate-float scale-50 md:scale-100" delay={0.5} />
      <MarioCloud className="hidden md:block top-20 left-[75%] animate-float scale-90" delay={1.5} />
      <MarioCloud className="top-8 md:top-12 right-[5%] md:left-[90%] animate-float scale-40 md:scale-50" delay={2} />

      {/* Question Blocks - hidden on small mobile */}
      <div className="hidden sm:block absolute top-20 md:top-24 left-[15%] animate-float" style={{ animationDelay: '0.3s' }}>
        <QuestionBlock size="sm" className="md:!w-12 md:!h-12" />
      </div>
      <div className="hidden md:block absolute top-28 left-[70%] animate-float" style={{ animationDelay: '0.8s' }}>
        <QuestionBlock size="sm" />
      </div>

      {/* Decorative Coins - fewer on mobile */}
      <div className="absolute top-12 md:top-16 left-[30%] md:left-[40%] cursor-pointer active:scale-150 hover:scale-125 transition-transform" onClick={collectCoin}>
        <Coin />
      </div>
      <div className="hidden md:block absolute top-32 left-[60%] cursor-pointer hover:scale-125 transition-transform" onClick={collectCoin}>
        <Coin />
      </div>
      <div className="absolute top-16 md:top-20 right-[10%] md:left-[85%] cursor-pointer active:scale-150 hover:scale-125 transition-transform" onClick={collectCoin}>
        <Coin />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[350px] md:min-h-[500px] px-4">
        {/* Coin Counter */}
        {coinCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded">
            <Coin className="!w-4 !h-5 !animate-none" />
            <span className="font-pixel text-yellow-400 text-xs">x {coinCount}</span>
          </div>
        )}

        {/* Title in pixel style - mobile optimized */}
        <div className="text-center space-y-2 md:space-y-6">
          <h1 className="font-pixel text-xs sm:text-xl md:text-3xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)] md:drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            WELCOME TO
          </h1>
          <h2 className="font-pixel text-lg sm:text-3xl md:text-5xl text-mario-gold drop-shadow-[2px_2px_0_rgba(139,69,19,0.8)] md:drop-shadow-[4px_4px_0_rgba(139,69,19,0.8)]">
            FELIX WORLD
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-4">
            <QuestionBlock size="sm" />
            <p className="text-[8px] md:text-sm text-white font-pixel drop-shadow-[1px_1px_0_rgba(0,0,0,0.5)]">
              TAP TO EXPLORE
            </p>
            <QuestionBlock size="sm" />
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 max-w-2xl text-center px-4">
          <div className="bg-white/90 backdrop-blur p-4 md:p-6 border-4 border-mario-brown shadow-pixel-lg">
            <p className="text-sm md:text-base text-mario-brown leading-relaxed">
              Currently: Vibe coding and scaling an eCommerce company.
            </p>
            <p className="text-sm md:text-base text-mario-brown leading-relaxed mt-2">
              Before: Associate at Heartcore Capital, focused on dev tooling, infrastructure, and robotics.
            </p>
          </div>
        </div>

        {/* Social Links as Pipes - labels visible on mobile */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 md:gap-8 pb-2 md:pb-4">
          <a
            href="https://github.com/tfbecker"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center min-w-[44px] min-h-[44px]"
          >
            <span className="font-pixel text-[6px] md:text-xs text-white mb-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              GH
            </span>
            <div className="pipe-warp relative overflow-visible">
              {/* Piranha Plant inside pipe */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-lg md:text-xl piranha-plant hidden md:block">🌱</div>
              <div className="pipe-top w-10 md:w-16 h-3 md:h-5" />
              <div className="pipe w-8 md:w-12 h-6 md:h-12 mx-auto" />
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/felix-becker-2ba413140/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center min-w-[44px] min-h-[44px]"
          >
            <span className="font-pixel text-[6px] md:text-xs text-white mb-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              LI
            </span>
            <div className="pipe-warp">
              <div className="pipe-top w-10 md:w-16 h-3 md:h-5" />
              <div className="pipe w-8 md:w-12 h-8 md:h-16 mx-auto" />
            </div>
          </a>
          <a
            href="https://x.com/fffbecker"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center min-w-[44px] min-h-[44px]"
          >
            <span className="font-pixel text-[6px] md:text-xs text-white mb-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              X
            </span>
            <div className="pipe-warp">
              <div className="pipe-top w-10 md:w-16 h-3 md:h-5" />
              <div className="pipe w-8 md:w-12 h-5 md:h-8 mx-auto" />
            </div>
          </a>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center min-w-[44px] min-h-[44px]"
          >
            <span className="font-pixel text-[6px] md:text-xs text-white mb-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
              RSS
            </span>
            <div className="pipe-warp">
              <div className="pipe-top w-10 md:w-16 h-3 md:h-5" />
              <div className="pipe w-8 md:w-12 h-10 md:h-20 mx-auto" />
            </div>
          </a>
        </div>
      </div>

      {/* Ground at bottom - smaller on mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-8 md:h-16 ground-pattern" />

      {/* Decorative hills - hidden on mobile */}
      <div className="hidden md:block absolute bottom-16 left-[5%]">
        <MarioHill width={150} height={60} />
      </div>
      <div className="hidden md:block absolute bottom-16 right-[10%]">
        <MarioHill width={100} height={40} />
      </div>
    </div>
  );
};

export { Header };
