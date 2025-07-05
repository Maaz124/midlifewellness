import { useEffect } from 'react';
import { updatePageSEO, type SEOProps, pageSEO } from '@/lib/seo';

export function useSEO(pageKey: keyof typeof pageSEO | SEOProps) {
  useEffect(() => {
    updatePageSEO(pageKey);
  }, [pageKey]);
}

export function usePageSEO(title: string, description: string, keywords?: string) {
  useEffect(() => {
    updatePageSEO({
      title,
      description,
      keywords
    });
  }, [title, description, keywords]);
}