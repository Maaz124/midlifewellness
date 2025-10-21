import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Heart, 
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Smartphone,
  Facebook,
  UserPlus,
  BookOpen,
  Video,
  Mail
} from 'lucide-react';

interface ExternalCommunity {
  id: number;
  name: string;
  description: string;
  platform: string;
  type: 'forum' | 'facebook' | 'app' | 'organization';
  url: string;
  members?: string;
  features: string[];
  cost: 'free' | 'freemium' | 'paid';
  bestFor: string;
}

interface SupportOrganization {
  id: number;
  name: string;
  description: string;
  url: string;
  services: string[];
  founded?: string;
  reach?: string;
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('forums');

  // Real external communities from research
  const externalCommunities: ExternalCommunity[] = [
    {
      id: 1,
      name: "r/Menopause (Reddit)",
      description: "Active Reddit community where members discuss symptoms, struggles, and solutions. Great for real-time peer support and candid discussions.",
      platform: "Reddit",
      type: 'forum',
      url: "https://www.reddit.com/r/Menopause/",
      members: "100,000+",
      features: ["Anonymous posting", "Daily discussions", "Peer experiences", "Symptom sharing"],
      cost: 'free',
      bestFor: "Real-time peer support and candid discussions"
    },
    {
      id: 2,
      name: "National Menopause Foundation Community",
      description: "Safe, secure online community partnered with the National Menopause Foundation on the Inspire platform. Medical accuracy backed by healthcare organization.",
      platform: "Inspire.com",
      type: 'forum',
      url: "https://nationalmenopausefoundation.org/community/",
      members: "5,000+",
      features: ["Expert-moderated", "Medical accuracy", "Safe environment", "Daily activity"],
      cost: 'free',
      bestFor: "Evidence-based information and moderated support"
    },
    {
      id: 3,
      name: "Red Hot Mamas",
      description: "Nation's largest menopause education program (est. 1991), offered in 200+ hospitals/practices across US & Canada. Forums, educational resources, and monthly newsletter.",
      platform: "Web + Inspire",
      type: 'forum',
      url: "https://redhotmamas.org/",
      members: "50,000+",
      features: ["Educational resources", "Expert articles", "Local programs", "Monthly newsletter"],
      cost: 'free',
      bestFor: "Comprehensive education and nationwide community"
    },
    {
      id: 4,
      name: "Peanut Menopause",
      description: "Subset of popular women's social network Peanut. Connect with others based on your exact stage (perimenopause, menopause, postmenopause) in a private, mobile-first network.",
      platform: "Mobile App (iOS/Android)",
      type: 'app',
      url: "https://www.peanut-app.io/",
      members: "10,000+",
      features: ["Stage-specific matching", "Private network", "Mobile-first", "Live chat"],
      cost: 'free',
      bestFor: "Mobile users seeking stage-specific connections"
    },
    {
      id: 5,
      name: "Menopause Support Group (Facebook)",
      description: "Private Facebook group started by Gwen Harris with 11,000+ members from 80 countries. ~100 new member requests daily. Common topics include depression/anxiety, weight gain, and insomnia.",
      platform: "Facebook Private Group",
      type: 'facebook',
      url: "https://www.facebook.com/search/groups/?q=menopause%20support%20group",
      members: "11,000+",
      features: ["Daily peer support", "Global community", "Privacy settings", "Real-time responses"],
      cost: 'free',
      bestFor: "Facebook users seeking daily peer-to-peer support"
    },
    {
      id: 6,
      name: "Perimenopause Hub - Expert Advice and Peer Support",
      description: "Active Facebook community offering expert guidance alongside peer support. Regular live Q&A sessions with healthcare professionals.",
      platform: "Facebook Group",
      type: 'facebook',
      url: "https://www.facebook.com/groups/perimenohub/",
      members: "8,000+",
      features: ["Expert Q&A sessions", "Peer support", "Educational content", "Live events"],
      cost: 'free',
      bestFor: "Combining expert advice with community support"
    },
    {
      id: 7,
      name: "Menopause Matters Forums",
      description: "One of the most well-known online forums with daily member posts. Topics covered include HRT experiences, menopausal sex, symptoms, and treatments.",
      platform: "Web Forum",
      type: 'forum',
      url: "https://www.menopausematters.co.uk/forum.php",
      members: "15,000+",
      features: ["Daily posts", "HRT discussions", "Detailed symptom threads", "UK & international"],
      cost: 'free',
      bestFor: "In-depth discussions about specific symptoms and treatments"
    }
  ];

