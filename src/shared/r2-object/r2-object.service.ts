import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';

export const r2Client = new S3Client({
  region: process.env.R2_REGION,
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

@Injectable()
export class R2ObjectService {
  private readonly r2Client = r2Client;

  get r2Object() {
    return this.r2Client;
  }
}
