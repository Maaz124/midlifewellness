import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        // Check for existing cookie
        const cookies = document.cookie.split(';');
        const googtrans = cookies.find(c => c.trim().startsWith('googtrans='));
        if (googtrans) {
            const lang = googtrans.split('=')[1];
            if (lang === '/en/ar') {
                setLanguage('ar');
            }
        }
    }, []);

    const handleLanguageChange = (lang: string) => {
        if (lang === language) return;

        let cookieValue = '/en/en';
        if (lang === 'ar') {
            cookieValue = '/en/ar';
        }

        // Set cookie for google translate
        // We need to set it for the domain and path to ensure it's picked up
        const domain = window.location.hostname;
        document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
        document.cookie = `googtrans=${cookieValue}; path=/;`;

        // Also clear the legacy cookie if it exists to avoid conflicts
        if (lang === 'en') {
            // Sometimes clearing is better than setting to /en/en, but /en/en usually works to "reset"
        }

        setLanguage(lang);
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 w-full justify-start md:w-auto md:justify-center">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <span className="ml-2">
                        {language === 'en' ? 'English' : 'Arabic'}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="notranslate">
                <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="notranslate">
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange('ar')} className="notranslate">
                    Arabic
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
