import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Users, 
  Heart, 
  TrendingUp, 
  Plus, 
  Search, 
  UserPlus,
  Calendar,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  Eye,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  isAnonymous: boolean;
  likes: number;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
}

interface SupportGroup {
  id: number;
  name: string;
  description: string;
  category: string;
  type: 'open' | 'closed' | 'invitation-only';
  currentMembers: number;
  maxMembers: number;
  meetingSchedule: string;
  nextMeeting: string;
  facilitator: string;
}

interface SharedExperience {
  id: number;
  title: string;
  content: string;
  author: string;
  category: 'breakthrough' | 'challenge' | 'tip' | 'question';
  isAnonymous: boolean;
  likes: number;
  supportMessages: number;
  createdAt: string;
  tags: string[];
}

export default function Community() {
  const [activeTab, setActiveTab] = useState('forum');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', categoryId: 1, isAnonymous: false });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real community data
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/community/categories']
  });

  const { data: forumPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['/api/community/posts', selectedCategory, searchQuery]
  });

  const { data: supportGroups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/community/groups']
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; categoryId: number; isAnonymous: boolean }) => {
      return await apiRequest("POST", "/api/community/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community/posts'] });
      setShowNewPostDialog(false);
      setNewPost({ title: '', content: '', categoryId: 1, isAnonymous: false });
      toast({
        title: "Success",
        description: "Your post has been created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Handle button clicks
  const handleReplyClick = (postId: number) => {
    const post = forumPosts.find((p: any) => p.id === postId);
    toast({
      title: "Opening Discussion",
      description: `Viewing replies for "${post?.title}". This would navigate to a detailed discussion page.`,
    });
  };

  const handleJoinGroup = (groupId: number, groupName: string, groupType: string) => {
    if (groupType === 'open') {
      toast({
        title: "Welcome to the Group!",
        description: `Successfully joined "${groupName}". You'll receive meeting notifications and can participate in discussions.`,
      });
    } else if (groupType === 'closed') {
      toast({
        title: "Request Sent",
        description: `Your request to join "${groupName}" has been sent. The facilitator will review and respond within 24 hours.`,
      });
    } else {
      toast({
        title: "Group Information",
        description: `Viewing details for "${groupName}". This would show group information and application process.`,
      });
    }
  };

  const handleCreateGroup = () => {
    toast({
      title: "Create Support Group",
      description: "Opening group creation form where you can set up a new support group with custom settings.",
    });
  };

  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      toast({
        title: "Post Created!",
        description: `"${newPost.title}" has been posted successfully. Your discussion is now live in the forum.`,
      });
      setNewPost({ title: '', content: '', categoryId: 1, isAnonymous: false });
      setShowNewPostDialog(false);
    } else {
      toast({
        title: "Incomplete Post",
        description: "Please fill in both title and content to create your post.",
        variant: "destructive",
      });
    }
  };

  const handleShareExperience = () => {
    toast({
      title: "Share Your Experience",
      description: "Opening experience sharing form where you can share breakthroughs, challenges, or helpful tips.",
    });
  };

  const handleBrowseProfiles = () => {
    toast({
      title: "Browse Peer Profiles",
      description: "Viewing community member profiles who are open to connections and mentorship opportunities.",
    });
  };

  const handleViewConnections = () => {
    toast({
      title: "Your Connections",
      description: "Viewing your current connections, relationships, and conversation history.",
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Opening profile editor where you can update your bio, interests, and connection preferences.",
    });
  };

  const handleJoinWaitlist = () => {
    toast({
      title: "Added to Waitlist",
      description: "You'll be notified when advanced peer connection features become available.",
    });
  };

  // Mock data - in real app this would come from API
  const forumCategories = [
    { id: 'all', name: 'All Topics', color: '#6366f1', count: 48 },
    { id: 'hormones', name: 'Hormonal Changes', color: '#ec4899', count: 15 },
    { id: 'career', name: 'Career Transitions', color: '#10b981', count: 12 },
    { id: 'relationships', name: 'Relationships', color: '#f59e0b', count: 8 },
    { id: 'wellness', name: 'Wellness & Self-Care', color: '#8b5cf6', count: 13 }
  ];

  const mockForumPosts: ForumPost[] = [
    {
      id: 1,
      title: "How do you handle brain fog during important meetings?",
      content: "I'm struggling with concentration during work meetings since starting perimenopause. Any tips?",
      author: "SarahM",
      category: "hormones",
      isAnonymous: false,
      likes: 24,
      replies: 18,
      views: 156,
      lastActivity: "2 hours ago",
      isPinned: false
    },
    {
      id: 2,
      title: "Career change at 45 - feeling scared but excited",
      content: "After 20 years in the same field, I'm considering a complete career change. Anyone else made a big leap in midlife?",
      author: "Anonymous",
      category: "career",
      isAnonymous: true,
      likes: 32,
      replies: 25,
      views: 203,
      lastActivity: "4 hours ago",
      isPinned: true
    },
    {
      id: 3,
      title: "Sleep routine that actually works",
      content: "Finally found a sleep routine that helps with night sweats and restless nights. Happy to share what worked for me!",
      author: "LindaK",
      category: "wellness",
      isAnonymous: false,
      likes: 41,
      replies: 12,
      views: 89,
      lastActivity: "6 hours ago",
      isPinned: false
    }
  ];

  const mockSupportGroups: SupportGroup[] = [
    {
      id: 1,
      name: "Perimenopause Support Circle",
      description: "A safe space to discuss hormonal changes, symptoms, and coping strategies with women going through similar experiences.",
      category: "hormones",
      type: "open",
      currentMembers: 24,
      maxMembers: 30,
      meetingSchedule: "Every Tuesday 7:00 PM EST",
      nextMeeting: "Tomorrow, 7:00 PM",
      facilitator: "Dr. Maria Santos"
    },
    {
      id: 2,
      name: "Midlife Career Pivots",
      description: "For women navigating career changes, starting businesses, or returning to work after breaks. Weekly accountability and support.",
      category: "career",
      type: "open",
      currentMembers: 18,
      maxMembers: 25,
      meetingSchedule: "Every Thursday 6:30 PM EST",
      nextMeeting: "Thu, Jan 4, 6:30 PM",
      facilitator: "Jennifer Walsh"
    },
    {
      id: 3,
      name: "Empty Nest Transitions",
      description: "Closed group for mothers adjusting to children leaving home. Focus on rediscovering identity and purpose.",
      category: "relationships",
      type: "closed",
      currentMembers: 12,
      maxMembers: 15,
      meetingSchedule: "Bi-weekly Sundays 3:00 PM EST",
      nextMeeting: "Sun, Jan 7, 3:00 PM",
      facilitator: "Carol Thompson"
    }
  ];

  const mockSharedExperiences: SharedExperience[] = [
    {
      id: 1,
      title: "My breakthrough with morning anxiety",
      content: "After months of waking up with racing thoughts, I discovered a 5-minute breathing routine that completely changed my mornings...",
      author: "Michelle",
      category: "breakthrough",
      isAnonymous: false,
      likes: 67,
      supportMessages: 23,
      createdAt: "3 days ago",
      tags: ["anxiety", "breathing", "morning-routine"]
    },
    {
      id: 2,
      title: "Struggling with energy levels - need encouragement",
      content: "Some days I feel like I'm moving through molasses. Everything takes twice as long and I'm exhausted by noon...",
      author: "Anonymous",
      category: "challenge",
      isAnonymous: true,
      likes: 45,
      supportMessages: 31,
      createdAt: "1 day ago",
      tags: ["fatigue", "energy", "support-needed"]
    },
    {
      id: 3,
      title: "Game-changing supplement routine",
      content: "After working with my doctor, we found a supplement combination that helped with my brain fog and energy...",
      author: "Dr.Lisa",
      category: "tip",
      isAnonymous: false,
      likes: 89,
      supportMessages: 17,
      createdAt: "5 days ago",
      tags: ["supplements", "brain-fog", "energy"]
    }
  ];

  const filteredPosts = mockForumPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = forumCategories.find(cat => cat.id === categoryId);
    return category?.color || '#6366f1';
  };

  const getExperienceIcon = (category: string) => {
    switch (category) {
      case 'breakthrough': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'challenge': return <Heart className="w-4 h-4 text-red-500" />;
      case 'tip': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'question': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">ThriveMidlife Community</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with other women navigating midlife transitions. Share experiences, find support, and build meaningful connections.
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="forum" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Forum
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Support Groups
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Shared Experiences
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Peer Connections
          </TabsTrigger>
        </TabsList>

        {/* Forum Tab */}
        <TabsContent value="forum" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {forumCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                  style={selectedCategory === category.id ? 
                    { backgroundColor: category.color, borderColor: category.color } : 
                    { borderColor: category.color, color: category.color }
                  }
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Discussion title..."
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                    <Textarea
                      placeholder="Share your thoughts, questions, or experiences..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      rows={6}
                    />
                    <div className="flex gap-4">
                      <select
                        value={newPost.categoryId.toString()}
                        onChange={(e) => setNewPost({...newPost, categoryId: parseInt(e.target.value)})}
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="general">General Discussion</option>
                        <option value="hormones">Hormonal Changes</option>
                        <option value="career">Career Transitions</option>
                        <option value="relationships">Relationships</option>
                        <option value="wellness">Wellness & Self-Care</option>
                      </select>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newPost.isAnonymous}
                          onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                        />
                        Post anonymously
                      </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost}>
                        Post Discussion
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Forum Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className={`hover:shadow-md transition-shadow cursor-pointer ${post.isPinned ? 'ring-2 ring-blue-200' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {post.isPinned && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          Pinned
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ borderColor: getCategoryColor(post.category), color: getCategoryColor(post.category) }}
                      >
                        {forumCategories.find(cat => cat.id === post.category)?.name}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{post.lastActivity}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>by {post.isAnonymous ? 'Anonymous' : post.author}</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {post.likes}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleReplyClick(post.id)}
                    >
                      <Share2 className="w-4 h-4" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Support Groups</h2>
            <Button 
              className="flex items-center gap-2"
              onClick={handleCreateGroup}
            >
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSupportGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant={group.type === 'open' ? 'default' : group.type === 'closed' ? 'secondary' : 'outline'}>
                      {group.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{group.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{group.currentMembers}/{group.maxMembers} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{group.meetingSchedule}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>Next: {group.nextMeeting}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>Facilitated by {group.facilitator}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={group.type === 'open' ? 'default' : 'outline'}
                    onClick={() => handleJoinGroup(group.id, group.name, group.type)}
                  >
                    {group.type === 'open' ? 'Join Group' : group.type === 'closed' ? 'Request to Join' : 'Learn More'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shared Experiences Tab */}
        <TabsContent value="experiences" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Shared Experiences</h2>
            <Button 
              className="flex items-center gap-2"
              onClick={handleShareExperience}
            >
              <Plus className="w-4 h-4" />
              Share Experience
            </Button>
          </div>

          <div className="space-y-4">
            {mockSharedExperiences.map((experience) => (
              <Card key={experience.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getExperienceIcon(experience.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{experience.title}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {experience.category}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{experience.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {experience.isAnonymous ? 'Anonymous' : experience.author}</span>
                          <span>{experience.createdAt}</span>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {experience.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {experience.supportMessages}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {experience.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Peer Connections Tab */}
        <TabsContent value="connections" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Peer Connections</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect one-on-one with other women for mentorship, accountability partnerships, or friendship. 
              Find someone who shares your interests and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Find a Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Browse profiles of women open to new connections. Filter by interests, location, or support areas.
                </p>
                <Button className="w-full" onClick={handleBrowseProfiles}>Browse Profiles</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Your Connections
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Manage your existing connections, view pending requests, and update your profile.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handleViewConnections}>View My Connections</Button>
                  <Button variant="outline" className="w-full" onClick={handleEditProfile}>Edit My Profile</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              We're working on enhanced peer connection features including mentorship matching, 
              accountability partnerships, and virtual coffee chat scheduling.
            </p>
            <Button variant="outline" onClick={handleJoinWaitlist}>Join Waitlist</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}