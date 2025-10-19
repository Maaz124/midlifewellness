import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text' | 'light';
}

export function Logo({ className, size = 'md', variant = 'full' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 32, iconSize: 24, textSize: 'text-lg' },
    md: { width: 160, height: 40, iconSize: 32, textSize: 'text-xl' },
    lg: { width: 200, height: 48, iconSize: 40, textSize: 'text-2xl' },
    xl: { width: 240, height: 56, iconSize: 48, textSize: 'text-3xl' }
  };

  const { width, height, iconSize, textSize } = sizes[size];

  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Outer circle representing wholeness and balance */}
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#gradient1)"
        strokeWidth="3"
        fill="none"
        className="opacity-80"
      />
      
      {/* Inner petals representing growth and transformation */}
      <g transform="translate(50,50)">
        {/* Petal 1 - Mental wellness */}
        <path
          d="M0,-25 Q15,-35 25,-20 Q15,-5 0,-15 Q-15,-5 -25,-20 Q-15,-35 0,-25"
          fill="url(#gradient2)"
          className="opacity-90"
        />
        
        {/* Petal 2 - Physical wellness (rotated 120°) */}
        <path
          d="M0,-25 Q15,-35 25,-20 Q15,-5 0,-15 Q-15,-5 -25,-20 Q-15,-35 0,-25"
          fill="url(#gradient3)"
          className="opacity-90"
          transform="rotate(120)"
        />
        
        {/* Petal 3 - Cognitive wellness (rotated 240°) */}
        <path
          d="M0,-25 Q15,-35 25,-20 Q15,-5 0,-15 Q-15,-5 -25,-20 Q-15,-35 0,-25"
          fill="url(#gradient4)"
          className="opacity-90"
          transform="rotate(240)"
        />
      </g>
      
      {/* Center circle representing inner strength */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="url(#gradient5)"
        className="drop-shadow-sm"
      />
      
      {/* Subtle sparkles for transformation energy */}
      <circle cx="25" cy="25" r="2" fill="url(#gradient6)" className="opacity-60" />
      <circle cx="75" cy="25" r="1.5" fill="url(#gradient6)" className="opacity-70" />
      <circle cx="75" cy="75" r="2" fill="url(#gradient6)" className="opacity-60" />
      <circle cx="25" cy="75" r="1.5" fill="url(#gradient6)" className="opacity-70" />
      
      <defs>
        {/* Gradient definitions */}
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(261, 73%, 66%)" />
          <stop offset="50%" stopColor="hsl(14, 86%, 76%)" />
          <stop offset="100%" stopColor="hsl(140, 20%, 65%)" />
        </linearGradient>
        
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(261, 73%, 66%)" />
          <stop offset="100%" stopColor="hsl(261, 73%, 80%)" />
        </linearGradient>
        
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(14, 86%, 76%)" />
          <stop offset="100%" stopColor="hsl(14, 86%, 85%)" />
        </linearGradient>
        
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(140, 20%, 65%)" />
          <stop offset="100%" stopColor="hsl(140, 20%, 75%)" />
        </linearGradient>
        
        <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(142, 76%, 36%)" />
          <stop offset="100%" stopColor="hsl(142, 76%, 46%)" />
        </linearGradient>
        
        <linearGradient id="gradient6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(45, 93%, 47%)" />
          <stop offset="100%" stopColor="hsl(45, 93%, 57%)" />
        </linearGradient>
      </defs>
    </svg>
  );

  const LogoText = ({ isLight = false }: { isLight?: boolean }) => (
    <div className="flex flex-col leading-tight">
      <span className={`font-bold ${isLight 
        ? 'text-white' 
        : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-rose-400 to-sage-600'
      } ${textSize}`}>
        BloomAfter40
      </span>
      {size !== 'sm' && (
        <span className={`text-xs font-medium tracking-wide ${isLight ? 'text-gray-300' : 'text-gray-500'}`}>
          Mind-Body Reset
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <LogoIcon />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cn("flex items-center", className)}>
        <LogoText />
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div 
        className={cn("flex items-center gap-3", className)}
        style={{ width: width, height: height }}
      >
        <LogoIcon />
        <LogoText isLight={true} />
      </div>
    );
  }

  return (
    <div 
      className={cn("flex items-center gap-3", className)}
      style={{ width: width, height: height }}
    >
      <LogoIcon />
      <LogoText />
    </div>
  );
}

export default Logo;