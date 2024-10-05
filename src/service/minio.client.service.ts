import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';
@Injectable()
export class MinioClientService {
  constructor(
    private readonly minioService: MinioService,
    private readonly config: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new BadRequestException('Invalid file');
    }
    const fileMetaData = {
      'Content-Type': file.mimetype,
    };
    const tempFile = Date.now().toString();
    const hash = crypto.createHash('sha1').update(tempFile).digest('hex');
    const fileName = `${hash}-${file.originalname}`;
    try {
      await this.minioService.client.putObject(
        this.config.getOrThrow('MINIO_BUCKET'),
        fileName,
        file.buffer,
        null,
        fileMetaData,
      );
      return {
        url: `http://${this.config.get('MINIO_ENDPOINT')}:${this.config.get(
          'MINIO_PORT',
        )}/${this.config.get('MINIO_BUCKET')}/${fileName}`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Upload failed: ' + error.message);
    }
  }
}
