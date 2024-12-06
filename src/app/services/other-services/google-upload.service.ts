import { Injectable, Provider } from '@nestjs/common';
import { google } from 'googleapis';
import { Buffer } from 'buffer';
import { Readable } from 'stream';

export abstract class UploadService {
  abstract uploadImage(file: Express.Multer.File);
  abstract getImage(field: string);
  abstract deleteImage(field: string);
}

@Injectable()
export class GoogleDriveUploadService implements UploadService {
  private drive;
  private config;
  private googleDriveFolderId;
  constructor() {
    this.config = JSON.parse(process.env.GOOGLE_DRIVE_CONFIG);
    this.googleDriveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.config.client_email,
        private_key: this.config.private_key,
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    this.drive = google.drive({ version: 'v3', auth });
  }
  public async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const { originalname, buffer } = file;

      const fileBuffer = Buffer.from(buffer);

      const media = {
        mimeType: file.mimetype,
        body: Readable.from([fileBuffer]),
      };

      const driveResponse = await this.drive.files.create({
        requestBody: {
          name: originalname,
          mimeType: file.mimetype,
          parents: [this.googleDriveFolderId],
        },
        media: media,
        fields: 'id',
      });

      const fileId = driveResponse.data.id;
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id',
      });

      return `https://drive.google.com/thumbnail?id=${response.data.id}`;
    } catch (e) {
      throw new Error(e);
    }
  }
  public async getImage(fileId: string): Promise<string> {
    try {
      return `https://drive.google.com/thumbnail?id=${fileId}`;
    } catch (e) {
      throw new Error(e);
    }
  }

  public async deleteImage(fileId: string): Promise<boolean> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
      return true;
    } catch (e) {
      throw new Error(`Failed to delete file with ID ${fileId}: ${e.message}`);
    }
  }
}

export const UploadServiceProvider: Provider<UploadService> = {
  provide: UploadService,
  useClass: GoogleDriveUploadService,
};
