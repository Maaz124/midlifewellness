import { apiRequest } from './queryClient';

// Behavioral tracking utility for marketing funnel
export class BehaviorTracker {
  private leadId: number | null = null;
  private sessionId: string;
  private isTracking: boolean = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeFromStorage() {
    const storedLeadId = localStorage.getItem('leadId');
    if (storedLeadId) {
      this.leadId = parseInt(storedLeadId);
      this.isTracking = true;
    }
  }

  // Set lead ID for tracking
  setLeadId(leadId: number) {
    this.leadId = leadId;
    this.isTracking = true;
    localStorage.setItem('leadId', leadId.toString());
  }

  // Track various behavioral events
  async trackPageView(pageUrl: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'page_view',
        eventData: { 
          pageUrl,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }

  async trackButtonClick(buttonText: string, buttonId?: string, pageUrl?: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'button_click',
        eventData: {
          buttonText,
          buttonId,
          pageUrl: pageUrl || window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track button click:', error);
    }
  }

  async trackFormSubmit(formType: string, formData?: any) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'form_submit',
        eventData: {
          formType,
          formData: formData || {},
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track form submit:', error);
    }
  }

  async trackVideoWatch(videoTitle: string, watchPercentage: number) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'video_watched',
        eventData: {
          videoTitle,
          watchPercentage,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track video watch:', error);
    }
  }

  async trackDownload(downloadType: string, fileName?: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'download_completed',
        eventData: {
          downloadType,
          fileName,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  }

  async trackAssessmentStart(assessmentType: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'assessment_started',
        eventData: {
          assessmentType,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track assessment start:', error);
    }
  }

  async trackAssessmentCompletion(assessmentType: string, score: number) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'assessment_completed',
        eventData: {
          assessmentType,
          score,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track assessment completion:', error);
    }
  }

  async trackEmailOpen(emailType: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'email_opened',
        eventData: {
          emailType,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track email open:', error);
    }
  }

  async trackEmailClick(emailType: string, linkText?: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'email_clicked',
        eventData: {
          emailType,
          linkText,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track email click:', error);
    }
  }

  async trackSocialShare(platform: string, content: string) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'social_share',
        eventData: {
          platform,
          content,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track social share:', error);
    }
  }

  // Scroll depth tracking
  async trackScrollDepth(depth: number) {
    if (!this.isTracking || !this.leadId) return;

    try {
      await apiRequest('POST', '/api/track-behavior', {
        leadId: this.leadId,
        eventType: 'scroll_depth',
        eventData: {
          depth,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track scroll depth:', error);
    }
  }

  // Time on page tracking
  private pageStartTime: number = Date.now();

  trackPageExit() {
    if (!this.isTracking || !this.leadId) return;

    const timeOnPage = Date.now() - this.pageStartTime;
    
    try {
      // Use sendBeacon for page exit events to ensure they're sent
      const data = JSON.stringify({
        leadId: this.leadId,
        eventType: 'page_exit',
        eventData: {
          timeOnPage,
          pageUrl: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        sessionId: this.sessionId
      });

      navigator.sendBeacon('/api/track-behavior', data);
    } catch (error) {
      console.error('Failed to track page exit:', error);
    }
  }

  // Initialize page tracking
  initializePageTracking() {
    // Track page view on load
    this.trackPageView(window.location.pathname);

    // Track page exit
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.trackScrollDepth(scrollDepth);
      }
    });
  }

  // Stop tracking
  stopTracking() {
    this.isTracking = false;
    this.leadId = null;
    localStorage.removeItem('leadId');
  }

  // Check if tracking is active
  isTrackingActive(): boolean {
    return this.isTracking && this.leadId !== null;
  }
}

// Global instance
export const behaviorTracker = new BehaviorTracker();

// Auto-initialize page tracking if lead ID exists
if (behaviorTracker.isTrackingActive()) {
  behaviorTracker.initializePageTracking();
}