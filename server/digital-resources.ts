import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

// Configure multer for PDF uploads
const storage = multer.memoryStorage();

export const uploadPDF = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

export interface PDFMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

export class DigitalResourceManager {
  private static uploadsDir = path.join(process.cwd(), 'uploads', 'resources');

  static init() {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  static getResourceUrl(filename: string): string {
    return `/api/resources/download/${filename}`;
  }

  static async savePDFFile(file: Express.Multer.File, customFilename?: string): Promise<PDFMetadata> {
    this.init();

    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = customFilename || `${timestamp}_${sanitizedOriginalName}`;
    const filePath = path.join(this.uploadsDir, filename);

    await writeFile(filePath, file.buffer);

    return {
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      url: this.getResourceUrl(filename),
    };
  }

  static async deletePDFFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting PDF file:', error);
      return false;
    }
  }

  static getFilePath(filename: string): string {
    return path.join(this.uploadsDir, filename);
  }

  static fileExists(filename: string): boolean {
    return fs.existsSync(this.getFilePath(filename));
  }
}