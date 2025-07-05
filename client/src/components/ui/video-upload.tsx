import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

export interface VideoUploadProps {
  onUploadSuccess?: (videoData: any) => void;
  onUploadError?: (error: string) => void;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

export function VideoUpload({
  onUploadSuccess,
  onUploadError,
  maxSizeMB = 100,
  acceptedFormats = ['mp4', 'webm', 'mov', 'avi'],
  className = ""
}: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      return `File format must be one of: ${acceptedFormats.join(', ')}`;
    }

    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Invalid File",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setUploadStatus('idle');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadStatus('success');
          onUploadSuccess?.(response.video);
          toast({
            title: "Upload Successful",
            description: "Video has been uploaded successfully.",
          });
        } else {
          const error = JSON.parse(xhr.responseText);
          setUploadStatus('error');
          onUploadError?.(error.message || 'Upload failed');
          toast({
            title: "Upload Failed",
            description: error.message || 'Failed to upload video',
            variant: "destructive",
          });
        }
        setUploading(false);
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        setUploadStatus('error');
        setUploading(false);
        const errorMessage = 'Network error occurred during upload';
        onUploadError?.(errorMessage);
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        });
      });

      xhr.open('POST', '/api/upload-video');
      xhr.send(formData);

    } catch (error) {
      setUploading(false);
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Upload Video</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-upload">Select Video File</Label>
              <Input
                id="video-upload"
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.map(format => `.${format}`).join(',')}
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Supported formats: {acceptedFormats.join(', ')}</p>
              <p>Maximum size: {maxSizeMB}MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {uploadStatus === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {uploadStatus === 'error' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                {!uploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={uploading || uploadStatus === 'success'}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : uploadStatus === 'success' ? 'Uploaded' : 'Upload Video'}
              </Button>
              {uploadStatus === 'success' && (
                <Button
                  variant="outline"
                  onClick={handleRemoveFile}
                >
                  Upload Another
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}