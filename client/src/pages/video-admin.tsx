import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoUpload } from '@/components/ui/video-upload';
import { VideoPlayer } from '@/components/ui/video-player';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Upload, 
  Play, 
  Trash2, 
  Edit, 
  Calendar,
  User,
  FileVideo,
  Eye,
  Tag
} from 'lucide-react';

interface VideoData {
  id: number;
  filename: string;
  originalName: string;
  title?: string;
  description?: string;
  moduleId?: string;
  weekNumber?: number;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
  size: number;
  mimetype: string;
  isActive: boolean;
}

export default function VideoAdmin() {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['/api/videos'],
    retry: false,
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: async (videoId: number) => {
      await apiRequest('DELETE', `/api/videos/${videoId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      toast({
        title: "Video Deleted",
        description: "Video has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete video",
        variant: "destructive",
      });
    },
  });

  // Update video metadata mutation
  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<VideoData> }) => {
      return await apiRequest('PATCH', `/api/videos/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      setEditingVideo(null);
      toast({
        title: "Video Updated",
        description: "Video metadata has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update video",
        variant: "destructive",
      });
    },
  });

  const handleVideoUploadSuccess = (videoData: any) => {
    queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
    toast({
      title: "Upload Complete",
      description: `${videoData.originalName} has been uploaded successfully.`,
    });
  };

  const handleDeleteVideo = (videoId: number) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      deleteVideoMutation.mutate(videoId);
    }
  };

  const handleUpdateVideo = (updates: Partial<VideoData>) => {
    if (!editingVideo) return;
    updateVideoMutation.mutate({ id: editingVideo.id, updates });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileVideo className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Video Management</h1>
        <Badge variant="secondary">Admin Only</Badge>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Videos</TabsTrigger>
          <TabsTrigger value="manage">Manage Videos</TabsTrigger>
          <TabsTrigger value="preview">Preview Player</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload New Video</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUpload
                onUploadSuccess={handleVideoUploadSuccess}
                onUploadError={(error) => {
                  toast({
                    title: "Upload Failed",
                    description: error,
                    variant: "destructive",
                  });
                }}
                maxSizeMB={100}
                acceptedFormats={['mp4', 'webm', 'mov']}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <div className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">Loading videos...</div>
                </CardContent>
              </Card>
            ) : videos.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    No videos uploaded yet. Use the Upload tab to add videos.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video: VideoData) => (
                  <Card key={video.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {video.title || video.originalName}
                          </h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {video.filename}
                          </p>
                        </div>
                        <Badge variant={video.isActive ? "default" : "destructive"}>
                          {video.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span className="truncate">
                            {formatDate(video.uploadedAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileVideo className="h-3 w-3" />
                          <span>{formatFileSize(video.size)}</span>
                        </div>
                        {video.weekNumber && (
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>Week {video.weekNumber}</span>
                          </div>
                        )}
                        {video.uploadedBy && (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{video.uploadedBy}</span>
                          </div>
                        )}
                      </div>
                      
                      {video.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {video.description}
                        </p>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedVideo(video)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingVideo(video)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {selectedVideo ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedVideo.title || selectedVideo.originalName}</CardTitle>
              </CardHeader>
              <CardContent>
                <VideoPlayer
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  className="max-w-4xl mx-auto"
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  Select a video from the Manage tab to preview it here.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Video Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={editingVideo.title || ''}
                  onChange={(e) => setEditingVideo({
                    ...editingVideo,
                    title: e.target.value
                  })}
                  placeholder="Enter video title"
                />
              </div>
              
              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={editingVideo.description || ''}
                  onChange={(e) => setEditingVideo({
                    ...editingVideo,
                    description: e.target.value
                  })}
                  placeholder="Enter video description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="video-week">Week Number</Label>
                <Select
                  value={editingVideo.weekNumber?.toString() || ''}
                  onValueChange={(value) => setEditingVideo({
                    ...editingVideo,
                    weekNumber: value ? parseInt(value) : undefined
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Week</SelectItem>
                    {[1, 2, 3, 4, 5, 6].map(week => (
                      <SelectItem key={week} value={week.toString()}>
                        Week {week}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="video-module">Module ID</Label>
                <Input
                  id="video-module"
                  value={editingVideo.moduleId || ''}
                  onChange={(e) => setEditingVideo({
                    ...editingVideo,
                    moduleId: e.target.value
                  })}
                  placeholder="Enter module ID"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleUpdateVideo({
                    title: editingVideo.title,
                    description: editingVideo.description,
                    weekNumber: editingVideo.weekNumber,
                    moduleId: editingVideo.moduleId
                  })}
                  disabled={updateVideoMutation.isPending}
                  className="flex-1"
                >
                  {updateVideoMutation.isPending ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingVideo(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}