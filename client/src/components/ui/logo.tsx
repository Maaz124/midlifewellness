import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export function BloomAfter40Logo({ 
  size = 'md', 
  variant = 'full',
  className 
}: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl', 
    xl: 'text-4xl'
  };

  const LogoIcon = () => (
    <svg 
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9333ea" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      
      {/* Three overlapping petals representing mind, body, spirit */}
      <g fill="url(#logoGradient)">
        {/* Mind petal */}
        <path d="M50 20 C35 30, 35 50, 50 60 C65 50, 65 30, 50 20 Z" opacity="0.9" />
        
        {/* Body petal */}
        <path d="M30 45 C40 30, 60 30, 70 45 C60 60, 40 60, 30 45 Z" opacity="0.8" />
        
        {/* Spirit petal */}
        <path d="M50 40 C35 50, 35 70, 50 80 C65 70, 65 50, 50 40 Z" opacity="0.7" />
      </g>
      
      {/* Center circle representing balance */}
      <circle cx="50" cy="50" r="8" fill="url(#logoGradient)" opacity="0.9" />
    </svg>
  );

  const LogoText = () => (
    <div className={cn('font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent', textSizeClasses[size])}>
      BloomAfter40
    </div>
  );

  if (variant === 'icon') {
    return <LogoIcon />;
  }

  if (variant === 'text') {
    return <LogoText />;
  }

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <LogoIcon />
      <LogoText />
    </div>
  );
}