  const supportOrganizations: SupportOrganization[] = [
    {
      id: 1,
      name: "The Menopause Society (Formerly NAMS)",
      description: "Leading nonprofit organization dedicated to promoting women's health and wellness through all stages of midlife. Provides evidence-based information and resources.",
      url: "https://menopause.org/",
      services: ["Find a menopause practitioner", "Educational resources", "Clinical practice guidelines", "Certification programs"],
      founded: "1989",
      reach: "Global"
    },
    {
      id: 2,
      name: "Red Hot Mamas",
      description: "Nation's largest menopause education program with in-person meetings at 200+ hospitals and medical practices across US and Canada.",
      url: "https://redhotmamas.org/",
      services: ["Local support groups", "Educational programs", "Healthcare provider partnership", "Monthly newsletter"],
      founded: "1991",
      reach: "US & Canada"
    },
    {
      id: 3,
      name: "National Menopause Foundation",
      description: "Nonprofit organization providing education, support, and advocacy for women experiencing menopause. Partners with Inspire for online community support.",
      url: "https://nationalmenopausefoundation.org/",
      services: ["Online community", "Educational resources", "Research initiatives", "Advocacy programs"],
      reach: "National (US)"
    },
    {
      id: 4,
      name: "My Menopause Centre",
      description: "Free evidence-based support with monthly live Q&A sessions with experts and weekly peer support sessions.",
      url: "https://www.mymenopausecentre.com/",
      services: ["Free Facebook group", "Monthly expert Q&A", "Weekly live support sessions", "Educational resources"],
      reach: "International"
    }
  ];

