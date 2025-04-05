import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { R2ObjectService } from './r2-object.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { ResponseAPI } from 'src/common/responses/response';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt.guard';

@Controller('upload')
export class R2ObjectController {
  constructor(private r2ClientService: R2ObjectService) {}

  @Post()
//   @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseAPI<any>> {
    if (!file || !file.originalname) {
      throw new Error('Invalid file uploaded');
    }
    const key = `${uuid()}-${file.originalname}`;

    const upload = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.r2ClientService.r2Object.send(upload);
    const publicUrl = `https://pub-${process.env.R2_ACCOUNT_DEV}.r2.dev/${key}`;
    return {
      message: 'Upload successful!',
      success: true,
      data: {
        url: publicUrl,
      },
    };
  }
}
