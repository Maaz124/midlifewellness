import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/videos';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for video files only
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'), false);
  }
};

export const uploadVideo = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: fileFilter
});

// Video processing utilities
export interface VideoMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  duration?: number;
  resolution?: string;
  uploadedAt: Date;
  url: string;
}

export class VideoManager {
  static getVideoUrl(filename: string): string {
    return `/api/videos/${filename}`;
  }

  static async saveVideoMetadata(file: Express.Multer.File, uploadedBy?: string, title?: string, description?: string): Promise<VideoMetadata> {
    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      url: this.getVideoUrl(file.filename)
    };
  }

  static async deleteVideo(filename: string): Promise<boolean> {
    try {
      const filePath = path.join('uploads/videos', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }
}