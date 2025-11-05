import { Link, useLocation } from "wouter";
import { Bell, Menu, X, Award } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCoachingProgress } from '@/hooks/use-coaching-progress';
import { coachingModules } from '@/lib/coaching-data';
import { Logo } from '@/components/logo';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/user-menu';

export function NavHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: coachingData } = useCoachingProgress();
  const { isAuthenticated } = useAuth();
  const completedComponentsList = (coachingData?.coachingProgress?.completedComponents || []) as string[];
  const totalCompleted = Array.isArray(completedComponentsList) ? completedComponentsList.length : 0;
  const totalComponents = (coachingModules || []).reduce((acc: number, m: any) => acc + (m.components?.length || 0), 0);

  // Calculate progress for each week (1-6)
  const weekProgress = useMemo(() => {
    const completedComponents = completedComponentsList;
    const progressMap: Record<number, number> = {};
    
    coachingModules.forEach(module => {
      const completedCount = module.components.filter(c => 
        completedComponents.includes(c.id)
      ).length;
      progressMap[module.weekNumber] = Math.round((completedCount / module.components.length) * 100);
    });
    
    return progressMap;
  }, [completedComponentsList]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fas fa-chart-line' },
    { path: '/coaching', label: 'Coaching', icon: 'fas fa-graduation-cap' },
    { path: '/perimenopause-guide', label: 'Guide', icon: 'fas fa-book-open' },
    { path: '/journal', label: 'Journal', icon: 'fas fa-book' },
    { path: '/progress', label: 'Progress', icon: 'fas fa-trophy' },
    { path: '/community', label: 'Community', icon: 'fas fa-users' },
    { path: '/about', label: 'About', icon: 'fas fa-user-md' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 mr-12">
            <Logo size="md" className="hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`pb-4 transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'text-primary font-medium border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <Link href="/contact-coaching">
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                data-testid="button-personal-coaching"
              >
                Personal Coaching
              </Button>
            </Link>
            {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2" data-testid="button-notifications">
                  <Bell className="h-5 w-5 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-coral-500" />
                    <span className="font-semibold">Achievements</span>
                  </div>
                </div>
                <div className="p-4 max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Week Progress Bars */}
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-3">Module Progress</div>
                      <div className="space-y-4">
                        {coachingModules.map((module) => {
                          const progress = weekProgress[module.weekNumber] || 0;
                          return (
                            <div key={module.id} className="space-y-2">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                  <Badge variant="outline" className="text-xs">
                                    Week {module.weekNumber} • {module.components.length} components
                                  </Badge>
                                  <span className="text-sm font-medium text-green-600">
                                    {progress}%
                                  </span>
                                </div>
                                <Progress value={progress} className="w-20 h-2" />
                              </div>
                              <p className="text-xs text-gray-500 ml-0">{module.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${item.icon} mr-2`}></i>
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact-coaching"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg transition-colors bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-center"
              >
                Personal Coaching
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