  const localResources = [
    {
      id: 1,
      name: "Meetup.com - Menopause Support Groups",
      description: "Find in-person and virtual local menopause support groups in your area. Many cities have active groups meeting monthly.",
      url: "https://www.meetup.com/topics/menopause-support/",
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 2,
      name: "WorkLife Central Menopause Peer Support",
      description: "Bi-monthly virtual peer support sessions covering symptoms, treatment struggles, and work/life impact. Focused on working women.",
      url: "https://www.worklifecentral.com/Resource-Hub--Menopause.htm",
      icon: <Video className="w-5 h-5" />
    }
  ];

  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'forum': return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      case 'app': return <Smartphone className="w-5 h-5 text-purple-600" />;
      default: return <Globe className="w-5 h-5 text-green-600" />;
    }
  };

  const getCostBadge = (cost: string) => {
    const colors = {
      free: 'bg-green-100 text-green-800',
      freemium: 'bg-blue-100 text-blue-800',
      paid: 'bg-orange-100 text-orange-800'
    };
    return colors[cost as keyof typeof colors] || colors.free;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white" data-testid="heading-community">
          Community Support Resources
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Connect with thousands of women navigating perimenopause and midlife transitions through these trusted online communities and support organizations. All resources listed below are external platforms where you can find peer support, expert guidance, and shared experiences.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Note:</strong> These are external communities maintained by other organizations. Click the links to join discussions, find support groups, and connect with women worldwide.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forums" className="flex items-center gap-2" data-testid="tab-forums">
            <MessageCircle className="w-4 h-4" />
            Online Forums
          </TabsTrigger>
          <TabsTrigger value="organizations" className="flex items-center gap-2" data-testid="tab-organizations">
            <Users className="w-4 h-4" />
            Organizations
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2" data-testid="tab-social">
            <Heart className="w-4 h-4" />
            Social Communities
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2" data-testid="tab-local">
            <MapPin className="w-4 h-4" />
            Local Groups
          </TabsTrigger>
        </TabsList>

        {/* Online Forums Tab */}
        <TabsContent value="forums" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Online Forums & Discussion Boards</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join active online communities where you can ask questions, share experiences, and find support from women at similar life stages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalCommunities.filter(c => c.type === 'forum' || c.type === 'app').map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow" data-testid={`card-community-${community.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(community.type)}
                      <div>
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{community.platform}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getCostBadge(community.cost)}>
                      {community.cost}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{community.description}</p>
                  
                  {community.members && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{community.members} members</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {community.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Best for:</strong> {community.bestFor}
                    </p>
                  </div>

                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.open(community.url, '_blank')}
                    data-testid={`button-visit-${community.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Community
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Organizations Tab */}
        <TabsContent value="organizations" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Support Organizations</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Nonprofit organizations and educational programs providing evidence-based resources, professional guidance, and advocacy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {supportOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow" data-testid={`card-organization-${org.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        {org.name}
                      </CardTitle>
                      {org.founded && (
                        <CardDescription className="text-xs mt-1">
                          Founded {org.founded} • {org.reach}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{org.description}</p>
                  
                  <div className="space-y-2">
                    <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">Services Offered:</p>
                    <ul className="space-y-1">
                      {org.services.map((service, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.open(org.url, '_blank')}
                    data-testid={`button-visit-org-${org.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Social Communities Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Facebook Groups & Social Communities</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join private Facebook groups and social networks for daily peer support, expert Q&A sessions, and real-time discussions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalCommunities.filter(c => c.type === 'facebook').map((community) => (
              <Card key={community.id} className="hover:shadow-lg transition-shadow" data-testid={`card-social-${community.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Facebook className="w-6 h-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{community.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{community.platform}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getCostBadge(community.cost)}>
                      {community.cost}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{community.description}</p>
                  
                  {community.members && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{community.members} members</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {community.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs text-blue-900 dark:text-blue-300">
                      <strong>Best for:</strong> {community.bestFor}
                    </p>
                  </div>

                  <Button 
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(community.url, '_blank')}
                    data-testid={`button-visit-social-${community.id}`}
                  >
                    <Facebook className="w-4 h-4" />
                    Join on Facebook
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-300">
              <strong>Privacy Note:</strong> Most Facebook groups are private, requiring you to request to join. Your participation will only be visible to group members, not your general Facebook friends.
            </p>
          </div>
        </TabsContent>

        {/* Local Groups Tab */}
        <TabsContent value="local" className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Local Support Groups</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with women in your area through in-person meetups or location-based virtual support sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {localResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow" data-testid={`card-local-${resource.id}`}>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    {resource.icon}
                    {resource.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{resource.description}</p>
                  
                  <Button 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.open(resource.url, '_blank')}
                    data-testid={`button-visit-local-${resource.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Find Groups Near You
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-purple-900 dark:text-purple-300 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Tips for Finding Local Groups
            </h3>
            <ul className="space-y-2 text-sm text-purple-900 dark:text-purple-300">
              <li>• Check with your healthcare provider or local hospital for support group recommendations</li>
              <li>• Search community centers, women's health clinics, and wellness centers in your area</li>
              <li>• Many libraries and community colleges host free health-focused support groups</li>
              <li>• Ask your OBGYN or menopause specialist if they know of local resources</li>
              <li>• Use the Red Hot Mamas website to find programs at hospitals near you</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Info Card */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
            Why Join a Community?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <strong className="block mb-1">Reduce Isolation</strong>
              Connect with thousands of women experiencing similar symptoms and life changes.
            </div>
            <div>
              <strong className="block mb-1">Get Practical Tips</strong>
              Learn strategies that work from real women, not just textbooks.
            </div>
            <div>
              <strong className="block mb-1">Feel Validated</strong>
              Realize you're not alone and your experiences are completely normal.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
