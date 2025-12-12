export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'service';
  structuredData?: any;
}

export const defaultSEO: SEOProps = {
  title: "MidlifeRebalance - Mind-Body Reset for Women | Dr. Sidra Bukhari",
  description: "Transform your midlife journey with Dr. Sidra Bukhari's 6-week Mind-Body Reset program. Evidence-based wellness coaching for perimenopause, hormone balance, and mental clarity.",
  keywords: "midlife wellness, perimenopause support, hormone balance, women's health, mental clarity, stress management, CBT coaching, mindfulness training",
  image: "https://midliferebalance.com/og-image.jpg",
  url: "https://midliferebalance.com",
  type: "website"
};

export const pageSEO = {
  dashboard: {
    title: "Welcome to Your Wellness Journey - MidlifeRebalance",
    description: "Navigate midlife with confidence through personalized health insights, evidence-based coaching, and supportive tools designed specifically for women. Please note: This is a self-help coaching program, not medical advice. Consult your healthcare provider for serious mental health concerns.",
    keywords: "wellness dashboard, health tracking, midlife progress, women's health assessment"
  },
  coaching: {
    title: "The Mind Reset Method - 6-Week Program | MidlifeRebalance",
    description: "A 6-week transformational journey designed specifically for women navigating midlife transitions. Evidence-based coaching with CBT techniques, nervous system regulation, and wellness strategies.",
    keywords: "mind-body reset, 6-week program, CBT coaching, nervous system regulation, midlife wellness"
  },
  checkout: {
    title: "Secure Checkout - MidlifeRebalance Coaching Program",
    description: "Complete your purchase for the transformational 6-week Mind-Body Reset program. Secure payment with immediate access to Dr. Bukhari's wellness coaching.",
    keywords: "coaching program purchase, wellness investment, secure checkout, mind-body reset"
  },
  about: {
    title: "Meet Your Wellness Expert - Dr. Sidra Bukhari | MidlifeRebalance",
    description: "Discover the comprehensive medical expertise and transformational approach behind MidlifeRebalance's evidence-based wellness methodology.",
    keywords: "Dr. Sidra Bukhari, psychiatrist, women's wellness expert, CBT therapist"
  },
  journal: {
    title: "Daily Journal & Wellness Library - MidlifeRebalance",
    description: "Your personal space for reflection, growth, and accessing curated wellness resources. Track your thoughts, emotions, and insights throughout your journey.",
    keywords: "wellness journal, daily reflections, mood tracking, personal growth, midlife journaling"
  },
  progress: {
    title: "Progress & Insights - MidlifeRebalance",
    description: "Track your wellness transformation with detailed analytics and personalized insights. Visualize your progress with comprehensive charts and health assessment data.",
    keywords: "progress tracking, wellness analytics, health charts, goal achievement, transformation metrics"
  },
  guide: {
    title: "Understanding Perimenopause - Complete Guide | MidlifeRebalance",
    description: "A comprehensive guide to navigating the physiological, psychological, and cognitive changes during midlife. Learn about perimenopause symptoms, hormonal changes, and evidence-based coping strategies.",
    keywords: "perimenopause guide, perimenopause symptoms, hormonal changes, midlife women, menopause transition"
  },
  community: {
    title: "Community Support Resources - MidlifeRebalance",
    description: "Connect with thousands of women navigating perimenopause and midlife transitions through these trusted online communities and support organizations. All resources listed below are external platforms where you can find peer support, expert guidance, and shared experiences.",
    keywords: "perimenopause community, midlife support groups, women's health forums, menopause support, online communities"
  }
};

export function updatePageSEO(pageKey: keyof typeof pageSEO | SEOProps) {
  const seo = typeof pageKey === 'string' ? { ...defaultSEO, ...pageSEO[pageKey] } : { ...defaultSEO, ...pageKey };

  // Update document title
  document.title = seo.title || defaultSEO.title!;

  // Update meta description
  updateMetaTag('description', seo.description || defaultSEO.description!);
  updateMetaTag('keywords', seo.keywords || defaultSEO.keywords!);

  // Update Open Graph tags
  updateMetaProperty('og:title', seo.title || defaultSEO.title!);
  updateMetaProperty('og:description', seo.description || defaultSEO.description!);
  updateMetaProperty('og:image', seo.image || defaultSEO.image!);
  updateMetaProperty('og:url', seo.url || defaultSEO.url!);
  updateMetaProperty('og:type', seo.type || defaultSEO.type!);

  // Update Twitter tags
  updateMetaProperty('twitter:title', seo.title || defaultSEO.title!);
  updateMetaProperty('twitter:description', seo.description || defaultSEO.description!);
  updateMetaProperty('twitter:image', seo.image || defaultSEO.image!);

  // Update canonical URL
  updateCanonicalURL(seo.url || defaultSEO.url!);

  // Add structured data if provided
  if (seo.structuredData) {
    updateStructuredData(seo.structuredData);
  }
}

function updateMetaTag(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
}

function updateCanonicalURL(url: string) {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

function updateStructuredData(data: any) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"][data-dynamic]');
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

// SEO-optimized structured data templates
export const structuredDataTemplates = {
  course: (title: string, description: string, instructor: string, price: number) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": title,
    "description": description,
    "provider": {
      "@type": "Person",
      "name": instructor,
      "jobTitle": "Psychiatrist & Women's Wellness Coach"
    },
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "courseMode": "online",
    "educationalLevel": "beginner",
    "teaches": ["Stress Management", "Hormone Balance", "Mental Clarity", "Nervous System Regulation"]
  }),

  healthService: (serviceName: string, description: string) => ({
    "@context": "https://schema.org",
    "@type": "MedicalService",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "Person",
      "name": "Dr. Sidra Bukhari",
      "jobTitle": "Psychiatrist"
    },
    "serviceType": "Wellness Coaching",
    "areaServed": "Worldwide"
  }),

  faq: (questions: Array<{ question: string, answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  })
};